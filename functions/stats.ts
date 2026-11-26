import type { PagesContext } from '../src/utils/agent-search';
import {
  corsPreflightResponse,
  forwardToAiSearch,
  methodNotAllowedJson,
} from '../src/utils/ai-search-proxy';

export async function onRequest(context: PagesContext): Promise<Response> {
  const { request } = context;

  if (request.method === 'OPTIONS') {
    return corsPreflightResponse(request);
  }

  if (request.method !== 'POST') {
    return methodNotAllowedJson();
  }

  const upstream = await forwardToAiSearch(request, 'stats');
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: new Headers(upstream.headers),
  });
}
