import { toHTML, type PortableTextBlock } from '@portabletext/to-html';

/**
 * POEM RENDERER
 *
 * Standard rich-text renderers are built for prose: they collapse blank
 * lines, trim whitespace, and treat a line break as decoration. For poetry
 * all three behaviours are wrong. Every one of them destroys the shape of
 * the poem, which is part of the poem.
 *
 * So this renderer does three specific things:
 *
 *   1. Empty blocks survive as `<p></p>`. In the Studio, pressing Enter on a
 *      blank line is how Shannon separates stanzas. CSS gives those empty
 *      paragraphs a line's worth of height.
 *
 *   2. Soft breaks (Shift+Enter) arrive as `\n` inside a span and are
 *      converted to `<br>` by the underlying serializer, so they survive to
 *      the page as real line breaks.
 *
 *   3. Leading and repeated spaces are converted to `&nbsp;`, so an indented
 *      line keeps its indent instead of being collapsed by HTML whitespace
 *      rules. An indent is an authorial decision, not stray formatting.
 *
 * Points 2 and 3 are handled by @portabletext/to-html rather than by this
 * file; they are documented here because the stylesheet depends on them and
 * tests/poem-render.test.mjs asserts them.
 */
export function renderPoem(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks?.length) return '';

  return toHTML(blocks, {
    components: {
      block: {
        normal: ({ children }) => {
          // `children` is an empty string for a blank line. Emitting an empty
          // paragraph (rather than nothing) is what preserves the stanza gap.
          const content = typeof children === 'string' ? children : String(children ?? '');
          return content.trim() === '' ? '<p></p>' : `<p>${content}</p>`;
        },
        h2: ({ children }) => `<h2>${children}</h2>`,
        h3: ({ children }) => `<h3>${children}</h3>`,
        blockquote: ({ children }) => `<blockquote>${children}</blockquote>`,
      },
      marks: {
        em: ({ children }) => `<em>${children}</em>`,
        strong: ({ children }) => `<strong>${children}</strong>`,
        link: ({ children, value }) => {
          const href = (value as { href?: string })?.href ?? '';
          const external = href.startsWith('http');
          const rel = external ? ' rel="noopener noreferrer" target="_blank"' : '';
          return `<a href="${escapeAttr(href)}" class="link-editorial"${rel}>${children}</a>`;
        },
      },
    },
  });
}

/**
 * Plain text version of a poem. Used for meta descriptions and for the
 * fallback excerpt when Shannon has not written one.
 */
export function poemToPlainText(blocks: PortableTextBlock[] | undefined, limit = 200): string {
  if (!blocks?.length) return '';

  const text = blocks
    .filter((block) => block._type === 'block')
    .map((block) =>
      ((block.children as { text?: string }[]) ?? [])
        .map((child) => child.text ?? '')
        .join('')
    )
    .filter((line) => line.trim() !== '')
    .join(' · ');

  if (text.length <= limit) return text;
  return text.slice(0, text.lastIndexOf(' ', limit)).trimEnd() + '…';
}

/** First non-empty line — a natural, quiet excerpt for archive listings. */
export function firstLine(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks?.length) return '';
  for (const block of blocks) {
    if (block._type !== 'block') continue;
    const line = ((block.children as { text?: string }[]) ?? [])
      .map((c) => c.text ?? '')
      .join('')
      .trim();
    if (line) return line;
  }
  return '';
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
