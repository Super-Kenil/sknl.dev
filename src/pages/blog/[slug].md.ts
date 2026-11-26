import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { markdownResponse, renderBlogDetailMarkdown } from '../../utils/agent-content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const post = props.post as Parameters<typeof renderBlogDetailMarkdown>[0];
  return markdownResponse(renderBlogDetailMarkdown(post));
};
