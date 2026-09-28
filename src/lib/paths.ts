import type { PoemKind } from '@lib/sanity/types';

/**
 * WHERE AN ENTRY LIVES
 *
 * Words are served from /words/<slug> and prayers from /prayers/<slug>. That
 * rule is written here once and nowhere else: a hard-coded "/words/" anywhere
 * in a component is a link that silently breaks for every prayer, and those
 * are the kind of bug that only shows up after the content exists.
 *
 * Anything without a kind is a Word. The two entries published before the
 * field existed carry no value, and they are words.
 */
export function entryPath(entry: { slug: string; kind?: PoemKind }): string {
  return entry.kind === 'prayer' ? `/prayers/${entry.slug}` : `/words/${entry.slug}`;
}

/** The section an entry belongs to, for headings and "back to" links. */
export function sectionFor(kind?: PoemKind) {
  return kind === 'prayer'
    ? { label: 'Prayers', href: '/prayers', singular: 'prayer' }
    : { label: 'Words', href: '/words', singular: 'word' };
}
