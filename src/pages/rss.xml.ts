import type { APIRoute } from 'astro';
import { getAllPoems, getPoemBySlug } from '@lib/sanity/queries';
import { renderPoem, poemToPlainText } from '@lib/portableText';
import { SITE } from '@lib/site';
import { entryPath } from '@lib/paths';

/**
 * THE FEED
 *
 * This is what makes the mailing list automatic. Shannon publishes in Sanity,
 * the site rebuilds, this file is regenerated, and the email service notices
 * a new entry and sends it out. Nobody exports a list or writes a campaign.
 *
 * It carries the FULL text of each entry in <content:encoded>, not a summary,
 * because subscribers should be able to read the whole word in their inbox
 * rather than being sent back to the site. That is a deliberate choice: if it
 * only carried an excerpt, the emails would arrive truncated and there would
 * be no way to fix it from the email service's end.
 *
 * Written as plain XML rather than pulling in a feed package — it is a small
 * amount of markup and it keeps the project's dependencies down.
 */

// Anything inside CDATA must not contain the closing sequence, or the feed
// breaks in a way that is hard to spot.
const cdata = (value: string) => `<![CDATA[${value.replace(/\]\]>/g, ']]&gt;')}]]>`;

const escape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  // Both kinds, newest first — subscribers receive words and prayers alike.
  const entries = await getAllPoems();

  // The list query returns cards without bodies, so each full entry is
  // fetched here. There are few enough of these that it stays quick, and it
  // only happens at build time.
  const full = await Promise.all(entries.map((entry) => getPoemBySlug(entry.slug)));

  const items = full
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .map((entry) => {
      const url = new URL(entryPath(entry), SITE.url).href;
      const html = renderPoem(entry.body);
      const summary = entry.excerpt || poemToPlainText(entry.body, 300);

      return `
    <item>
      <title>${cdata(entry.title)}</title>
      <link>${escape(url)}</link>
      <guid isPermaLink="true">${escape(url)}</guid>
      <pubDate>${new Date(entry.publishedAt).toUTCString()}</pubDate>
      <description>${cdata(summary)}</description>
      <content:encoded>${cdata(html)}</content:encoded>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${cdata(`${SITE.name} — Words from the Lord`)}</title>
    <link>${escape(SITE.url)}</link>
    <description>${cdata(SITE.description)}</description>
    <language>en</language>
    <atom:link href="${escape(new URL('/rss.xml', SITE.url).href)}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
