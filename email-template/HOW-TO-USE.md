# The email templates

There are **two looks**, and Shannon picks one per email:

- **Shannon Suttles** — her own wordmark, personal, for words and prayers.
- **Firebrand Revivalists** — from Jason & Shannon, with the ministry links
  at the foot. For updates, announcements, anything ministry-wide.

---

## Important: the settings boxes must be EMPTY

Buttondown has Header and Footer boxes under **Settings > Email**. Those apply
to *every* email, so they cannot hold two different looks. Running two brands
from one newsletter means **clearing both boxes** and pasting the header and
footer into each email instead.

(Buttondown does sell multiple newsletters, which would allow two saved
designs, but it is a $29/month add-on.)

---

## Writing an email

1. **New email.** Set the editor to **Markdown mode** or **Naked mode** using
   the **...** menu. Never Fancy mode — it rewrites HTML.
2. Paste the **header** for whichever look you want:
   - `1-HEADER-paste-into-settings.html` for Shannon
   - `5-FIREBRAND-HEADER.html` for Firebrand
3. Press Enter a couple of times, then **type the words normally**.
4. At the end, paste the matching **footer**:
   - `2-FOOTER-paste-into-settings.html` for Shannon
   - `6-FIREBRAND-FOOTER.html` for Firebrand
5. **Send a test to yourself and check it on a phone.** Always. Email cannot
   be unsent.

Header and footer must match. A Shannon header with a Firebrand footer will
look like a mistake, because it is one.

The two files keep their old names so nothing already pasted breaks.

### Optional

`3-SCRIPTURE-BLOCK-optional.html` — a passage set apart with a gold bar down
the side. Paste it into the body wherever the passage belongs.

---

## Never do this

- **Do not add line breaks or indentation to the template files.** They are
  each deliberately one long line. Markdown treats any line indented four or
  more spaces as a code block, and the design will show up as visible code.
  This broke twice before it was understood.
- **Do not remove Buttondown's unsubscribe link.** It is added automatically
  at the very bottom. Removing it breaks Buttondown's terms and the CAN-SPAM
  Act.

---

## Previews

Open these to see each look before sending. For looking at only.

- `preview.html` — the Shannon version
- `preview-firebrand.html` — the Firebrand version

---

## The logos

They load from the live website:

    https://shannonsuttles.com/brand/email/wordmark-email.jpg
    https://shannonsuttles.com/brand/email/firebrand-email.jpg

Both must be pushed to the site before they appear in a real email. If a logo
ever stops showing, open that address in a browser — that is almost always
the cause.

Both are JPEGs with their background baked in rather than transparent PNGs,
because Outlook mishandles PNG transparency and would put a grey box behind
the mark.

---

## Why the top and bottom are dark but the middle is not

A website is something a person chooses to look at. An email is read in a
queue, often one-handed, often in sunlight. Long passages of pale text on
black slow reading and tire the eye.

The larger problem is that Gmail and Outlook on phones apply their own
dark-mode inversion. They see a dark email, invert parts of it, and produce
grey text on grey or a black band across a white page. It is the most common
way a carefully built email arrives looking broken, and it cannot be
prevented reliably.

So the dark wraps the writing top and bottom, and the writing itself sits on
a pale ground where it stays readable.

---

## What email cannot do

- **Bodoni Moda and Cormorant Garamond do not load** in Gmail or Outlook.
  Georgia is used instead: on every device, same warm high-contrast serif.
- **No SVG.** Most email clients refuse to render it.
- **No modern CSS.** Everything is inline and would have worked in 2005,
  which is roughly where Gmail's support sits.
- **No video.** Link to YouTube or Vimeo instead.

---

## Also in this folder

- `4-SIGNUP-EMBED-for-other-sites.html` — a standalone signup form for
  embedding on another website. Not part of the email templates.
- `buttondown-email.html` — the whole Shannon design as one block, from an
  earlier approach. Kept as a fallback; not needed for the steps above.
