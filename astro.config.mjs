import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://deveshgautam.com',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/design') })],
  markdown: { shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' }, wrap: true } },
});
