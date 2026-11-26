---
title: 'I am Open Sourcing My Portfolio'
description: '100 Lighthouse score, dynamic OG images, and type-safe markdown. Here is why you should steal my code.'
date: 2026-05-13
updatedDate: 2026-11-26
tags: ['open-source', 'portfolio', 'astro', 'webdev', 'performance', 'seo', 'typescript', 'minimalism']
faqs:
  - question: 'What tech stack powers sknl.dev?'
    answer: 'sknl.dev is built with Astro static site generation, Tailwind CSS 4, DaisyUI 5, TypeScript, Zod-validated content collections, and Satori plus @resvg/resvg-js for build-time dynamic Open Graph PNG generation.'
  - question: 'Where is the sknl.dev source code hosted?'
    answer: 'The complete portfolio repository is open source under the MIT license on GitHub at https://github.com/Super-Kenil/sknl.dev.'
---

**`sknl.dev` is an open-source developer portfolio template** built with Astro, Tailwind CSS v4, DaisyUI 5, Zod-validated Markdown collections, and automated Satori Open Graph PNG generation. Designed by [Kenil Sudani](/about) for speed and clean SEO, the entire codebase is MIT-licensed on [GitHub](https://github.com/Super-Kenil/sknl.dev).

A couple of friends recently asked for the source code to this site—specifically the SEO setup, fast static output, minimalist layout, and page transitions. Keeping a personal portfolio closed-source felt unnecessary, so it is open for anyone to fork.

## Architecture Overview

| Layer | Implementation | Purpose |
|---|---|---|
| **Static Site Framework** | Astro (`output: 'static'`) | Ships zero-JS HTML by default with view transitions |
| **Styling &amp; Themes** | Tailwind CSS v4 + DaisyUI 5 | Minimal CSS footprint with multi-theme support |
| **Type-Safe Content** | `src/content.config.ts` + Zod | Validates blog, project, and experience frontmatter at build time |
| **Dynamic OG Images** | `src/pages/blog/[id].png.ts` (`satori` + `@resvg/resvg-js`) | Generates 1200×630 PNG social preview cards for every post |
| **Search &amp; AI Discovery** | `sitemap.xml.ts`, `llms.txt.ts`, `llms-full.txt.ts`, JSON-LD | Exposes structured metadata for search engines and AI agents |

## 1. Fast Static Performance + Minimalist UI

Getting high Lighthouse scores is easy if a site looks like an unstyled text file. Keeping pages snappy while supporting smooth transitions and theme switching takes deliberate restraint in client-side JavaScript.

## 2. Dynamic OG Images at Build Time

Manually designing social cards in Figma for every article slows down publishing. `src/pages/blog/[id].png.ts` converts post titles and descriptions via `satori` into SVG and renders crisp PNGs with `@resvg/resvg-js` automatically during the build.

## 3. Type-Safe Content Collections

`src/content.config.ts` validates every Markdown entry with `zod`, catching missing titles, invalid dates, or malformed URLs before deployment.

## Fork and Customize It

Clone [Super-Kenil/sknl.dev](https://github.com/Super-Kenil/sknl.dev), swap in your own `src/consts.ts` and `src/content/` Markdown files, and deploy—or browse my [live tools and projects](/project) to see what else I build.
