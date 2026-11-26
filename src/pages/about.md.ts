import type { APIRoute } from 'astro';
import { markdownResponse, renderAboutMarkdown } from '../utils/agent-content';

export const GET: APIRoute = async () => markdownResponse(await renderAboutMarkdown());
