import type { APIRoute } from 'astro';

const SITE = import.meta.env.PUBLIC_SITE_URL || 'https://shannonsuttles.com';

/**
 * Drafts must never be indexed. The /preview/ route is disallowed here and
 * also carries an X-Robots-Tag header from netlify.toml — belt and braces,
 * because an indexed draft cannot be un-indexed quickly.
 */
export const GET: APIRoute = () =>
  new Response(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /preview/',
      '',
      `Sitemap: ${SITE}/sitemap-index.xml`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
