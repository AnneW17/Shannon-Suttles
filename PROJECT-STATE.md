# shannonsuttles.com — where things stand

Written 28 September 2026. Hand this to a new chat as the starting point.

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

**Buttondown**, username **`AWHALEY17`** (capitalised; lowercase redirects).
Free tier, 100 subscribers.

Signup posts straight to
`https://buttondown.com/api/emails/embed-subscribe/AWHALEY17` as a real HTML
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
