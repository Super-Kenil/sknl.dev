import type { APIRoute } from 'astro';
import { markdownResponse, renderProjectsIndexMarkdown } from '../utils/agent-content';

export const GET: APIRoute = async () => markdownResponse(await renderProjectsIndexMarkdown());
