import {
  AGENT_SEARCH_CONFIG,
  ALT_SITE_URL,
  AUTHOR_NAME,
  AUTHOR_NICKNAME,
  AUTHOR_ROLE,
  AUTHOR_SKILLS,
  CONTENT_SIGNAL_POLICY,
  SITE_DESCRIPTION,
  SITE_URL,
  SOCIAL_LINKS,
} from '../consts';
import { formatIsoDate, loadSortedSiteContent } from './site-content';

export type AgentSearchChunk = {
  id: string;
  title: string;
  section?: string;
  url: string;
  markdownUrl: string;
  type: 'profile' | 'about' | 'experience' | 'project' | 'blog';
  tags: string[];
  updatedAt?: string;
  content: string;
};

export const ABOUT_FAQS = [
  {
    question: 'Who is Kenil Sudani (Super Kenil)?',
    answer:
      'Kenil Sudani is a full-stack software engineer from Gujarat, India with 4+ years of experience building web applications, free browser utilities, open-source developer tools, and AI automation systems. His primary site is sknl.dev (also reachable via superkenil.com).',
  },
  {
    question: 'Is Kenil Sudani available for hiring or freelance work?',
    answer: `Yes. Kenil is open to full-time software engineering roles and freelance product or automation engagements. You can review his resume at ${SITE_URL}/Kenil-Sudani-Resume.pdf or contact him at ${SOCIAL_LINKS.email}.`,
  },
  {
    question: 'What tools and open-source products has Kenil Sudani built?',
    answer:
      'His shipped tools include StyleX UI (55+ StyleX and Base UI components), paper pdf (32-tool privacy-first browser PDF toolkit), MediaGo (client-side FFmpeg/WASM converter and background remover), OMG (multiplayer browser games), super-detype (TypeScript-stripping CLI), and RustedZip (multi-core Rust Windows archiving tool).',
  },
] as const;

function yamlString(value: string): string {
  return JSON.stringify(value);
}

/**
 * Formats a Markdown page with YAML frontmatter and Search for Agents discovery metadata.
 */
export function formatAgentMarkdownPage(options: {
  title: string;
  description: string;
  url: string;
  body: string;
  published?: string;
  updated?: string;
  tags?: string[];
}): string {
  const { title, description, url, body, published, updated, tags } = options;
  const frontmatter: string[] = [
    '---',
    `title: ${yamlString(title)}`,
    `description: ${yamlString(description)}`,
    `url: ${yamlString(url)}`,
  ];

  if (published) frontmatter.push(`published: ${yamlString(published)}`);
  if (updated) frontmatter.push(`updated: ${yamlString(updated)}`);
  if (tags?.length) {
    frontmatter.push('tags:');
    for (const tag of tags) {
      frontmatter.push(`  - ${yamlString(tag)}`);
    }
  }

  frontmatter.push(
    `content_signal: ${yamlString(CONTENT_SIGNAL_POLICY)}`,
    'agent:',
    `  instructions: ${yamlString(AGENT_SEARCH_CONFIG.instructions)}`,
    `  endpoint: ${yamlString(AGENT_SEARCH_CONFIG.endpoint)}`,
    `  method: ${yamlString(AGENT_SEARCH_CONFIG.method)}`,
    `  documentation: ${yamlString(AGENT_SEARCH_CONFIG.documentation)}`,
    '---',
    '',
  );

  return `${frontmatter.join('\n')}\n${body.trim()}\n`;
}

function splitMarkdownSections(markdown: string, fallbackHeading: string): Array<{ heading: string; body: string }> {
  const lines = markdown.trim().split(/\r?\n/);
  const sections: Array<{ heading: string; body: string }> = [];
  let currentHeading = fallbackHeading;
  let buffer: string[] = [];
  let inFence = false;

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
    }

    const headingMatch = !inFence ? line.match(/^(#{2,3})\s+(.+?)\s*$/) : null;
    if (headingMatch) {
      const content = buffer.join('\n').trim();
      if (content) {
        sections.push({ heading: currentHeading, body: content });
      }
      currentHeading = headingMatch[2];
      buffer = [line];
    } else {
      buffer.push(line);
    }
  }

  const tail = buffer.join('\n').trim();
  if (tail) {
    sections.push({ heading: currentHeading, body: tail });
  }

  // Merge tiny sections into neighbors and split overly long sections cleanly by paragraphs.
  const normalized: Array<{ heading: string; body: string }> = [];
  for (const section of sections) {
    if (section.body.length <= 2800) {
      normalized.push(section);
      continue;
    }
    const paragraphs = section.body.split(/\n{2,}/);
    let chunk = '';
    let part = 1;
    for (const para of paragraphs) {
      if (chunk && chunk.length + para.length + 2 > 2400) {
        normalized.push({
          heading: part === 1 ? section.heading : `${section.heading} (Part ${part})`,
          body: chunk.trim(),
        });
        part += 1;
        chunk = para;
      } else {
        chunk = chunk ? `${chunk}\n\n${para}` : para;
      }
    }
    if (chunk.trim()) {
      normalized.push({
        heading: part === 1 ? section.heading : `${section.heading} (Part ${part})`,
        body: chunk.trim(),
      });
    }
  }

  return normalized;
}

export async function renderHomeMarkdown(): Promise<string> {
  const { projects, posts } = await loadSortedSiteContent();
  const body = [
    `# ${AUTHOR_NAME} (${AUTHOR_NICKNAME})`,
    '',
    'Friendly Neighbourhood Nerd',
    '',
    `${SITE_DESCRIPTION} Open to engineering roles and freelance inquiries.`,
    '',
    '## Navigation & Resources',
    '',
    `- [The Story — Background, work experience & hiring info](${SITE_URL}/about)`,
    `- [Current Benchmarks — ${projects.length} free web tools, OSS utilities & shipped products](${SITE_URL}/project)`,
    `- [I Tried Writing — ${posts.length} technical articles on TypeScript, React, Bun & AI](${SITE_URL}/blog)`,
    `- [Resume (PDF)](${SITE_URL}/Kenil-Sudani-Resume.pdf)`,
    `- [Contact](mailto:${SOCIAL_LINKS.email})`,
    '',
    '## Core Technical Stack',
    '',
    AUTHOR_SKILLS.join(', '),
    '',
    '## Official Profiles',
    '',
    `- Primary Domain: ${SITE_URL}`,
    `- Alternate Owned Domain: ${ALT_SITE_URL}`,
    `- Email: ${SOCIAL_LINKS.email}`,
    `- GitHub: ${SOCIAL_LINKS.github}`,
    `- LinkedIn: ${SOCIAL_LINKS.linkedin}`,
    `- X (Twitter): ${SOCIAL_LINKS.twitter}`,
    `- Bluesky: ${SOCIAL_LINKS.bluesky}`,
    `- npm: ${SOCIAL_LINKS.npm}`,
  ].join('\n');

  return formatAgentMarkdownPage({
    title: `${AUTHOR_NICKNAME} (${AUTHOR_NAME})`,
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/`,
    body,
    tags: [...AUTHOR_SKILLS],
  });
}

export async function renderAboutMarkdown(): Promise<string> {
  const { gigs, aboutEntry } = await loadSortedSiteContent();
  const body = [
    `# ${AUTHOR_NAME}`,
    '',
    `${AUTHOR_NAME} (${AUTHOR_NICKNAME}) is a full-stack software engineer from Gujarat, India with 4+ years of experience building web applications, free browser tools, and AI automation systems. Primary site: ${SITE_URL} (also owns ${ALT_SITE_URL}). Open to engineering roles and freelance projects.`,
    '',
    `- Resume: ${SITE_URL}/Kenil-Sudani-Resume.pdf`,
    `- Email: ${SOCIAL_LINKS.email}`,
    '',
    '## The Story',
    '',
    aboutEntry?.body?.trim() ?? '',
    '',
    '## Work Experience',
    '',
    ...gigs.flatMap((gig) => [
      `### ${gig.data.role} — ${gig.data.name} (${gig.data.timeline})`,
      '',
      gig.body?.trim() ?? '',
      '',
      `Stack: ${gig.data.techStack.join(', ')}`,
      '',
    ]),
    '## Core Technical Stack',
    '',
    AUTHOR_SKILLS.join(', '),
    '',
    '## Frequently Asked Questions',
    '',
    ...ABOUT_FAQS.flatMap((faq) => [`### ${faq.question}`, '', faq.answer, '']),
  ].join('\n');

  return formatAgentMarkdownPage({
    title: `About & Experience | ${AUTHOR_NICKNAME}`,
    description: `${AUTHOR_NAME} (${AUTHOR_NICKNAME}) — Full-stack software engineer from Gujarat, India with 4+ years of experience. Work history, skills, shipped tools, and hiring contact.`,
    url: `${SITE_URL}/about`,
    body,
    tags: [...AUTHOR_SKILLS],
  });
}

export async function renderProjectsIndexMarkdown(): Promise<string> {
  const { projects } = await loadSortedSiteContent();
  const body = [
    '# My Projects & Free Tools',
    '',
    `A collection of free browser utilities, games, UI systems, and open-source developer CLI tools built by ${AUTHOR_NAME}. Every project below runs live for end users and serves as practical proof of full-stack, WebAssembly, and frontend architecture work.`,
    '',
    ...projects.flatMap((project) => {
      const links = [
        `Details: ${SITE_URL}/project/${project.id}`,
        project.data.url ? `Live: ${project.data.url}` : null,
        project.data.gitUrl ? `GitHub: ${project.data.gitUrl}` : null,
      ].filter((item): item is string => Boolean(item));
      return [
        `## ${project.data.title}`,
        '',
        project.data.description,
        '',
        `- Stack: ${project.data.techStack.join(', ')}`,
        ...links.map((link) => `- ${link}`),
        '',
      ];
    }),
  ].join('\n');

  return formatAgentMarkdownPage({
    title: `Projects & Free Tools | ${AUTHOR_NICKNAME}`,
    description: `Free browser utilities, open-source developer tools, and web apps built by ${AUTHOR_NAME} (${AUTHOR_NICKNAME}).`,
    url: `${SITE_URL}/project`,
    body,
  });
}

export function renderProjectDetailMarkdown(project: Awaited<ReturnType<typeof loadSortedSiteContent>>['projects'][number]): string {
  const links = [
    project.data.url ? `- Live URL: ${project.data.url}` : null,
    project.data.gitUrl ? `- Source Code (GitHub): ${project.data.gitUrl}` : null,
    `- Detail Page: ${SITE_URL}/project/${project.id}`,
  ].filter((item): item is string => Boolean(item));

  const body = [
    `# ${project.data.title}`,
    '',
    project.data.description,
    '',
    `- Pricing: Free to use${project.data.gitUrl ? ' (Open source)' : ''}`,
    `- Category: ${project.data.category ?? 'DeveloperApplication'}`,
    `- Tech Stack: ${project.data.techStack.join(', ')}`,
    ...links,
    '',
    '## Overview & Technical Details',
    '',
    project.body?.trim() ?? '',
    '',
    `Built by ${AUTHOR_NAME} (${AUTHOR_NICKNAME}) — ${SOCIAL_LINKS.email}`,
  ].join('\n');

  return formatAgentMarkdownPage({
    title: `${project.data.title} | ${AUTHOR_NICKNAME}`,
    description: project.data.description,
    url: `${SITE_URL}/project/${project.id}`,
    body,
    tags: project.data.techStack,
  });
}

export async function renderBlogIndexMarkdown(): Promise<string> {
  const { posts } = await loadSortedSiteContent();
  const body = [
    '# I Tried Writing — Technical Blog',
    '',
    'Stuff I learned, mistakes I made, things that worked.',
    '',
    ...posts.flatMap((post) => {
      const pubDate = formatIsoDate(post.data.date);
      const updated = post.data.updatedDate ? ` (Updated: ${formatIsoDate(post.data.updatedDate)})` : '';
      return [
        `## ${post.data.title}`,
        '',
        post.data.description,
        '',
        `- URL: ${SITE_URL}/blog/${post.id}`,
        `- Published: ${pubDate}${updated}`,
        post.data.tags?.length ? `- Tags: ${post.data.tags.join(', ')}` : null,
        '',
      ].filter((line): line is string => line !== null);
    }),
  ].join('\n');

  return formatAgentMarkdownPage({
    title: `Blog | ${AUTHOR_NICKNAME}`,
    description: 'Thoughts on JavaScript, development tools, and lessons learned along the way.',
    url: `${SITE_URL}/blog`,
    body,
  });
}

export function renderBlogDetailMarkdown(post: Awaited<ReturnType<typeof loadSortedSiteContent>>['posts'][number]): string {
  const pubDate = formatIsoDate(post.data.date);
  const updated = post.data.updatedDate ? formatIsoDate(post.data.updatedDate) : undefined;
  const faqSection = post.data.faqs?.length
    ? [
        '',
        '## Frequently Asked Questions',
        '',
        ...post.data.faqs.flatMap((faq) => [`### ${faq.question}`, '', faq.answer, '']),
      ]
    : [];

  const body = [
    `# ${post.data.title}`,
    '',
    post.data.description,
    '',
    `- Author: ${AUTHOR_NAME} (${AUTHOR_NICKNAME})`,
    `- Published: ${pubDate}${updated ? ` | Updated: ${updated}` : ''}`,
    post.data.tags?.length ? `- Tags: ${post.data.tags.join(', ')}` : null,
    '',
    post.body?.trim() ?? '',
    ...faqSection,
  ]
    .filter((line): line is string => line !== null)
    .join('\n');

  return formatAgentMarkdownPage({
    title: `${post.data.title} | ${AUTHOR_NICKNAME}`,
    description: post.data.description,
    url: `${SITE_URL}/blog/${post.id}`,
    body,
    published: pubDate,
    updated,
    tags: post.data.tags,
  });
}

/**
 * Builds the chunked search index consumed by /.well-known/search.
 */
export async function buildAgentSearchIndex(): Promise<AgentSearchChunk[]> {
  const { projects, posts, gigs, aboutEntry } = await loadSortedSiteContent();
  const latestPostDate = formatIsoDate(
    new Date(Math.max(...posts.map((p) => (p.data.updatedDate ?? p.data.date).getTime())))
  );

  const chunks: AgentSearchChunk[] = [
    {
      id: 'home-overview',
      title: `${AUTHOR_NAME} (${AUTHOR_NICKNAME}) — Portfolio & Contact`,
      section: 'Overview & Availability',
      url: `${SITE_URL}/`,
      markdownUrl: `${SITE_URL}/index.md`,
      type: 'profile',
      tags: [...AUTHOR_SKILLS, 'portfolio', 'hiring', 'freelance', 'contact', 'resume', 'gujarat', 'india'],
      updatedAt: latestPostDate,
      content: [
        `${AUTHOR_NAME} (${AUTHOR_NICKNAME}) is a ${AUTHOR_ROLE} from Gujarat, India.`,
        SITE_DESCRIPTION,
        'Available for full-time engineering roles and freelance projects.',
        `Core Stack: ${AUTHOR_SKILLS.join(', ')}.`,
        `Resume (PDF): ${SITE_URL}/Kenil-Sudani-Resume.pdf`,
        `Email: ${SOCIAL_LINKS.email}`,
        `GitHub: ${SOCIAL_LINKS.github} | LinkedIn: ${SOCIAL_LINKS.linkedin} | X: ${SOCIAL_LINKS.twitter} | Bluesky: ${SOCIAL_LINKS.bluesky} | npm: ${SOCIAL_LINKS.npm}`,
        `Primary domain: ${SITE_URL} (secondary owned domain: ${ALT_SITE_URL}).`,
      ].join('\n'),
    },
    {
      id: 'about-story',
      title: `About ${AUTHOR_NAME} (${AUTHOR_NICKNAME})`,
      section: 'The Story & Background',
      url: `${SITE_URL}/about`,
      markdownUrl: `${SITE_URL}/about.md`,
      type: 'about',
      tags: ['about', 'bio', 'story', 'experience', 'gujarat', 'india', ...AUTHOR_SKILLS],
      updatedAt: latestPostDate,
      content: aboutEntry?.body?.trim() ?? '',
    },
    {
      id: 'about-faq',
      title: `About ${AUTHOR_NAME} — Frequently Asked Questions`,
      section: 'Hiring, Identity & Tools FAQ',
      url: `${SITE_URL}/about`,
      markdownUrl: `${SITE_URL}/about.md`,
      type: 'about',
      tags: ['faq', 'hiring', 'freelance', 'resume', 'contact', 'tools'],
      updatedAt: latestPostDate,
      content: ABOUT_FAQS.map((faq) => `### ${faq.question}\n${faq.answer}`).join('\n\n'),
    },
    ...gigs.map((gig) => ({
      id: `gig-${gig.id}`,
      title: `${gig.data.role} — ${gig.data.name} (${gig.data.timeline})`,
      section: 'Work Experience',
      url: `${SITE_URL}/about`,
      markdownUrl: `${SITE_URL}/about.md`,
      type: 'experience' as const,
      tags: ['work', 'experience', 'career', gig.data.name, ...gig.data.techStack],
      updatedAt: latestPostDate,
      content: [
        `**${gig.data.role}** at **${gig.data.name}** (${gig.data.timeline})`,
        `Tech Stack: ${gig.data.techStack.join(', ')}`,
        '',
        gig.body?.trim() ?? '',
      ].join('\n'),
    })),
    ...projects.map((project) => ({
      id: `project-${project.id}`,
      title: project.data.title,
      section: project.data.category ?? 'Project',
      url: `${SITE_URL}/project/${project.id}`,
      markdownUrl: `${SITE_URL}/project/${project.id}.md`,
      type: 'project' as const,
      tags: [
        'project',
        'tool',
        'free',
        ...(project.data.gitUrl ? ['open-source', 'github'] : []),
        ...project.data.techStack,
      ],
      updatedAt: latestPostDate,
      content: [
        project.data.description,
        `Tech Stack: ${project.data.techStack.join(', ')}`,
        project.data.url ? `Live URL: ${project.data.url}` : null,
        project.data.gitUrl ? `GitHub: ${project.data.gitUrl}` : null,
        '',
        project.body?.trim() ?? '',
      ]
        .filter((line): line is string => line !== null)
        .join('\n'),
    })),
  ];

  for (const post of posts) {
    const updatedAt = formatIsoDate(post.data.updatedDate ?? post.data.date);
    const baseTags = post.data.tags ?? [];
    const sections = splitMarkdownSections(post.body?.trim() ?? '', 'Overview');

    sections.forEach((section, index) => {
      chunks.push({
        id: `blog-${post.id}-${index + 1}`,
        title: post.data.title,
        section: section.heading,
        url: `${SITE_URL}/blog/${post.id}`,
        markdownUrl: `${SITE_URL}/blog/${post.id}.md`,
        type: 'blog',
        tags: baseTags,
        updatedAt,
        content: index === 0 ? `${post.data.description}\n\n${section.body}` : section.body,
      });
    });

    if (post.data.faqs?.length) {
      chunks.push({
        id: `blog-${post.id}-faqs`,
        title: `${post.data.title} — FAQ`,
        section: 'Frequently Asked Questions',
        url: `${SITE_URL}/blog/${post.id}`,
        markdownUrl: `${SITE_URL}/blog/${post.id}.md`,
        type: 'blog',
        tags: [...baseTags, 'faq'],
        updatedAt,
        content: post.data.faqs.map((faq) => `### ${faq.question}\n${faq.answer}`).join('\n\n'),
      });
    }
  }

  return chunks;
}

export function estimateMarkdownTokens(markdown: string): number {
  return Math.max(1, Math.ceil(markdown.length / 4));
}

export function markdownResponse(markdown: string): Response {
  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Signal': CONTENT_SIGNAL_POLICY,
      Vary: 'Accept',
      'x-markdown-tokens': String(estimateMarkdownTokens(markdown)),
    },
  });
}
