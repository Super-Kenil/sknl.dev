import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import { SITE_URL } from '../consts';

type SitemapUrl = {
  loc: string;
  lastmod?: string;
  priority: string;
  changefreq: string;
};

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');

  const site = SITE_URL;

  const urls: SitemapUrl[] = [
    { loc: site, priority: '1.0', changefreq: 'weekly' },
    { loc: `${site}/about`, priority: '0.9', changefreq: 'monthly' },
    { loc: `${site}/blog`, priority: '0.8', changefreq: 'weekly' },
    ...posts.map(post => ({
      loc: `${site}/blog/${post.id}`,
      lastmod: post.data.date.toISOString().split('T')[0],
      priority: '0.7',
      changefreq: 'yearly'
    })),
    { loc: `${site}/project`, priority: '0.8', changefreq: 'monthly' },
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
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
