# Kenil Sudani — Portfolio & Blog

A high-performance, SEO-optimized portfolio and blog built with **Astro 6**, **Tailwind CSS 4**, and **DaisyUI 5**. This is the source code for my personal site at [sknl.dev](https://sknl.dev).

Designed for developers who want a clean, minimalist, and blazing-fast personal brand presence.

### ✨ Highlights
- **Framework**: [Astro 6](https://astro.build/) (Static Site Generation)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [DaisyUI 5](https://daisyui.com/)
- **SEO**: Dynamic sitemaps and automated OG image generation using Satori
- **Content**: Fully managed via Astro Content Collections (Markdown)

### ⚙️ Technical Features
- **Sitemap Generation**: `src/pages/sitemap.xml.ts` dynamically fetches content collections (e.g., blogs) and generates an XML sitemap at build time.
- **Dynamic OG Images**: No manual image creation. `src/pages/blog/[id].png.ts` uses `satori` to convert JSX/CSS layouts to SVG, and `@resvg/resvg-js` to render them into crisp PNGs dynamically.
- **Type-Safe Markdown**: Built-in strict frontmatter validation using `zod` in `src/content.config.ts`. The build fails if you miss a required tag like `title` or `date`.

---

### 🚀 Quick Start

Get your portfolio up and running in seconds using [Bun](https://bun.sh/).

```sh
bun install
bun run dev
```

| Command | Action |
| :--- | :--- |
| `bun install` | Install all dependencies |
| `bun run dev` | Start local development server |
| `bun run build` | Build the production-ready site |
| `bun run preview` | Preview the local production build |

---

### 🛠️ Customization
Managing your content is as simple as editing Markdown files in `src/content/`:
- `blog/` — Your technical articles and thoughts.
- `project/` — Showcase your latest work.
- `about.md` — Your personal bio and journey.

---

### 📄 License
MIT. Use it, fork it, and make it your own.
