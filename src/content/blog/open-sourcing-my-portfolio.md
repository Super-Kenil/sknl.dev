---
title: 'I am Open Sourcing My Portfolio'
description: '100 Lighthouse score, dynamic OG images, and type-safe markdown. Here is why you should steal my code.'
date: 2026-05-13
tags: ['open-source', 'portfolio', 'astro', 'webdev', 'performance', 'seo', 'typescript', 'minimalism']
---

A couple of friends recently asked for the source code to this site. 

They wanted the SEO setup, the 100 Lighthouse score, the minimalist design, and those simple page transitions. I shared it with them privately, but realized something: keeping a personal portfolio closed-source is a waste.

So, I'm opening it up. You can steal it [on GitHub](https://github.com/Super-Kenil/sknl.dev).

Here is why you probably should.

## 1. 100 Lighthouse Score + Premium Aesthetics

Getting a perfect performance score is easy if your site looks like a plain text document. Getting it with a premium, minimalist design and fluid page transitions? That takes work. 

This repo proves you can have both. It is fast, but it doesn't look cheap.

## 2. Dynamic OG Images on the Edge

Most personal sites skip Open Graph images or force you to manually create them in Figma for every single blog post. That is exhausting.

This site does it dynamically at build time. No manual work. Beautiful, text-fitted images for every post you write.

## 3. Type-Safe Content

Ever broken your site build because you typo'd a tag in your markdown frontmatter? Not anymore. Your content should be as strictly typed as your code.

## How It Works Under the Hood

The repo is lean. Here are the three gears making it happen:

- **Sitemap Generation**: `src/pages/sitemap.xml.ts` dynamically pulls all blog posts using `getCollection` and builds the XML at build time. Zero manual updates.
- **Dynamic OG Images**: `src/pages/blog/[id].png.ts` uses `satori` to turn HTML/CSS into SVG, then `@resvg/resvg-js` renders it into a PNG. Automated social previews for every post.
- **Zod Frontmatter**: `src/content.config.ts` uses `zod` to validate markdown metadata. If you forget a title or date, the build fails. Type-safety for your content.

## Take It

The code is yours. [Fork it on GitHub](https://github.com/Super-Kenil/sknl.dev), rip out my name, change the colors, and use it. 

Ship your portfolio. Then get back to building things that matter.
