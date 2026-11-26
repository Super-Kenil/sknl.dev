import { CONTENT_SIGNAL_POLICY, SITE_URL } from '../src/consts';
import {
  estimateMarkdownTokens,
  prefersMarkdown,
  resolveMarkdownAssetPath,
  type PagesContext,
} from '../src/utils/agent-search';

function mergeVaryAccept(existingVary: string | null): string {
  if (!existingVary) return 'Accept';
  const values = existingVary
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  if (values.some((part) => part.toLowerCase() === 'accept')) {
    return values.join(', ');
  }
  return [...values, 'Accept'].join(', ');
}

function buildDiscoveryLinks(pathname: string, mdPath: string | null): string {
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  const links: string[] = [
    `<${SITE_URL}/.well-known/ai-catalog.json>; rel="ai-catalog"`,
  ];
  if (mdPath) {
    links.push(`<${SITE_URL}${mdPath}>; rel="alternate"; type="text/markdown"`);
  }
  if (normalized !== '/') {
    links.push(`<${SITE_URL}${normalized}>; rel="canonical"`);
  } else {
    links.push(`<${SITE_URL}/>; rel="canonical"`);
  }
  return links.join(', ');
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const { request, env } = context;

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return context.next();
  }

  const url = new URL(request.url);
  const mdPath = resolveMarkdownAssetPath(url.pathname);

  if (mdPath && prefersMarkdown(request.headers.get('Accept'))) {
    const mdAsset = await env.ASSETS.fetch(new URL(mdPath, request.url));
    if (mdAsset.ok) {
      const text = await mdAsset.text();
      const headers = new Headers(mdAsset.headers);
      headers.set('Content-Type', 'text/markdown; charset=utf-8');
      headers.set('Content-Signal', CONTENT_SIGNAL_POLICY);
      headers.set('Vary', mergeVaryAccept(headers.get('Vary')));
      headers.set('x-markdown-tokens', String(estimateMarkdownTokens(text)));
      headers.set('Link', buildDiscoveryLinks(url.pathname, mdPath));
      return new Response(request.method === 'HEAD' ? null : text, {
        status: 200,
        headers,
      });
    }
  }

  const response = await context.next();
  const contentType = response.headers.get('Content-Type') ?? '';
  if (!contentType.includes('text/html')) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set('Content-Signal', CONTENT_SIGNAL_POLICY);
  headers.set('Vary', mergeVaryAccept(headers.get('Vary')));
  if (mdPath && response.status === 200) {
    headers.set('Link', buildDiscoveryLinks(url.pathname, mdPath));
  }

  if (request.method === 'HEAD') {
    await response.body?.cancel();
    return new Response(null, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
