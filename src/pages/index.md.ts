import type { APIRoute } from 'astro';
import { markdownResponse, renderHomeMarkdown } from '../utils/agent-content';

export const GET: APIRoute = async () => markdownResponse(await renderHomeMarkdown());
