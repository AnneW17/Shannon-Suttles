// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const SITE = process.env.PUBLIC_SITE_URL || 'https://shannonsuttles.com';

export default defineConfig({
  site: SITE,

  // Fully static. Every page is plain HTML on Netlify's CDN.
  //
  // The Netlify adapter used to be here for one server-rendered route — the
  // private draft preview. That route needs SANITY_VIEWER_TOKEN, which was
  // never set, so preview has never worked and the adapter was doing nothing
  // but adding a serverless function in front of the whole site. A request
  // landing on that function instead of the CDN is the most likely cause of
  // the intermittent blank page that a refresh fixes.
  //
  // If draft preview is wanted later: reinstate `adapter: netlify()`, restore
  // src/pages/preview/[slug].astro, and add a read-only viewer token in
  // Netlify's environment variables.
  output: 'static',

  integrations: [
    sitemap({
      // Never advertise a page that carries a noindex tag. Privacy and terms
      // are placeholders until real legal copy lands — remove them from this
      // list at the same time as the noindex prop on those pages.
      filter: (page) => !['/privacy', '/terms'].some((p) => page.includes(p)),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    // Sanity's CDN serves and transforms poem imagery.
    domains: ['cdn.sanity.io'],
  },

  // Prefetch on hover rather than for every link in the viewport. The old
  // setting fetched every linked page as soon as it scrolled into view, which
  // on a page of large artwork meant a burst of requests competing with the
  // images actually being displayed.
  prefetch: {
    defaultStrategy: 'hover',
  },
});
