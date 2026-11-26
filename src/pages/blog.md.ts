import type { APIRoute } from 'astro';
import { markdownResponse, renderBlogIndexMarkdown } from '../utils/agent-content';

export const GET: APIRoute = async () => markdownResponse(await renderBlogIndexMarkdown());
