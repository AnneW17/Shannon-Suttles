/**
 * Poem rendering tests.
 *
 * The renderer is the one place where a subtle bug silently damages the art:
 * a collapsed stanza break or a trimmed indent changes the poem without
 * throwing an error. These cases come straight from the brief — very short
 * lines, very long lines, multiple stanzas, blank lines, italics, leading
 * whitespace, and punctuation.
 */
import { toHTML } from '@portabletext/to-html';
import assert from 'node:assert/strict';

// Mirrors src/lib/portableText.ts renderPoem()
function renderPoem(blocks) {
  if (!blocks?.length) return '';
  return toHTML(blocks, {
    components: {
      block: {
        normal: ({ children }) => {
          const content = typeof children === 'string' ? children : String(children ?? '');
          return content.trim() === '' ? '<p></p>' : `<p>${content}</p>`;
        },
        h2: ({ children }) => `<h2>${children}</h2>`,
        blockquote: ({ children }) => `<blockquote>${children}</blockquote>`,
      },
      marks: {
        em: ({ children }) => `<em>${children}</em>`,
        strong: ({ children }) => `<strong>${children}</strong>`,
      },
    },
  });
}

let n = 0, pass = 0;
const check = (name, fn) => {
  n++;
  try { fn(); pass++; console.log(`  ✓ ${name}`); }
  catch (e) { console.log(`  ✗ ${name}\n      ${e.message}`); }
};

const line = (text, key, marks = []) => ({
  _type: 'block', _key: key, style: 'normal', markDefs: [],
  children: [{ _type: 'span', _key: key + 's', text, marks }],
});
const blank = (key) => ({
  _type: 'block', _key: key, style: 'normal', markDefs: [],
  children: [{ _type: 'span', _key: key + 's', text: '', marks: [] }],
});

console.log('\nPoem rendering\n');

check('renders each line as its own paragraph', () => {
  const html = renderPoem([line('I bring You no untouched story,', 'a'), line('no life arranged in perfect lines—', 'b')]);
  assert.equal((html.match(/<p>/g) || []).length, 2);
  assert.ok(html.includes('I bring You no untouched story,'));
});

check('preserves a blank line as an empty paragraph (stanza break)', () => {
  const html = renderPoem([line('What became wisdom was once a question.', 'a'), blank('b'), line('You found the child beneath the armor,', 'c')]);
  assert.ok(html.includes('<p></p>'), 'stanza break was collapsed — the poem loses its shape');
});

check('preserves multiple consecutive blank lines', () => {
  const html = renderPoem([line('one', 'a'), blank('b'), blank('c'), line('two', 'd')]);
  assert.equal((html.match(/<p><\/p>/g) || []).length, 2);
});

check('preserves an indented line as non-breaking spaces', () => {
  // HTML collapses runs of spaces, so the serializer converts them to &nbsp;.
  // The indent must survive in some form — that is the assertion that matters.
  const html = renderPoem([line('    an indented line', 'a')]);
  assert.ok(html.includes('&nbsp;'), 'leading indent was collapsed away');
  assert.ok(html.includes('an indented line'));
});

check('preserves a soft line break (Shift+Enter) as <br>', () => {
  const html = renderPoem([line('first half\nsecond half', 'a')]);
  assert.ok(/<br\s*\/?>/.test(html), 'soft break lost');
  assert.ok(html.includes('first half') && html.includes('second half'));
});

check('emits no stray newlines between blocks', () => {
  // The stylesheet deliberately does not use white-space: pre-wrap. That is
  // only safe while the serializer emits no literal newlines of its own.
  const html = renderPoem([line('one', 'a'), line('', 'b'), line('two', 'c')]);
  assert.ok(!html.includes('\n'), 'a stray newline would render as a false line break');
});

check('renders italics', () => {
  const html = renderPoem([line('all of it', 'a', ['em'])]);
  assert.ok(html.includes('<em>'), 'italics dropped');
});

check('renders bold', () => {
  const html = renderPoem([line('Carry on.', 'a', ['strong'])]);
  assert.ok(html.includes('<strong>'));
});

check('handles a very short line', () => {
  assert.ok(renderPoem([line('Yes.', 'a')]).includes('<p>Yes.</p>'));
});

check('handles a very long line without truncating', () => {
  const long = 'So take the work and take the words, the rooms, the children, plans, and fire, every page, every yes, every becoming, all of it Jesus back to You.';
  assert.ok(renderPoem([line(long, 'a')]).includes(long));
});

check('escapes HTML rather than executing it', () => {
  const html = renderPoem([line('a < b & c > d', 'a')]);
  assert.ok(html.includes('&lt;') && html.includes('&amp;'), 'unescaped output is an injection risk');
});

check('preserves em dashes, curly quotes and ellipses', () => {
  const text = '“There is still fire. Carry on.” — and yet…';
  assert.ok(renderPoem([line(text, 'a')]).includes(text));
});

check('renders a section heading', () => {
  const html = renderPoem([{ _type: 'block', _key: 'a', style: 'h2', markDefs: [], children: [{ _type: 'span', _key: 'as', text: 'II', marks: [] }] }]);
  assert.ok(html.includes('<h2>II</h2>'));
});

check('returns empty string for no content', () => {
  assert.equal(renderPoem([]), '');
  assert.equal(renderPoem(undefined), '');
});

check('full poem keeps every stanza boundary', () => {
  const poem = [
    line('I bring You no untouched story,', '1'),
    line('no life arranged in perfect lines—', '2'),
    blank('3'),
    line('What became wisdom was once a question.', '4'),
    line('What became shelter was once a wound.', '5'),
    blank('6'),
    line('So take the work and take the words,', '7'),
  ];
  const html = renderPoem(poem);
  assert.equal((html.match(/<p><\/p>/g) || []).length, 2, 'wrong number of stanza breaks');
  assert.equal((html.match(/<p>(?!<\/p>)/g) || []).length, 5, 'wrong number of written lines');
});

console.log(`\n${pass}/${n} passed\n`);
process.exit(pass === n ? 0 : 1);
