export const SITE_URL = 'https://sknl.dev';
export const ALT_SITE_URL = 'https://superkenil.com';
export const SITE_TITLE = 'Super Kenil';
export const AUTHOR_NAME = 'Kenil Sudani';
export const AUTHOR_NICKNAME = 'Super Kenil';
export const AUTHOR_ROLE = 'Full-Stack Software Engineer';
export const SITE_DESCRIPTION = 'Full-stack developer from Gujarat, India. Building free browser tools, open-source developer utilities, and AI automation systems.';
export const AUTHOR_SKILLS = [
	'TypeScript',
	'JavaScript',
	'React',
	'Next.js',
	'Astro',
	'Angular',
	'Vue',
	'Node.js',
	'Tailwind CSS',
	'WebAssembly',
	'Rust',
	'AI Automation',
] as const;

export const SOCIAL_LINKS = {
	github: 'https://github.com/Super-Kenil',
	twitter: 'https://x.com/super_kenil',
	linkedin: 'https://linkedin.com/in/super-kenil',
	bluesky: 'https://bsky.app/profile/sknl.dev',
	npm: 'https://www.npmjs.com/~super-kenil',
	email: 'hello@sknl.dev',
};

export const CONTENT_SIGNAL_POLICY = 'ai-train=yes, search=yes, ai-input=yes';

export const AGENT_SEARCH_CONFIG = {
	instructions:
		'Use this search API to find relevant content across this site with keywords or natural-language queries, instead of crawling individual pages. Results are returned in Markdown.',
	endpoint: `${SITE_URL}/.well-known/search?q={query}`,
	baseEndpoint: `${SITE_URL}/.well-known/search`,
	method: 'GET',
	supportedMethods: ['GET', 'QUERY'] as const,
	documentation: 'https://developers.cloudflare.com/ai-search/how-to/search-for-agents/',
} as const;

export const AI_SEARCH_CONFIG = {
	publicBaseUrl: 'https://d8d3ea85-62d6-43cf-a880-2be873706ff7.search.ai.cloudflare.com/',
	customBaseUrl: `${SITE_URL}/`,
	snippetScriptUrl:
		'https://d8d3ea85-62d6-43cf-a880-2be873706ff7.search.ai.cloudflare.com/assets/v0.0.40/search-snippet.es.js',
} as const;
