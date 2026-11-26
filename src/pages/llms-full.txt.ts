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
  const { projects, posts, gigs, aboutEntry } = await loadSortedSiteContent();

  const sections: string[] = [
    `# ${AUTHOR_NAME} (${AUTHOR_NICKNAME}) — Full Site Context`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    `- Primary Domain: ${SITE_URL}`,
    `- Secondary Owned Domain: ${ALT_SITE_URL} (canonical entity is ${SITE_URL})`,
    `- Role: ${AUTHOR_ROLE}`,
    '- Location: Gujarat, India',
    '- Availability: Open to full-time software engineering roles and freelance engagements',
    `- Core Skills: ${AUTHOR_SKILLS.join(', ')}`,
    `- Resume: ${SITE_URL}/Kenil-Sudani-Resume.pdf`,
    `- Email: ${SOCIAL_LINKS.email}`,
    `- GitHub: ${SOCIAL_LINKS.github}`,
    `- LinkedIn: ${SOCIAL_LINKS.linkedin}`,
    `- X (Twitter): ${SOCIAL_LINKS.twitter}`,
    `- Bluesky: ${SOCIAL_LINKS.bluesky}`,
    `- npm: ${SOCIAL_LINKS.npm}`,
    '',
    '---',
    '',
    `## About ${AUTHOR_NAME}`,
    '',
    aboutEntry?.body?.trim() ?? '',
    '',
    '---',
    '',
    '## Work Experience',
    '',
    ...gigs.flatMap((gig) => [
      `### ${gig.data.role} — ${gig.data.name} (${gig.data.timeline})`,
      `Tech stack: ${gig.data.techStack.join(', ')}`,
      '',
      gig.body?.trim() ?? '',
      '',
    ]),
    '---',
    '',
    '## Projects & Free Tools',
    '',
    ...projects.flatMap((project) => [
      `### ${project.data.title}`,
      `- Detail page: ${SITE_URL}/project/${project.id}`,
      project.data.url ? `- Live URL: ${project.data.url}` : null,
      project.data.gitUrl ? `- Source code: ${project.data.gitUrl}` : null,
      `- Tech stack: ${project.data.techStack.join(', ')}`,
      `- Summary: ${project.data.description}`,
      '',
      project.body?.trim() ?? '',
      '',
    ].filter((line): line is string => line !== null)),
    '---',
    '',
    '## Technical Blog Posts',
    '',
    ...posts.flatMap((post) => {
      const pubDate = formatIsoDate(post.data.date);
      const updated = post.data.updatedDate ? ` | Updated: ${formatIsoDate(post.data.updatedDate)}` : '';
      const faqBlock = post.data.faqs?.length
        ? [
            '',
            '#### Frequently Asked Questions',
            ...post.data.faqs.flatMap((faq) => [`**${faq.question}**`, faq.answer, '']),
          ]
        : [];
      return [
        `### ${post.data.title}`,
        `- URL: ${SITE_URL}/blog/${post.id}`,
        `- Published: ${pubDate}${updated}`,
        post.data.tags?.length ? `- Tags: ${post.data.tags.join(', ')}` : null,
        `- Summary: ${post.data.description}`,
        '',
        post.body?.trim() ?? '',
        ...faqBlock,
        '',
      ].filter((line): line is string => line !== null);
    }),
  ];

  return new Response(sections.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
