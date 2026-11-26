import { getCollection, getEntry } from 'astro:content';

export async function loadSortedSiteContent() {
  const [projects, posts, gigs, aboutEntry] = await Promise.all([
    getCollection('project'),
    getCollection('blog'),
    getCollection('gig'),
    getEntry('about', 'about'),
  ]);

  const sortedProjects = [...projects].sort((a, b) => a.data.order - b.data.order);
  const sortedPosts = [...posts].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return {
    projects: sortedProjects,
    posts: sortedPosts,
    gigs,
    aboutEntry,
  };
}

export function formatIsoDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
