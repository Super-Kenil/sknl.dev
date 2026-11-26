import type { PagesContext } from '../src/utils/agent-search';
import {
  corsPreflightResponse,
  filterUpstreamSearchPayload,
  forwardToAiSearch,
  methodNotAllowedJson,
  type UpstreamSearchPayload,
} from '../src/utils/ai-search-proxy';

export async function onRequest(context: PagesContext): Promise<Response> {
  const { request } = context;

  if (request.method === 'OPTIONS') {
    return corsPreflightResponse(request);
  }

  if (request.method !== 'POST') {
    return methodNotAllowedJson();
  }

  const rawText = await request.text();
  let requestedMaxResults: number | undefined;
  let bodyForUpstream: string = rawText;

  try {
    const parsed = JSON.parse(rawText) as {
      ai_search_options?: {
        retrieval?: {
          max_num_results?: number;
        };
      };
    };
    const maxNum = parsed?.ai_search_options?.retrieval?.max_num_results;
    if (typeof maxNum === 'number' && Number.isFinite(maxNum) && maxNum > 0) {
      requestedMaxResults = maxNum;
      // Request a few extra chunks so filtering out non-HTML files still fills the requested count.
      parsed.ai_search_options!.retrieval!.max_num_results = Math.min(50, maxNum + 10);
      bodyForUpstream = JSON.stringify(parsed);
    }
  } catch {
    // Pass raw body through unchanged so upstream validation errors match natively.
  }

  const upstream = await forwardToAiSearch(request, 'search', bodyForUpstream);
  const contentType = upstream.headers.get('Content-Type') ?? '';
  if (!upstream.ok || !contentType.includes('application/json')) {
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: new Headers(upstream.headers),
    });
  }

  const payload = (await upstream.json()) as UpstreamSearchPayload;
  const cleaned = filterUpstreamSearchPayload(payload, requestedMaxResults);
  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete('content-length');

  return new Response(JSON.stringify(cleaned), {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}
