import type { APIRoute } from 'astro';
import {
  AGENT_SEARCH_CONFIG,
  AUTHOR_NAME,
  AUTHOR_NICKNAME,
  CONTENT_SIGNAL_POLICY,
  SITE_DESCRIPTION,
  SITE_URL,
  SOCIAL_LINKS,
} from '../../consts';

export const GET: APIRoute = async () => {
  const catalog = {
    schema_version: '1.0',
    name: `${AUTHOR_NAME} (${AUTHOR_NICKNAME})`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    contact: `mailto:${SOCIAL_LINKS.email}`,
    content_signal: CONTENT_SIGNAL_POLICY,
    search: {
      protocol: 'cloudflare-search-for-agents',
      endpoint: AGENT_SEARCH_CONFIG.baseEndpoint,
      url_template: AGENT_SEARCH_CONFIG.endpoint,
      methods: AGENT_SEARCH_CONFIG.supportedMethods,
      parameters: {
        q: 'Keywords or natural-language search query',
        max_num_results: 'Maximum number of Markdown passages to return (default 10, max 50)',
        score_threshold: 'Minimum relevance score between 0 and 1 (default 0.15)',
      },
      response_format: 'text/markdown',
      instructions: AGENT_SEARCH_CONFIG.instructions,
      documentation: AGENT_SEARCH_CONFIG.documentation,
    },
    resources: [
      {
        type: 'search-api',
        url: `${SITE_URL}/.well-known/search`,
        media_type: 'text/markdown',
        description: 'Site-wide Markdown passage retrieval for AI agents (GET & HTTP QUERY)',
      },
      {
        type: 'llms-txt',
        url: `${SITE_URL}/llms.txt`,
        media_type: 'text/plain',
        description: 'Curated overview of identity, projects, experience, and writing for LLMs',
      },
      {
        type: 'llms-full-txt',
        url: `${SITE_URL}/llms-full.txt`,
        media_type: 'text/plain',
        description: 'Complete single-file plain-text/Markdown context of the entire portfolio',
      },
      {
        type: 'markdown-negotiation',
        url: `${SITE_URL}/`,
        media_type: 'text/markdown',
        description: 'Send Accept: text/markdown to any page URL or fetch the .md alternate directly',
        alternates: [
          `${SITE_URL}/index.md`,
          `${SITE_URL}/about.md`,
          `${SITE_URL}/project.md`,
          `${SITE_URL}/blog.md`,
        ],
      },
      {
        type: 'sitemap',
        url: `${SITE_URL}/sitemap.xml`,
        media_type: 'application/xml',
        description: 'Canonical XML sitemap of all portfolio pages and discovery files',
      },
    ],
  };

  return new Response(JSON.stringify(catalog, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Signal': CONTENT_SIGNAL_POLICY,
      'Access-Control-Allow-Origin': '*',
    },
  });
};
