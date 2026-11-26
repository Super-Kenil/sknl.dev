import type { APIRoute } from 'astro';
import { SITE_URL } from '../consts';
import { buildAgentSearchIndex } from '../utils/agent-content';

export const GET: APIRoute = async () => {
  const chunks = await buildAgentSearchIndex();
  return new Response(
    JSON.stringify({
      version: 1,
      site: SITE_URL,
      generatedAt: new Date().toISOString(),
      chunks,
    }),
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }
  );
};
