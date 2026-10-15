# shannonsuttles.com — where things stand

Written 28 September 2026. Updated 15 October 2026. Hand this to a new chat
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

### Emails written so far

Both live in `email-template/emails/`, single-line, zero-indent, each with a
`preview-*.html` beside it that wraps header + body + footer for eyeballing.

- `BODY-dc-assembly.html` — the October 31 Reformation Day / National Mall
  fundraising letter. Six photos, inline giving panel, 501(c)(3)/508(c)(1)(A)
  disclosure.
- `BODY-waymaker-angel.html` — "The Waymaker Angel of the Lord". Shannon's
  vision, with Hebrews 1, Psalm 103, Psalm 91, Isaiah 43, Job 38 and
  Matthew 8:8 set in gold-barred scripture blocks. Opens "Hello," (Buttondown
  name personalisation is a paid add-on), labelled "A four minute read" at
  Annie's instruction — the true length is ~1,260 words, nearer six. Prayer
  request links to `firebrandrevivalists.com/#contact`. Ends with
  `waymaker-angel.jpg` and the note that it is an AI depiction, ~85% accurate
  to what Shannon saw.

### Images must be pushed before sending

Email images load from `https://shannonsuttles.com/brand/email/…`, served out
of `public/brand/email/`. Nothing on the site links to that folder — it is
purely a storage shelf with public addresses. **A new image is a 404 until
`git add . && git commit && git push` has run and Netlify has rebuilt.** This
has caused a broken image twice. Always open the image's URL in a browser
before sending.

When replacing an image, **change the filename** (`-v2`, `-v3`). Browsers and
the CDN serve the cached old file otherwise.

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
