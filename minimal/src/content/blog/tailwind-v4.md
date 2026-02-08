---
title: 'Tailwind v4 Changed How I Write CSS'
description: 'The new CSS-first approach is actually cleaner than you think.'
date: 2026-01-25
tags: ['css', 'tailwind']
---

Tailwind v4 dropped and it's a different beast. If you're still on v3, here's what you need to know.

## The Big Change: CSS-First

Gone are the `tailwind.config.js` days. Now your config lives in CSS:

```css
@import "tailwindcss";
@plugin "daisyui" {
  themes: garden --default;
}
```

Yeah, that's it. Your entire Tailwind + DaisyUI setup in 4 lines of CSS.

## Why This Matters

### 1. Faster Builds

No more JavaScript config parsing. The CSS-first approach means Tailwind can be processed as part of the normal CSS pipeline. In my projects, build times dropped noticeably.

### 2. No More PostCSS Config

Remember maintaining `postcss.config.js`? That's gone too. Tailwind v4 runs as a Vite plugin:

```js
import tailwindcss from '@tailwindcss/vite';

export default {
  vite: {
    plugins: [tailwindcss()]
  }
}
```

### 3. Theme Variables in CSS

Custom themes are pure CSS now:

```css
@theme {
  --color-primary: #3b82f6;
  --font-sans: 'Inter', sans-serif;
}
```

No more converting between JS objects and CSS. Just write CSS.

## Migration Tips

1. **Start fresh** - For new projects, just use the new syntax
2. **Gradual migration** - For existing projects, you can migrate piece by piece
3. **Check your plugins** - Some v3 plugins might need updates

## My Favorite Part

Less files to maintain. Seriously. My old setup had:

- `tailwind.config.js`
- `postcss.config.js`
- `global.css`

Now it's just `global.css`. One file. Done.

Sometimes simpler is just better.
