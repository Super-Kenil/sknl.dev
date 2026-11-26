import { AI_SEARCH_CONFIG } from '../consts';

const FORWARDED_REQUEST_HEADERS = [
  'accept',
  'accept-language',
  'content-type',
  'cf-ai-search-source',
  'origin',
  'referer',
  'user-agent',
] as const;

const EXCLUDED_SEARCH_PATH_PATTERN =
  /^\/(llms\.txt|llms-full\.txt|agent-search-index\.json|sitemap\.xml|\.well-known\/.*)$|\.(txt|json|xml|md)$/i;

export type UpstreamSearchChunk = {
  item?: {
    key?: string;
    metadata?: {
      title?: string;
      description?: string;
      image?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export type UpstreamSearchPayload = {
  success?: boolean;
  result?: {
    chunks?: UpstreamSearchChunk[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export function corsPreflightResponse(request: Request): Response {
  const origin = request.headers.get('Origin') ?? '*';
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*, Authorization',
      'Access-Control-Max-Age': '300',
      Vary: 'Origin',
    },
  });
}

export function methodNotAllowedJson(): Response {
  return new Response(
    JSON.stringify({
      errors: [{ message: 'method not allowed; this endpoint only accepts POST', code: 60019 }],
      success: false,
      result: {},
    }),
    {
      status: 405,
      headers: {
        Allow: 'POST, OPTIONS',
        'Content-Type': 'application/json; charset=utf-8',
      },
    }
  );
}

export function isSearchableChunk(chunk: UpstreamSearchChunk): boolean {
  const title = chunk.item?.metadata?.title;
  if (typeof title !== 'string' || title.trim().length === 0) {
    return false;
  }

  const key = chunk.item?.key;
  if (typeof key !== 'string' || key.trim().length === 0) {
    return false;
  }

  try {
    const pathname = new URL(key).pathname;
    if (EXCLUDED_SEARCH_PATH_PATTERN.test(pathname)) {
      return false;
    }
  } catch {
    if (EXCLUDED_SEARCH_PATH_PATTERN.test(key)) {
      return false;
    }
  }

  return true;
}

export function filterUpstreamSearchPayload(
  payload: UpstreamSearchPayload,
  maxNumResults?: number
): UpstreamSearchPayload {
  const chunks = payload.result?.chunks;
  if (!Array.isArray(chunks)) return payload;

  const filtered = chunks.filter(isSearchableChunk);
  const sliced =
    typeof maxNumResults === 'number' && maxNumResults > 0
      ? filtered.slice(0, maxNumResults)
      : filtered;

  return {
    ...payload,
    result: {
      ...payload.result,
      chunks: sliced,
    },
  };
}

export async function forwardToAiSearch(
  request: Request,
  path: 'search' | 'stats',
  bodyOverride?: ArrayBuffer | string
): Promise<Response> {
  const headers = new Headers();
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  if (!headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  return fetch(`${AI_SEARCH_CONFIG.publicBaseUrl}${path}`, {
    method: 'POST',
    headers,
    body: bodyOverride ?? (await request.arrayBuffer()),
  });
}
