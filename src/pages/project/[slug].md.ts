import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { markdownResponse, renderProjectDetailMarkdown } from '../../utils/agent-content';

export async function getStaticPaths() {
  const projects = await getCollection('project');
  return projects.map((project) => ({
    params: { slug: project.id },
    props: { project },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const project = props.project as Parameters<typeof renderProjectDetailMarkdown>[0];
  return markdownResponse(renderProjectDetailMarkdown(project));
};
