# The email template

`buttondown-email.html` is the layout Shannon's emails use. It is plain HTML
with no instructions inside it, so the whole file can be copied and pasted
without anything leaking into the email.

`preview.html` is the same design with the logo loaded from this folder rather
than from the website, so it can be looked at before the site is pushed. It is
only for looking at. Do not paste that one into Buttondown.

---

## Sending an email

1. Open `buttondown-email.html` in Notepad — right-click, Open with, Notepad.
2. Select all (Ctrl+A), copy (Ctrl+C).
3. In Buttondown, start a new email and set the editor to **Markdown mode**
   or **Naked mode**. Not Fancy mode: it rewrites HTML and undoes the styling.
4. Paste.
5. Change three things:
   - `Title of This Word`
   - `September 28, 2026`
   - the two paragraphs, and the scripture block if it is wanted

Each paragraph needs to be wrapped like this so the spacing stays even:

    <p style="margin:0 0 20px 0;">The paragraph goes here.</p>

Delete the scripture block entirely if a particular word does not need one.

6. Send a test to yourself before sending to the list. Always.

**Never remove Buttondown's unsubscribe link.** It is added automatically
underneath. Removing it breaks Buttondown's terms and the CAN-SPAM Act.

---

## The logo

It loads from the live website:

    https://shannonsuttles.com/brand/email/wordmark-email.jpg

So the site has to be pushed once before the logo appears in a real email.
Until then it shows as a broken image — that is expected, not a fault.

It is a JPEG with the black baked in rather than a transparent PNG, because
Outlook mishandles PNG transparency and would put a grey box behind the mark.

---

## Why the top is black and the middle is not

A website is something a person chooses to look at. An email is read in a
queue, often one-handed, often in sunlight. Long passages of pale text on
black slow reading and tire the eye, and her words are long passages.

The larger problem is that Gmail and Outlook on phones apply their own
dark-mode inversion. They see a dark email, invert parts of it, and produce
grey text on grey or a black band across a white page. It is the most common
way a carefully built email arrives looking broken, and it cannot be
prevented reliably.

So the ink wraps the words top and bottom, and the words themselves sit on
the same pearl they sit on when read on the website.

**To make it black throughout anyway:** in `buttondown-email.html`, change
every `background-color:#fbf5f2` to `background-color:#050308`, then change
`color:#271829` to `color:#fbf5f2` and `color:#2c2430` to `color:#e6dfe8`.

---

## What email cannot do

- **Bodoni Moda and Cormorant Garamond do not load** in Gmail or Outlook.
  Georgia is used instead: present on every device, same warm high-contrast
  serif feeling.
- **No SVG.** Most email clients refuse to render it.
- **No modern CSS.** Everything is inline and would have worked in 2005,
  which is roughly where Gmail's support sits.
- **No video.** Link to YouTube or Vimeo instead.
