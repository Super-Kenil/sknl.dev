// @ts-check
import { defineConfig } from 'astro/config';
import icon from "astro-icon";
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://sknl.dev',
  output: 'static',
  integrations: [
    icon(),
  ],
  redirects: {
    '/resume': '/Kenil-Sudani-Resume.pdf'
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
