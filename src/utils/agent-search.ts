import { AGENT_SEARCH_CONFIG, CONTENT_SIGNAL_POLICY, SITE_URL } from '../consts';
import type { AgentSearchChunk } from './agent-content';

export type PagesEnv = {
  ASSETS: {
    fetch: (input: RequestInfo | URL) => Promise<Response>;
  };
};

export type PagesContext = {
  request: Request;
  env: PagesEnv;
  next: () => Promise<Response>;
};

export type ScoredAgentChunk = AgentSearchChunk & {
  score: number;
};

const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'can', 'do', 'does',
  'for', 'from', 'how', 'i', 'in', 'is', 'it', 'me', 'my', 'of', 'on',
  'or', 'that', 'the', 'this', 'to', 'was', 'what', 'when', 'where',
  'which', 'who', 'why', 'with', 'you', 'your',
]);

const TERM_ALIASES: Record<string, string[]> = {
  ts: ['typescript'],
  typescript: ['ts'],
  js: ['javascript'],
  javascript: ['js'],
  nextjs: ['next.js', 'next'],
  'next.js': ['nextjs'],
  wasm: ['webassembly'],
  webassembly: ['wasm'],
  automation: ['automate', 'automated'],
  automate: ['automation'],
  pdfs: ['pdf'],
  pdf: ['pdfs'],
  cv: ['resume'],
  resume: ['cv'],
  hire: ['hiring', 'freelance', 'contact'],
  hiring: ['hire', 'freelance'],
  rag: ['retrieval'],
  css: ['tailwind', 'stylex'],
};

/**
 * Checks whether the HTTP Accept header explicitly prefers text/markdown over text/html.
 */
export function prefersMarkdown(acceptHeader: string | null): boolean {
  if (!acceptHeader) return false;

  let markdownQ = -1;
  let htmlQ = -1;

  for (const part of acceptHeader.split(',')) {
    const segments = part.trim().split(';');
    const mediaType = segments[0]?.trim().toLowerCase();
    if (!mediaType) continue;

    let q = 1;
    for (const param of segments.slice(1)) {
      const [key, rawValue] = param.split('=').map((s) => s.trim().toLowerCase());
      if (key === 'q' && rawValue) {
        const parsed = Number.parseFloat(rawValue);
        if (!Number.isNaN(parsed)) q = parsed;
      }
    }

    if (mediaType === 'text/markdown') {
      markdownQ = Math.max(markdownQ, q);
    } else if (mediaType === 'text/html' || mediaType === 'application/xhtml+xml') {
      htmlQ = Math.max(htmlQ, q);
    }
  }

  if (markdownQ <= 0) return false;
  if (htmlQ < 0) return true;
  return markdownQ >= htmlQ;
}

/**
 * Maps an HTML page pathname to its static .md mirror asset path, or null for non-HTML assets.
 */
export function resolveMarkdownAssetPath(pathname: string): string | null {
  if (
    pathname.startsWith('/.well-known/') ||
    pathname.startsWith('/_astro/') ||
    pathname === '/search' ||
    pathname === '/mcp'
  ) {
    return null;
  }

  const normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  if (normalized === '/') return '/index.md';

  const lastSegment = normalized.slice(normalized.lastIndexOf('/') + 1);
  if (lastSegment.includes('.')) {
    return null;
  }

  return `${normalized}.md`;
}

export function estimateMarkdownTokens(markdown: string): number {
  return Math.max(1, Math.ceil(markdown.length / 4));
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+.#-]+/i)
    .map((token) => token.replace(/^[.-]+|[.-]+$/g, ''))
    .filter((token) => token.length > 0);
}

function buildQueryTerms(query: string): string[] {
  const rawTokens = tokenize(query);
  const meaningful = rawTokens.filter((token) => !STOPWORDS.has(token));
  const base = meaningful.length > 0 ? meaningful : rawTokens;
  return Array.from(new Set(base));
}

function countOccurrences(tokens: string[], target: string): number {
  let count = 0;
  for (const token of tokens) {
    if (token === target) {
      count += 1;
    } else if (target.length >= 4 && token.startsWith(target)) {
      count += 0.6;
    }
  }
  return count;
}

export function searchAgentChunks(
  chunks: AgentSearchChunk[],
  options: {
    query: string;
    maxNumResults?: number;
    scoreThreshold?: number;
  }
): ScoredAgentChunk[] {
  const normalizedQuery = options.query.trim().toLowerCase();
  if (!normalizedQuery || chunks.length === 0) return [];

  const maxNumResults = Math.min(50, Math.max(1, Math.floor(options.maxNumResults ?? 10)));
  const scoreThreshold = Math.min(1, Math.max(0, options.scoreThreshold ?? 0.15));
  const queryTerms = buildQueryTerms(normalizedQuery);
  if (queryTerms.length === 0) return [];

  const docData = chunks.map((chunk) => {
    const titleTokens = tokenize(chunk.title);
    const sectionTokens = tokenize(chunk.section ?? '');
    const tagTokens = tokenize(chunk.tags.join(' '));
    const urlTokens = tokenize(chunk.url.replace(SITE_URL, ''));
    const bodyTokens = tokenize(chunk.content);
    const allTokens = new Set([...titleTokens, ...sectionTokens, ...tagTokens, ...urlTokens, ...bodyTokens]);
    return {
      chunk,
      titleTokens,
      sectionTokens,
      tagTokens,
      urlTokens,
      bodyTokens,
      allTokens,
      titleLower: `${chunk.title} ${chunk.section ?? ''}`.toLowerCase(),
      bodyLower: chunk.content.toLowerCase(),
    };
  });

  const avgBodyLen =
    docData.reduce((sum, item) => sum + item.bodyTokens.length, 0) / Math.max(1, docData.length);

  const idf = new Map<string, number>();
  for (const term of queryTerms) {
    const df = docData.reduce((count, doc) => {
      const aliases = TERM_ALIASES[term] ?? [];
      const matches = doc.allTokens.has(term) || aliases.some((alias) => doc.allTokens.has(alias));
      return count + (matches ? 1 : 0);
    }, 0);
    idf.set(term, Math.log(1 + (docData.length - df + 0.5) / (df + 0.5)));
  }

  const k1 = 1.4;
  const b = 0.65;
  const scored: ScoredAgentChunk[] = [];

  for (const doc of docData) {
    let rawScore = 0;
    let matchedTerms = 0;

    for (const term of queryTerms) {
      const termIdf = idf.get(term) ?? 1;
      const aliases = TERM_ALIASES[term] ?? [];

      const countWithAliases = (tokens: string[]): number => {
        let total = countOccurrences(tokens, term);
        for (const alias of aliases) {
          total += countOccurrences(tokens, alias) * 0.75;
        }
        return total;
      };

      const titleHits = countWithAliases(doc.titleTokens);
      const sectionHits = countWithAliases(doc.sectionTokens);
      const tagHits = countWithAliases(doc.tagTokens);
      const urlHits = countWithAliases(doc.urlTokens);
      const bodyHits = countWithAliases(doc.bodyTokens);

      const weightedTf =
        titleHits * 3.5 + sectionHits * 2.5 + tagHits * 3.0 + urlHits * 2.0 + bodyHits * 1.0;

      if (weightedTf > 0) {
        matchedTerms += 1;
        const normFactor = 1 - b + b * (doc.bodyTokens.length / Math.max(1, avgBodyLen));
        const bm25 = (weightedTf * (k1 + 1)) / (weightedTf + k1 * normFactor);
        rawScore += termIdf * bm25;
      }
    }

    if (matchedTerms === 0) continue;

    if (normalizedQuery.length >= 3) {
      if (doc.titleLower.includes(normalizedQuery)) {
        rawScore += 5.0;
      } else if (doc.bodyLower.includes(normalizedQuery)) {
        rawScore += 2.5;
      }
    }

    const coverage = matchedTerms / queryTerms.length;
    const saturationScore = rawScore / (rawScore + 4.5);
    const normalizedScore = Number((saturationScore * (0.45 + 0.55 * coverage)).toFixed(4));

    if (normalizedScore >= scoreThreshold) {
      scored.push({
        ...doc.chunk,
        score: normalizedScore,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxNumResults);
}

export function formatSearchResultsMarkdown(query: string, results: ScoredAgentChunk[]): string {
  const lines: string[] = [
    '---',
    `query: ${JSON.stringify(query)}`,
    `results_count: ${results.length}`,
    `endpoint: ${JSON.stringify(AGENT_SEARCH_CONFIG.baseEndpoint)}`,
    `content_signal: ${JSON.stringify(CONTENT_SIGNAL_POLICY)}`,
    '---',
    '',
    `# Search Results for: "${query}"`,
    '',
  ];

  if (results.length === 0) {
    lines.push(
      'No matching passages met the score threshold.',
      '',
      'Try broader keywords, or inspect the site overview endpoints directly:',
      `- [Site Overview (llms.txt)](${SITE_URL}/llms.txt)`,
      `- [Full Portfolio Context (llms-full.txt)](${SITE_URL}/llms-full.txt)`,
      `- [About & Experience](${SITE_URL}/about.md)`,
      `- [Projects & Free Tools](${SITE_URL}/project.md)`,
      `- [Technical Blog](${SITE_URL}/blog.md)`,
    );
    return `${lines.join('\n')}\n`;
  }

  results.forEach((result, index) => {
    const heading = result.section && result.section !== result.title
      ? `${result.title} — ${result.section}`
      : result.title;

    lines.push(
      `## ${index + 1}. ${heading}`,
      '',
      `- **Source:** ${result.url}`,
      `- **Markdown:** ${result.markdownUrl}`,
      `- **Relevance Score:** ${result.score.toFixed(2)}`,
      ...(result.updatedAt ? [`- **Updated:** ${result.updatedAt}`] : []),
      ...(result.tags.length ? [`- **Tags:** ${result.tags.join(', ')}`] : []),
      '',
      result.content.trim(),
      '',
      '---',
      '',
    );
  });

  return `${lines.join('\n').trim()}\n`;
}

export function formatSearchHelpMarkdown(message: string): string {
  return [
    `# Search for Agents — ${SITE_URL}`,
    '',
    message,
    '',
    '## Usage',
    '',
    '### GET',
    '```bash',
    `curl --get "${AGENT_SEARCH_CONFIG.baseEndpoint}" --data-urlencode "q=Who is Kenil Sudani?"`,
    '```',
    '',
    '### HTTP QUERY (RFC 10008)',
    '```bash',
    `curl -X QUERY "${AGENT_SEARCH_CONFIG.baseEndpoint}" \\`,
    '  --header "Content-Type: application/json" \\',
    '  --data \'{"q":"free browser PDF toolkit"}\'',
    '```',
    '',
    '## Optional Parameters',
    '- `q`: Search keywords or natural-language question (required)',
    '- `max_num_results` (or `limit`): Maximum chunks to return (default `10`, max `50`)',
    '- `score_threshold`: Minimum relevance score `0..1` (default `0.15`)',
    '',
  ].join('\n');
}
