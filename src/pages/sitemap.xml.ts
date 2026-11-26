import type { APIRoute } from 'astro';

import { SITE_URL } from '../consts';
import { formatIsoDate, loadSortedSiteContent } from '../utils/site-content';

type SitemapUrl = {
  loc: string;
  lastmod?: string;
  priority: string;
  changefreq: string;
};

export const GET: APIRoute = async () => {
  const { projects, posts } = await loadSortedSiteContent();

  const site = SITE_URL;
  const latest = formatIsoDate(new Date(Math.max(...posts.map((p) => (p.data.updatedDate ?? p.data.date).getTime()))));

  const urls: SitemapUrl[] = [
    { loc: `${site}/`, lastmod: latest, priority: '1.0', changefreq: 'weekly' },
    { loc: `${site}/about`, lastmod: latest, priority: '0.9', changefreq: 'monthly' },
    { loc: `${site}/project`, lastmod: latest, priority: '0.9', changefreq: 'monthly' },
    ...projects.map((project) => ({
      loc: `${site}/project/${project.id}`,
      lastmod: latest,
      priority: '0.8',
      changefreq: 'monthly',
    })),
    { loc: `${site}/blog`, lastmod: latest, priority: '0.8', changefreq: 'weekly' },
    ...posts.map((post) => ({
      loc: `${site}/blog/${post.id}`,
      lastmod: formatIsoDate(post.data.updatedDate ?? post.data.date),
      priority: '0.7',
      changefreq: 'yearly',
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `
    <lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
