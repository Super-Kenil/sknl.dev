import type { APIRoute } from 'astro';

import {
  ALT_SITE_URL,
  AUTHOR_NAME,
  AUTHOR_NICKNAME,
  AUTHOR_ROLE,
  AUTHOR_SKILLS,
  SITE_DESCRIPTION,
  SITE_URL,
  SOCIAL_LINKS,
} from '../consts';
import { formatIsoDate, loadSortedSiteContent } from '../utils/site-content';

export const GET: APIRoute = async () => {
  const { projects, posts, gigs } = await loadSortedSiteContent();

  const lines: string[] = [
    `# ${AUTHOR_NAME} (${AUTHOR_NICKNAME})`,
    '',
    `> ${SITE_DESCRIPTION} Primary portfolio: ${SITE_URL} (secondary owned domain: ${ALT_SITE_URL}). Available for full-stack software engineering roles and freelance projects.`,
    '',
    '## Overview',
    '',
    `- **Name:** ${AUTHOR_NAME} (${AUTHOR_NICKNAME})`,
    `- **Role:** ${AUTHOR_ROLE}`,
    '- **Location:** Gujarat, India',
    '- **Availability:** Open to full-time engineering roles and freelance inquiries',
    `- **Core Stack:** ${AUTHOR_SKILLS.join(', ')}`,
    `- **Resume:** ${SITE_URL}/Kenil-Sudani-Resume.pdf`,
    `- **Contact:** ${SOCIAL_LINKS.email}`,
    '',
    '## Key Pages',
    '',
    `- [Home](${SITE_URL}/): Overview, navigation, GitHub activity, and social profiles`,
    `- [About & Work Experience](${SITE_URL}/about): Background, engineering philosophy, and professional work history`,
    `- [Projects & Free Tools](${SITE_URL}/project): Directory of ${projects.length} free browser utilities, games, and open-source tools`,
    `- [Technical Blog](${SITE_URL}/blog): ${posts.length} articles on TypeScript, React, Next.js, Bun, Astro, Tailwind CSS, AI, and Rust`,
    `- [Resume (PDF)](${SITE_URL}/Kenil-Sudani-Resume.pdf): Printable resume`,
    `- [Full Markdown Context](${SITE_URL}/llms-full.txt): Complete single-file text version of all pages, projects, experience, and blog posts`,
    '',
    '## Free Tools & Shipped Products',
    '',
    ...projects.map((project) => {
      const links = [
        `Details: ${SITE_URL}/project/${project.id}`,
        project.data.url ? `Live: ${project.data.url}` : null,
        project.data.gitUrl ? `GitHub: ${project.data.gitUrl}` : null,
      ]
        .filter(Boolean)
        .join(' | ');
      return `- [${project.data.title}](${SITE_URL}/project/${project.id}): ${project.data.description} (${project.data.techStack.join(', ')}) — ${links}`;
    }),
    `- [RustedZip](${SITE_URL}/blog/rustedzip-fast-windows-archiving): High-performance multi-core Rust archiving CLI for Windows with context-menu integration — Source: https://github.com/Super-Kenil/rustedzip`,
    '',
    '## Work Experience',
    '',
    ...gigs.map(
      (gig) =>
        `- **${gig.data.role}** at **${gig.data.name}** (${gig.data.timeline}) — Stack: ${gig.data.techStack.join(', ')}`
    ),
    '',
    '## Technical Writing',
    '',
    ...posts.map((post) => {
      const pubDate = formatIsoDate(post.data.date);
      const updated = post.data.updatedDate ? `, updated ${formatIsoDate(post.data.updatedDate)}` : '';
      return `- [${post.data.title}](${SITE_URL}/blog/${post.id}): ${post.data.description} (${pubDate}${updated})`;
    }),
    '',
    '## Contact & Official Profiles',
    '',
    `- Primary Website: ${SITE_URL}`,
    `- Alternate Owned Domain: ${ALT_SITE_URL}`,
    `- Email: mailto:${SOCIAL_LINKS.email}`,
    `- GitHub: ${SOCIAL_LINKS.github}`,
    `- LinkedIn: ${SOCIAL_LINKS.linkedin}`,
    `- X (Twitter): ${SOCIAL_LINKS.twitter}`,
    `- Bluesky: ${SOCIAL_LINKS.bluesky}`,
    `- npm: ${SOCIAL_LINKS.npm}`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
