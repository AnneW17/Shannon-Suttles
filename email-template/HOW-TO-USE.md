# The email template

The branding is set up **once**, in Buttondown's settings. After that
Shannon just writes her words in the editor like normal — no HTML, no
copying, nothing to remember. Every email comes out wrapped in the
header and footer automatically.

---

## Setting it up (once, about five minutes)

Go to **buttondown.com/settings/email**.

There are two boxes on that page: **Header** and **Footer**.

Before pasting into either one, click the **⋯** (three dots) menu on that
box and switch it to **Markdown mode**. If you skip this, the HTML will
show up as visible code in the email instead of as a design.

**1.** Open `1-HEADER-paste-into-settings.html` in Notepad, select all
(Ctrl+A), copy (Ctrl+C), and paste it into the **Header** box.

**2.** Open `2-FOOTER-paste-into-settings.html`, copy it the same way, and
paste it into the **Footer** box.

**3.** Save.

While you are on that page, set the **accent colour** to `#7a5c86` so that
links inside her writing match the rest of the design.

That's it. Never needs doing again.

---

## Sending an email after that

Write it normally in Buttondown. Type the words, or paste them from
Sanity. The logo, the strapline, the gold rules, the signature and the
footer all attach themselves.

**For a scripture passage or a line to set apart:** open
`3-SCRIPTURE-BLOCK-optional.html`, copy it, and paste it into the email
where the passage should go, then type over the placeholder line. The
editor needs to be in **Markdown mode** for this — the **⋯** menu again.
Skip this entirely if a particular word doesn't need one.

**Always send a test to yourself before sending to the list.** Email
cannot be unsent.

**Never remove Buttondown's unsubscribe link.** It is added automatically
at the very bottom. Removing it breaks Buttondown's terms and the
CAN-SPAM Act.

---

## The logo

It loads from the live website:

    https://shannonsuttles.com/brand/email/wordmark-email.jpg

So the site has to be pushed before the logo appears. It already is.
If the logo ever stops appearing, check that this address still opens in
a browser — that is almost always the cause.

It is a JPEG with the black baked in rather than a transparent PNG,
because Outlook mishandles PNG transparency and would put a grey box
behind the mark.

---

## Why the top and bottom are black but the middle is not

A website is something a person chooses to look at. An email is read in a
queue, often one-handed, often in sunlight. Long passages of pale text on
black slow reading and tire the eye — and her words are long passages.

The larger problem is that Gmail and Outlook on phones apply their own
dark-mode inversion. They see a dark email, invert parts of it, and
produce grey text on grey or a black band across a white page. It is the
most common way a carefully built email arrives looking broken, and it
cannot be prevented reliably.

So the ink wraps her words top and bottom, and the words themselves sit
on a pale ground where they stay readable.

---

## What email cannot do

- **Bodoni Moda and Cormorant Garamond do not load** in Gmail or Outlook.
  Georgia is used instead: on every device, same warm high-contrast serif
  feeling.
- **No SVG.** Most email clients refuse to render it.
- **No modern CSS.** Everything is inline and would have worked in 2005,
  which is roughly where Gmail's support sits.
- **No video.** Link to YouTube or Vimeo instead.

---

## The other files in here

- `preview.html` — open this to see roughly how a finished email looks.
  For looking at only; do not paste it anywhere.
- `buttondown-email.html` — the whole design as one block. Only needed if
  the Header/Footer approach above is ever unavailable. Ignore it
  otherwise.
