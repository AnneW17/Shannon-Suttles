# shannonsuttles.com — where things stand

Written 28 September 2026. Updated 16 November 2026. Hand this to a new chat
as the starting point.

---

## What this is

A static site for Shannon Suttles — **words from the Lord and written
prayers to pray**. Not a poetry site; that framing was retired.

Built so Shannon can publish from her phone without touching code, Git,
Netlify or a terminal.

**Stack:** Astro 5.18.2 (`output: 'static'`, no Netlify adapter) · Tailwind v4
(CSS-first, no config file) · Sanity CMS · Netlify · GitHub.

**Art direction — "Liquid Ink":** obsidian, violet, gold. Bodoni Moda
(display), Cormorant Garamond (body), Jost (UI), self-hosted.

---

## The rule that matters most

**Never invent content.** No placeholder words, sample prayers, fake
excerpts, invented book titles or imagined collections. If something has
not been written, the page says so plainly. This was broken once — QA
fixture text reached the live site — and it must not happen again.

Before shipping, grep the built output for `QA FIXTURE`, `PREVIEW ONLY`,
`LOCAL PREVIEW`, and any placeholder titles.

---

## Structure

| Page | Address |
| --- | --- |
| Home | `/` |
| Words | `/words`, `/words/<slug>` |
| Prayers | `/prayers`, `/prayers/<slug>` |
| About | `/about` |
| Ventures | `/work` |
| Subscribe | `/subscribe` |
| Contact | `/contact` |
| Support | `/support` |
| Feed | `/rss.xml` |

Nav order: Words · Prayers · About · Ventures · Subscribe · Contact.

`/poetry/*` 301-redirects to `/words/*` in `netlify.toml` with `force = true`.

### Words and prayers

One Sanity document type (`poem`, labelled "Word or Prayer") with a `kind`
field: `word` or `prayer`. Radio buttons at the top of the Write tab.

**Entries published before that field existed carry no `kind` at all** —
Sanity does not backfill `initialValue`. Queries therefore treat a missing
value as `word` (`IS_WORD = kind == "word" || !defined(kind)`). Removing
that fallback would make her published writing vanish.

`src/lib/paths.ts` holds `entryPath()` — the single place that decides
whether something lives under `/words/` or `/prayers/`. Never hard-code
either path in a component.

---

## Mailing list

**Buttondown**, username **`JasonandShannon`** (capitalised; lowercase redirects).
Free tier, 100 subscribers.

Signup posts straight to
`https://buttondown.com/api/emails/embed-subscribe/JasonandShannon` as a real HTML
form. Buttondown's docs are explicit that this endpoint must **not** be
called with `fetch()` — the visitor sometimes has to follow the response to
clear a CAPTCHA.

Fields sent: `email`, `metadata__first_name`, `metadata__organisation`,
`metadata__consent`, plus hidden `embed=1` and a `tag`.

**The contact form also subscribes people.** It posts to the same endpoint
with `metadata__enquiry_type` and `metadata__message` added, tagged
`website-enquiry`. This was a deliberate decision by Annie. Netlify Forms was
built first and then removed — do not re-add it.

Signup appears on: `/subscribe`, home, `/words`, `/prayers`, and the foot of
every word and prayer. Deliberately **not** on `/contact`.

### Paid features not taken

Free tier covers sending, 100 subscribers, and custom sending domain. These
are add-ons and were declined:

- **RSS-to-email** (auto-send on publish) — $9/mo
- **Subscriber metadata** retention — $9/mo. *Untested: whether the free
  plan stores the name and organisation fields is still unverified.*
- **Email design / CSS templates** — $9/mo
- **Transactional email design** (the confirmation email) — Standard plan

Buttondown gives **50% off to registered 501(c)(3) nonprofits** — email
support with proof of registration.

`/rss.xml` carries the **full text** of every entry, both kinds, in
`<content:encoded>`. It exists ready for the day RSS-to-email is turned on.

### Email design

`email-template/` holds it. Header and footer HTML go once into Buttondown
**Settings → Email**; after that Shannon just types, no HTML.

**Two things broke this repeatedly, both now fixed:**

1. Those boxes render Markdown, and Markdown treats any line indented four
   or more spaces as a code block. **All template files must stay on a single
   line with zero indentation.** Do not "tidy" them.
2. The editor needs switching to Markdown mode via the **⋯** menu *before*
   pasting. Switching afterwards does not un-escape what is already there.

The logo loads from `https://shannonsuttles.com/brand/email/wordmark-email.jpg`
— a JPEG with black baked in, because Outlook mishandles PNG transparency.

Body is pale, masthead and footer are ink. Deliberate: Gmail and Outlook on
phones invert dark emails and wreck them.

### Two looks

- **Shannon Suttles** — `1-HEADER-paste-into-settings.html` +
  `2-FOOTER-paste-into-settings.html`. Her wordmark, personal, for words and
  prayers.
- **Firebrand Revivalists** — `5-FIREBRAND-HEADER.html` +
  `6-FIREBRAND-FOOTER.html`. From Jason & Shannon, ministry links at the
  foot, for updates and announcements.

Only one pair can live in the Settings boxes at a time, because those boxes
apply to every email. Annie currently keeps the **Firebrand** pair in
Settings. Running both looks would mean clearing Settings and pasting header
and footer into each email by hand, or paying $29/mo for multiple
newsletters.

### The Outlook centring problem — UNRESOLVED

The 600px column renders flush against the **left edge** in **new Outlook**
on Windows (the redesigned client with no ribbon, rounded Reply buttons).
Not cut off, not unreadable — just not centred.

Two standard remedies were tried and **both failed**:

1. **MSO conditional ghost table** (`<!--[if mso]>…<![endif]-->`) wrapping
   the 600px column, `align="center"` on table and containing cell. Still in
   all four template files and the body files. Harmless, and correct for
   *classic* desktop Outlook — but **new Outlook ignores MSO conditionals
   entirely**, so it was never going to help there.
2. **`style="text-align:center"`** added to the containing cell alongside the
   `align` attribute, in case the attribute was being stripped by their
   sanitiser. Also still in place. Did not change anything.

Conclusion: the cause is almost certainly **Buttondown's own template
wrapper**, which cannot be seen or changed from the account. Buttondown
support (Anita) has said that modifying default templates with HTML is not a
supported workflow, and suggested either Fancy mode — which cannot build a
branded masthead, and rewrites HTML — or the **Professional plan** (~$79/mo)
for Naked Mode and custom templates. **Annie cannot spend more money, so the
paid route is closed.**

Decision taken: **ship it.** It renders correctly on phones and in Gmail,
which is where almost all readers are. A support question was sent to Anita
asking whether their wrapper applies a width or alignment that prevents a
nested 600px table centring. If she answers with a real fix, apply it once
to the Settings boxes and every future email inherits it.

**Do not pay for Professional, and do not use Fancy mode.** The remaining
free fallback, if it ever becomes worth doing, is to make the masthead and
footer full width so there is nothing to centre — rejected for now because on
a very wide window it means an enormous logo, which may look worse.

### The palette changed — the emails are GREY now, not cream

As of 16 October 2026 the email body ground is a **true neutral grey**, after
cream and then warm greige were both rejected as looking creamy or blue on a
phone. The current values, used across every template and body file:

| Use | Hex |
| --- | --- |
| Body ground, full width | `#e8e8e8` |
| Giving / stat panels | `#d9d9d9` |
| Body text | `#2a2a28` |
| Scripture text | `#4a4a46` |
| Small italic captions | `#5f5f5b` |
| Disclosure / muted | `#55554f` |
| Gold rules and borders | `#c9a86a` |
| Gold labels | `#a8874a` |
| Masthead / footer ink | `#0b0b0a` |

Two things made the grey actually read as grey, and both matter:

1. **The text was purple-toned** (`#2c2430`, `#4a3f50`), carried over from the
   website palette. Purple text on grey reads blue. Neutralising the type was
   what fixed the "it looks blue" complaint — not the background.
2. **The grey must be painted on the full-width wrapper table, not just the
   600px column.** Otherwise the area around and between the blocks shows
   whatever colour sits behind, which looked cream in preview and white in
   Buttondown. The header's old 30px bottom margin was removed and the
   footer's 34px top margin became padding on a grey wrapper, so the ink
   masthead runs straight into the gold rule and then into grey.

### Type sizes

The top kicker ("A Word from the Lord") is **16px with 4px letter-spacing** —
it was 11px and read as fine print next to the 27px section headings. The
reading-time line under it is 15px italic. Scripture reference labels stay at
11px on purpose, so they read as references rather than headings.

### Emails written so far

All live in `email-template/emails/`, single-line, zero-indent, each with a
`preview-*.html` beside it that wraps header + body + footer for eyeballing.

- `BODY-dc-assembly.html` — the October 31 Reformation Day / National Mall
  fundraising letter. Six photos, inline giving panel, 501(c)(3)/508(c)(1)(A)
  disclosure. **Still cream** — never converted to grey.
- `BODY-waymaker-angel.html` — "The Waymaker Angel of the Lord". Shannon's
  vision, with Hebrews 1, Psalm 103, Psalm 91, Isaiah 43, Job 38 and
  Matthew 8:8 set in gold-barred scripture blocks. Opens "Hi Friends,"
  (Buttondown name personalisation is a paid add-on), labelled "A four minute
  read" at Annie's instruction — the true length is ~1,260 words, nearer six.
  Order was deliberately rearranged so the **word runs uninterrupted first**,
  then the angel image, then the Nehemiah paragraph, speakers graphic, giving
  section and prayer request. Giving ask after the word, never before it.
- `BODY-watchmen-update.html` — the family update letter. North Carolina
  move, granddaughter on the beach, the America's Watchmen Facebook group as
  a **Join the Group** button, and a "Where We Stand" panel showing $2,166
  received of the $5,000 goal with $2,834 still needed. Signed "With love and
  gratitude, Jason & Shannon Suttles".
- `BODY-test-video.html` — a test email for the couple photo and the prayer
  video.

### Video does not play in email — ever

Gmail, Outlook and Apple Mail all strip `<video>`. The pattern used instead:
a **still frame with a gold play button drawn onto it**, linking out, plus a
text button beneath it. `prayer-video-thumb.jpg` was made this way with
ffmpeg (frame at 20s) and Pillow.

The MP4 itself is hosted on the site at
`public/brand/video/prayer-over-the-nation.mp4` (8.5 MB, 1:13, vertical
1080×1920). Clicking opens the browser's native player. **YouTube or Vimeo
would be better** — a real player with controls and view counts — if Shannon
ever wants that; only the two `href` values in the body would change.

### Transparent PNGs must be flattened

Outlook puts a grey or black box behind PNG transparency. Any supplied PNG
gets composited onto the email ground colour and saved as JPEG first —
`jason-shannon-2026.jpg` was made this way.

### Previews cannot load images from a folder path

The file-preview panel will not load `../../public/...` images, so previews
showed broken-image icons even when everything was correct. This caused a
false alarm. The fix, used in `preview-test-video.html`, is to **embed the
images as base64 `data:` URLs** when building the preview. Do that for new
previews; it removes the ambiguity entirely.

### Images must be pushed before sending

Email images load from `https://shannonsuttles.com/brand/email/…`, served out
of `public/brand/email/`. Nothing on the site links to that folder — it is
purely a storage shelf with public addresses. **A new image is a 404 until
`git add . && git commit && git push` has run and Netlify has rebuilt.** This
has caused a broken image twice. Always open the image's URL in a browser
before sending.

When replacing an image, **change the filename** (`-v2`, `-v3`). Browsers and
the CDN serve the cached old file otherwise.

Current contents of `public/brand/email/`:

| File | Used by |
| --- | --- |
| `wordmark-email.jpg` | Shannon masthead |
| `firebrand-email.jpg` | Firebrand masthead |
| `dc-banner.jpg`, `jason-shannon-v3.jpg`, `annie-shannon.jpg`, `sanzari-family.jpg`, `ember-ridge.jpg`, `generational-legacy.jpg` | DC assembly letter |
| `waymaker-angel.jpg` | Waymaker email (840×1260, shown at 420) |
| `na52-speakers.jpg` | Waymaker email — Nehemiah speakers lineup |
| `beach-girl.jpg` | Watchmen update — granddaughter, from a HEIC |
| `watchmen-banner.jpg` | Watchmen update — links to the Facebook group |
| `prayer-video-thumb.jpg` | Video still with play button |
| `jason-shannon-2026.jpg` | Couple photo, flattened from a transparent PNG |

HEIC files from an iPhone need `pip install pillow-heif --break-system-packages`
before Pillow can open them.

### Pasting into Buttondown — the order that works

1. New email → **`...` menu → Markdown mode.** Before pasting, never after.
   Fancy mode renders HTML as visible text and rewrites markup.
2. Paste the body.
3. To replace existing content, click in the box and press **Ctrl+A then
   Delete**. Selecting with the mouse leaves fragments behind — this once left
   `erationallegacy.org/` stranded under the footer, a tail of the
   Generational Legacy link from a half-deleted earlier paste.
4. Send a test to yourself. Check it on a phone. Email cannot be unsent.

Annie works from **code pasted directly into chat**, not from file links —
file cards have repeatedly been missed. Paste the full block in the reply.

---

## Still outstanding

- **Privacy and Terms pages are placeholder text.** Both consent lines now
  point at promises those pages are supposed to back. Needs real copy.
- **Giving disclosure** — the supplied sentence began "An auxiliary ministry
  of Firebrand Revivalists™…", which cannot be right for gifts made *to*
  Firebrand. Opening clause dropped; needs a human/tax decision.
- **Sending domain** not set up. Plan: `newsletter.shannonsuttles.com`,
  managed setup, two NS records. Blocked on knowing where the domain's DNS
  is managed.
- **Image provenance** — liquid artwork, roses, jewellery appear
  AI-generated or stock; commercial rights unverified.
- **PayPal** button redirects to a business profile. Account config, not site.
- **Two GitHub accounts** — AnneW17 (owns the repo) vs AnneWhaley17. Remote
  is set to `https://AnneW17@github.com/...`.
- Shannon should approve "who has walked this rebuilding alongside her" on
  the About page — that phrasing is mine, not hers.
- Her two published entries need the Word/Prayer box ticked explicitly.
- **Outlook centring** — see above. Awaiting Anita at Buttondown.
- **Subscribe confirmation emails were not arriving** at one point. The form
  itself was verified correct (endpoint, field keys, `embed=1`). Suspected
  Buttondown-side throttling — their docs say sending is temporarily disabled
  on bounces or complaints. Needs retesting; if it recurs, it is a support
  question, not a code one.
- **Buttondown notification emails** still go to Annie's personal address
  rather than info@firebrandrevivalists.com. The setting was not found under
  Settings; likely `buttondown.com/settings/account`. **Caution:** that
  address may also be the login. Confirm mail can be received at info@ before
  switching, or the account could be locked out.
- **The Firebrand Revivalists site's signup form** (a separate project, not
  in this folder) still posts to the retired `AWHALEY17` username. Buttondown
  redirects the username but **POSTs do not survive the redirect**, so that
  form is probably broken. Fix it in that project.

---

## Working notes

OneDrive breaks `astro build` with ENOTEMPTY. Build in `$HOME/ssbuild`
instead: copy changed files there, stub `src/lib/sanity/queries.ts` with a
fixture, build, inspect `dist/`. **Never let a fixture reach the real repo.**

Deploys are separate:

```
git push                                  # the website, via Netlify
cd studio && npx sanity deploy            # the Sanity Studio
```

Sanity project `eamx1rr2`, dataset `production`, Studio at
shannonsuttles.sanity.studio. Hard-refresh (Ctrl+Shift+R) after a studio
deploy — the browser caches it hard.
