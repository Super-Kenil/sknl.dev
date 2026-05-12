// @ts-check
import { defineConfig } from 'astro/config';
import icon from "astro-icon";
import sitemap, { ChangeFreqEnum } from "@astrojs/sitemap";
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://sknl.dev',
  output: 'static',
  integrations: [
    icon(),
    sitemap({
      serialize(item) {
        if (item.url.includes('/blog/')) {
          item.changefreq = ChangeFreqEnum.YEARLY;
        }
        return item;
      },
    }),
  ],
  redirects: {
    '/resume': '/Kenil-Sudani-Resume.pdf'
  },
  vite: {
    plugins: [tailwindcss()]
  }
});