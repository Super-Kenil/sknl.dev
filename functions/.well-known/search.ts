import { CONTENT_SIGNAL_POLICY, SITE_URL } from '../../src/consts';
import type { AgentSearchChunk } from '../../src/utils/agent-content';
import {
  estimateMarkdownTokens,
  formatSearchHelpMarkdown,
  formatSearchResultsMarkdown,
  searchAgentChunks,
  type PagesContext,
} from '../../src/utils/agent-search';

type SearchIndexPayload = {
  chunks: AgentSearchChunk[];
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, QUERY, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
};

type ParsedSearchInput =
  | { ok: true; query: string; maxNumResults?: number; scoreThreshold?: number }
  | { ok: false; status: number; message: string };

function parseOptionalNumber(raw: unknown): number | undefined {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string' && raw.trim() !== '') {
    const parsed = Number.parseFloat(raw);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

async function parseSearchRequest(request: Request): Promise<ParsedSearchInput> {
  const url = new URL(request.url);
  const urlQuery = (url.searchParams.get('q') ?? url.searchParams.get('query') ?? '').trim();
  const urlMax = parseOptionalNumber(
    url.searchParams.get('max_num_results') ?? url.searchParams.get('limit')
  );
  const urlThreshold = parseOptionalNumber(url.searchParams.get('score_threshold'));

  if (request.method === 'GET' || request.method === 'HEAD') {
    if (!urlQuery) {
      return { ok: false, status: 400, message: 'Missing required search query parameter `q`.' };
    }
    return { ok: true, query: urlQuery, maxNumResults: urlMax, scoreThreshold: urlThreshold };
  }

  const contentType = (request.headers.get('Content-Type') ?? '').toLowerCase();
  const rawBody = (await request.text()).trim();

  if (!rawBody) {
    if (urlQuery) {
      return { ok: true, query: urlQuery, maxNumResults: urlMax, scoreThreshold: urlThreshold };
    }
    return { ok: false, status: 400, message: 'Missing search query in QUERY body or `q` parameter.' };
  }

  if (contentType.includes('application/json')) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      return { ok: false, status: 400, message: 'Invalid JSON request body.' };
    }
    if (!parsed || typeof parsed !== 'object') {
      return { ok: false, status: 400, message: 'JSON body must be an object with `q` or `query`.' };
    }
    const obj = parsed as Record<string, unknown>;
    const bodyQuery =
      typeof obj.q === 'string'
        ? obj.q.trim()
        : typeof obj.query === 'string'
          ? obj.query.trim()
          : urlQuery;
    if (!bodyQuery) {
      return { ok: false, status: 400, message: 'JSON body must include non-empty `q` or `query`.' };
    }
    return {
      ok: true,
      query: bodyQuery,
      maxNumResults: parseOptionalNumber(obj.max_num_results ?? obj.limit) ?? urlMax,
      scoreThreshold: parseOptionalNumber(obj.score_threshold) ?? urlThreshold,
    };
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const form = new URLSearchParams(rawBody);
    const formQuery = (form.get('q') ?? form.get('query') ?? urlQuery).trim();
    if (!formQuery) {
      return { ok: false, status: 400, message: 'Form body must include non-empty `q` or `query`.' };
    }
    return {
      ok: true,
      query: formQuery,
      maxNumResults: parseOptionalNumber(form.get('max_num_results') ?? form.get('limit')) ?? urlMax,
      scoreThreshold: parseOptionalNumber(form.get('score_threshold')) ?? urlThreshold,
    };
  }

  return {
    ok: true,
    query: rawBody,
    maxNumResults: urlMax,
    scoreThreshold: urlThreshold,
  };
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (!['GET', 'HEAD', 'QUERY'].includes(request.method)) {
    return new Response(
      formatSearchHelpMarkdown(`Method \`${request.method}\` is not supported. Use \`GET\` or \`QUERY\`.`),
      {
        status: 405,
        headers: {
          ...CORS_HEADERS,
          Allow: 'GET, HEAD, QUERY, OPTIONS',
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Signal': CONTENT_SIGNAL_POLICY,
        },
      }
    );
  }

  const parsed = await parseSearchRequest(request);
  if (!parsed.ok) {
    const helpMarkdown = formatSearchHelpMarkdown(parsed.message);
    return new Response(request.method === 'HEAD' ? null : helpMarkdown, {
      status: parsed.status,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Signal': CONTENT_SIGNAL_POLICY,
        'x-markdown-tokens': String(estimateMarkdownTokens(helpMarkdown)),
        'Cache-Control': 'no-store',
      },
    });
  }

  const indexAsset = await env.ASSETS.fetch(new URL('/agent-search-index.json', request.url));
  if (!indexAsset.ok) {
    return new Response('Search index unavailable.', {
      status: 503,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  const payload = (await indexAsset.json()) as SearchIndexPayload;
  const results = searchAgentChunks(payload.chunks ?? [], {
    query: parsed.query,
    maxNumResults: parsed.maxNumResults,
    scoreThreshold: parsed.scoreThreshold,
  });

  const accept = (request.headers.get('Accept') ?? '').toLowerCase();
  const wantsJson = accept.includes('application/json') && !accept.includes('text/markdown');
  const cacheControl = request.method === 'QUERY' ? 'no-store' : 'public, max-age=300';

  if (wantsJson) {
    const jsonBody = JSON.stringify(
      {
        site: SITE_URL,
        query: parsed.query,
        total: results.length,
        results,
      },
      null,
      2
    );
    return new Response(request.method === 'HEAD' ? null : jsonBody, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Signal': CONTENT_SIGNAL_POLICY,
        Vary: 'Accept',
        'Cache-Control': cacheControl,
      },
    });
  }

  const markdown = formatSearchResultsMarkdown(parsed.query, results);
  return new Response(request.method === 'HEAD' ? null : markdown, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Signal': CONTENT_SIGNAL_POLICY,
      Vary: 'Accept',
      'x-markdown-tokens': String(estimateMarkdownTokens(markdown)),
      'Cache-Control': cacheControl,
    },
  });
}
