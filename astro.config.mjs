// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const SITE = process.env.PUBLIC_SITE_URL || 'https://shannonsuttles.com';

export default defineConfig({
  site: SITE,
  // Every public page is prerendered to static HTML at build time.
  // Only the draft-preview route opts out (see src/pages/preview/[slug].astro),
  // which is why an adapter is present. Public pages stay fully static and fast.
  output: 'static',
  adapter: netlify(),
  integrations: [
    sitemap({
      // Never advertise a page that carries a noindex tag. /preview/ holds
      // unpublished drafts; privacy and terms are placeholders until real
      // legal copy lands — remove them from this list at the same time as
      // the noindex prop on those pages.
      filter: (page) =>
        !['/preview/', '/privacy', '/terms'].some((p) => page.includes(p)),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    // Sanity's CDN serves and transforms poem imagery.
    domains: ['cdn.sanity.io'],
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
