---
title: 'I Built My Own Next.js (In 60 Lines of Bun)'
description: 'Next.js is a massive black box. I wanted to see if I could build a streaming SSR framework with just Bun and React.'
date: 2026-02-22
tags: ['bun', 'react', 'ssr', 'rsc']
---

Next.js is great. It's also huge.

Sometimes you don't need a 300MB node_modules folder just to stream some React components. I wanted to see how close I could get to a modern SSR experience using nothing but **Bun native APIs**.

Here is how I built a streaming React framework in one file.

## The Engine: Bun.serve

Forget Express or Hono. Bun has a built-in server that is absurdly fast and understands JSX out of the box.

I used the new `routes` object in `Bun.serve` to handle everything. No more manual `if (url === "/api")` blocks.

```typescript
const server = serve({
  routes: {
    '/rsc': async (req) => {
      const Page = await import('./app/page.tsx')
      const stream = await renderToReadableStream(createElement(Page.default))
      return new Response(stream, {
        headers: { "Content-Type": "text/html" }
      })
    },
    "/api/hello": {
      async GET() {
        return Response.json({ message: "Hello from Bun!" })
      }
    }
  }
})
```

## The Magic: renderToReadableStream

The secret sauce is `renderToReadableStream` from `react-dom/server`.

Instead of waiting for the whole page to render, it sends chunks to the browser as they're ready. Bun handles `ReadableStream` natively as a response body.

This means you get **Streaming SSR** for free.

## Component-Level Data Fetching

In `page.tsx`, I'm using `async/await` directly inside components.

```tsx
const Page = async () => {
  const res = await fetch('https://api.example.com/posts')
  const data = await res.json()

  return (
    <>
      <h1>Hello server components</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Posts data={data} />
      </Suspense>
    </>
  )
}
```

This looks like React Server Components (RSC), and because Bun can handle top-level await and dynamic imports, it just works.

## Experimental? Very.

This isn't a production-ready framework. Yet.

There are still big gaps:
- **Client-Side Hydration:** Sending the JS to the client and "waking up" the HTML.
- **Asset Bundling:** Still need to add a proper build step to handle CSS, images, and JS assets correctly.
- **HMR:** Hot Module Replacement is tricky when you're manually managing the server lifecycle.

## The Point

We've reached a point where the runtime (Bun) and the library (React) are so powerful that you can build the "magic" of a major framework in a few dozen lines of code.

It's raw, it's buggy, and it's experimental. But it's also incredibly fast.

I built it to understand how it exactly works under the hood.