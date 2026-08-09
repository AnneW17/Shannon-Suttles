# Shannon Suttles

A luxury literary website and private poetry archive, built so that Shannon can write and publish independently — from her phone, without touching code.

**Two audiences, two experiences.** Visitors get a fast, quiet, editorial reading site. Shannon gets a writing desk. Neither ever needs to know the other exists.

---

## Table of contents

**For Shannon**
- [How to publish a poem](#how-to-publish-a-poem)
- [Setting up your signature](#setting-up-your-signature)
- [Questions you might have](#questions-you-might-have)

**For whoever sets this up (once)**
- [Part 1 — Create the Sanity project](#part-1--create-the-sanity-project)
- [Part 2 — Run the site locally](#part-2--run-the-site-locally)
- [Part 3 — Add the first content](#part-3--add-the-first-content)
- [Part 4 — Put it on GitHub](#part-4--put-it-on-github)
- [Part 5 — Deploy to Netlify](#part-5--deploy-to-netlify)
- [Part 6 — Automatic publishing (the important one)](#part-6--automatic-publishing-the-important-one)
- [Part 7 — Give Shannon her Studio](#part-7--give-shannon-her-studio)
- [Part 8 — Draft preview (optional)](#part-8--draft-preview-optional)

**Reference**
- [How it all fits together](#how-it-all-fits-together)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [Design notes](#design-notes)
- [Adding new content types later](#adding-new-content-types-later)
- [Before launch](#before-launch)
- [Troubleshooting](#troubleshooting)

---

# For Shannon

## How to publish a poem

You will do this from **your Studio** — a private writing app at your own web address. Bookmark it on your phone's home screen and it behaves like any other app.

1. **Open your Studio** and sign in.
2. Tap **Poems**, then the **+** button.
3. **Title** — type the name of the poem.
4. **The poem** — write it, or paste it in.
   - **Enter** starts a new line.
   - **Enter twice** leaves a blank line between stanzas.
   - Your line breaks and spacing appear on the website exactly as you type them.
   - To italicise a word, select it and tap the *italic* button.
5. **Short introduction** *(optional)* — a line or two shown beneath the title on the poetry page. Leave it blank and the opening of the poem is used instead.
6. Tap the **Details** tab:
   - **Web address** — tap *Generate*. Created from your title automatically.
   - **Date** — today by default.
   - **Category** — Prayers and Surrender, Restoration and Family, or Fire and Remembrance.
   - **Tags** *(optional)* — type a word, press Enter.
   - **Image** *(optional)* — upload, then drag the circle to choose what stays visible when it is cropped. Please add a short description so the poem is accessible to readers using a screen reader.
   - **Feature on home page** — turn on to give this poem the front page.
   - **Sign this poem** — on by default.
7. **Sharing** tab *(optional)* — a different title or description for Google. Leave blank to use the poem's own.
8. Everything is **saved automatically as a draft** as you type. Nothing is public yet.
9. Tap **Preview** to see exactly how it will look. Only you can see this.
10. When you are ready, tap **Publish**.

The website updates itself within a couple of minutes. You do not need to tell anyone.

### Changing a poem after publishing

Open it, make your changes, tap **Publish** again. To take a poem down, open it and choose **Unpublish** — it returns to being a draft and disappears from the website, but is never deleted.

---

## Setting up your signature

Do this once.

1. Sign your name on white paper in dark ink. Photograph it straight on in good light.
2. Ideally, have the background removed so it is a PNG with nothing behind it.
3. In your Studio, open **Settings → Signature** and upload it.

Every poem with **Sign this poem** turned on now ends with your signature. If you never upload one, the word *Shannon* appears in an elegant italic instead — so nothing looks broken in the meantime.

---

## Questions you might have

**Do I need a computer?** No. Everything works on a phone.

**Will I lose work if I close the app?** No. Drafts save as you type.

**Can I schedule a poem?** Yes — set the date to the future and publish. It appears on the website on that date.

**What if I publish something by accident?** Open it and choose **Unpublish**. It comes off the website immediately and stays safe as a draft.

**Do I have to add a category, image, or tags?** No. Only a title and the poem itself are required.

**Can I add a new category?** Yes — **Categories → +**. No developer needed.

---

# Setup

Do this once. Roughly 45 minutes. You need [Node.js 22+](https://nodejs.org) and a free [Sanity](https://sanity.io) account.

## Part 1 — Create the Sanity project

Sanity is where the poems actually live.

```bash
cd studio
npm install
npx sanity login          # choose Google, GitHub, or email
npx sanity init
```

When `init` asks:

| Question | Answer |
|---|---|
| Create new project? | **Yes** |
| Project name | `Shannon Suttles` |
| Use the default dataset configuration? | **Yes** (creates `production`) |
| Output path / add schema? | Accept defaults — the schemas already exist |

**Write down the project ID it prints.** It looks like `a1b2c3d4`. You need it twice.

> Already have it? It is always visible at [sanity.io/manage](https://sanity.io/manage).

Now create the two env files:

```bash
# in studio/
cp .env.example .env
# edit .env and set SANITY_STUDIO_PROJECT_ID
```

```bash
# in the project root
cd ..
cp .env.example .env
# edit .env and set PUBLIC_SANITY_PROJECT_ID to the same value
```

## Part 2 — Run the site locally

Two terminal windows.

**Terminal 1 — the Studio (Shannon's writing desk):**

```bash
cd studio
npm run dev
# → http://localhost:3333
```

**Terminal 2 — the website:**

```bash
npm install
npm run dev
# → http://localhost:4321
```

The website will be empty until there is content. That is expected.

## Part 3 — Add the first content

In the Studio at `localhost:3333`:

**Categories** — create the three Shannon defined:

| Name | Position | Description |
|---|---|---|
| Prayers and Surrender | 1 | Written from places of prayer, consecration, waiting, and learning to trust God with what cannot be controlled. |
| Restoration and Family | 2 | Separation and reunion, motherhood, marriage, forgiveness, belonging, and the God who gathers what appeared permanently scattered. |
| Fire and Remembrance | 3 | For the weary, the wounded, and those who wonder whether anything living remains beneath the ashes. |

**Settings** — open it once and upload the signature (or leave it; a text fallback is used).

**The first poem** — *All of It, Back to You*. Paste it in, set the category to **Prayers and Surrender**, turn on **Feature on home page**, and publish.

Restart `npm run dev` and the site has content.

## Part 4 — Put it on GitHub

```bash
git init
git add .
git commit -m "Shannon Suttles website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/shannon-suttles.git
git push -u origin main
```

`.env` is already in `.gitignore` and will not be uploaded. Confirm with `git status` before pushing — a committed token is a real problem.

## Part 5 — Deploy to Netlify

1. [netlify.com](https://netlify.com) → **Add new site → Import an existing project**
2. Choose GitHub, then this repository
3. Build settings are read from `netlify.toml`; confirm they show:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Before the first deploy, open **Site configuration → Environment variables** and add:

   | Key | Value |
   |---|---|
   | `PUBLIC_SANITY_PROJECT_ID` | your project ID |
   | `PUBLIC_SANITY_DATASET` | `production` |
   | `PUBLIC_SANITY_API_VERSION` | `2024-10-01` |
   | `PUBLIC_SITE_URL` | `https://shannonsuttles.com` |

5. **Deploy**.
6. Add the custom domain under **Domain management**. Netlify provisions HTTPS automatically.

### Tell Sanity the site is allowed to read

In [sanity.io/manage](https://sanity.io/manage) → your project → **API → CORS origins**, add:

- `https://shannonsuttles.com`
- your `*.netlify.app` address
- `http://localhost:4321`

Leave *Allow credentials* **off**. The website only ever reads published content.

## Part 6 — Automatic publishing (the important one)

Without this step, Shannon publishes a poem and nothing happens. This is what makes the whole thing work.

**In Netlify:** **Site configuration → Build & deploy → Build hooks → Add build hook**
- Name: `Sanity publish`
- Branch: `main`
- Copy the URL it gives you.

**In Sanity:** [sanity.io/manage](https://sanity.io/manage) → your project → **API → Webhooks → Create webhook**

| Field | Value |
|---|---|
| Name | `Rebuild website` |
| URL | the Netlify build hook URL |
| Dataset | `production` |
| Trigger on | **Create**, **Update**, **Delete** |
| Filter | `_type == "poem" \|\| _type == "category" \|\| _type == "siteSettings"` |
| HTTP method | `POST` |
| API version | `v2021-03-25` |

**Test it end to end.** Publish a poem in the Studio, watch a deploy start in Netlify, and confirm the poem appears on the live site a minute or two later. Do not consider setup finished until you have seen this happen.

## Part 7 — Give Shannon her Studio

```bash
cd studio
npm run deploy
```

Choose a hostname — `shannonsuttles` gives her **https://shannonsuttles.sanity.studio**.

Then in [sanity.io/manage](https://sanity.io/manage) → **Members → Invite**, add Shannon as an **Administrator**.

Send her the link and tell her to add it to her phone's home screen: in Safari, **Share → Add to Home Screen**. It then opens like an app.

## Part 8 — Draft preview (optional)

Lets Shannon see an unpublished poem before anyone else can. The site works fine without it.

1. [sanity.io/manage](https://sanity.io/manage) → **API → Tokens → Add token**
2. Name `Preview`, permission **Viewer** (read-only — never Editor or Deploy)
3. Add it to Netlify as `SANITY_VIEWER_TOKEN`
4. Add it to your local `.env` too
5. In `studio/.env`, set `SANITY_STUDIO_PREVIEW_URL` to the live site, then redeploy the Studio

A **Preview** link now appears on every poem in the Studio.

> The token is server-side only and never reaches a browser. `/preview/` is blocked in `robots.txt` and carries a `noindex` header.

---

# Reference

## How it all fits together

```
Shannon writes in Sanity Studio  (phone, tablet, or laptop)
            │
            │  taps Publish
            ▼
      Sanity dataset                    ← the content lives here, not in the code
            │
            │  webhook fires
            ▼
    Netlify build hook
            │
            ▼
   Astro fetches poems via GROQ
            │
            ▼
   Static HTML built and deployed
            │
            ▼
        shannonsuttles.com             ← updated, ~1–2 minutes
```

**Poems are never stored in this repository.** Not in Markdown, not in TypeScript, not in a hard-coded array. The code describes how a poem *looks*; Sanity holds what a poem *is*. That separation is why Shannon never needs a developer to publish.

## Environment variables

Copy `.env.example` to `.env`. Never commit `.env`.

| Variable | Required | Purpose |
|---|---|---|
| `PUBLIC_SANITY_PROJECT_ID` | ✅ | Which Sanity project to read |
| `PUBLIC_SANITY_DATASET` | ✅ | Almost always `production` |
| `PUBLIC_SANITY_API_VERSION` | ✅ | Pinned date so Sanity changes cannot alter behaviour |
| `PUBLIC_SITE_URL` | ✅ | Canonical URLs, sitemap, share images |
| `SANITY_VIEWER_TOKEN` | — | Read-only token for draft preview. Server-side only. |

The Studio has its own `studio/.env` with `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, and `SANITY_STUDIO_PREVIEW_URL`.

> `PUBLIC_` variables are visible in the browser — correct here, since the project ID is not a secret and the dataset is read-only. Anything sensitive must never carry that prefix.

## Project structure

```
shannon-suttles/
├── src/
│   ├── components/          Header, Footer, SEO, PoemBody, Signature, ShareControls…
│   ├── layouts/
│   │   └── BaseLayout.astro Shell: fonts, SEO, header, footer, scroll reveals
│   ├── lib/
│   │   ├── sanity/
│   │   │   ├── client.ts    Read client + preview client
│   │   │   ├── queries.ts   Every GROQ query in the project
│   │   │   ├── image.ts     Sanity CDN urls, srcsets, OG images
│   │   │   └── types.ts     TypeScript shapes
│   │   ├── portableText.ts  Poem renderer — preserves line breaks and stanzas
│   │   ├── format.ts        Dates, editorial numbering
│   │   └── site.ts          Navigation, organisations, giving links
│   ├── pages/
│   │   ├── index.astro          Home
│   │   ├── poetry/index.astro   Archive, with search and filters
│   │   ├── poetry/[slug].astro  Individual poem
│   │   ├── preview/[slug].astro Draft preview (not prerendered, noindex)
│   │   ├── about · work · support · contact
│   │   ├── privacy · terms · accessibility
│   │   ├── 404.astro
│   │   └── robots.txt.ts
│   └── styles/global.css    Design tokens, poem rendering, motion
├── studio/                  Sanity Studio — Shannon's writing desk
│   ├── sanity.config.ts     Sidebar structure, preview link
│   └── schemas/
│       ├── documents/poem.ts
│       ├── documents/category.ts
│       └── documents/siteSettings.ts
├── public/brand/            Logo, monogram, portrait, organisation marks
├── astro.config.mjs
├── netlify.toml
└── .env.example
```

### Commands

| Command | Does |
|---|---|
| `npm run dev` | Website at `localhost:4321` |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the built site locally |
| `npm run studio` | Studio at `localhost:3333` |
| `npm run studio:deploy` | Publish the Studio to `*.sanity.studio` |

## Design notes

Things that look like choices, because they were.

**Poems are not prose, and the renderer knows it.** A standard rich-text renderer collapses blank lines and trims whitespace. For poetry that destroys the shape of the poem, which is part of the poem. `src/lib/portableText.ts` preserves empty blocks as stanza breaks and leaves soft line breaks intact; `.poem` in `global.css` renders them with `white-space: pre-wrap` and a hanging indent, so a wrapped long line is always visually distinct from a new line the poet actually wrote.

**The poem is offset left, not centred.** Centred verse forces the eye to hunt for the start of each line. Setting it against a consistent left margin is how poetry is set in print, and it reads considerably better.

**No cards.** No poem sits inside a bordered, rounded, shadowed box. The archive is an index; the poem page gives the poem the page.

**The organisations are typographic, not a logo grid.** The five marks share no palette — black-and-gold, teal-and-gold, purple-and-silver, and a bright rainbow. In a row on cream they read as a sponsor wall. Each gets its own editorial block with its logo given room, and dark-designed logos sit on an ink plate so they are not floating on cream.

**Outlined type appears once per page at most.** It is on the home page headline and nowhere else. Used more often it stops being a device and becomes a texture.

**Motion is CSS and one IntersectionObserver — about 15 lines of JavaScript for the whole site.** No animation library. Content is visible by default and revealed progressively, so a script failure can never hide a poem. `prefers-reduced-motion` switches everything off.

**Giving is never the primary call to action.** There is no floating donate button and no giving section on the home page. It sits in the navigation and the footer, once each. This is a literary site that accepts support, not a donation site with poems.

## Adding new content types later

Essays, reflections, books, audio readings, photography, spoken word — the architecture expects them.

1. Create `studio/schemas/documents/essay.ts` (copy `poem.ts` as a starting point)
2. Import and add it to the array in `studio/schemas/index.ts`
3. Add a `S.listItem()` for it in `studio/sanity.config.ts`
4. Add queries to `src/lib/sanity/queries.ts`
5. Add pages under `src/pages/`

Nothing existing needs to change. The poem schema, queries, and rendering are self-contained.

## Before launch

- [ ] Confirm the **giving disclosure** wording — see the note in `src/lib/site.ts`. The supplied sentence began *"An auxiliary ministry of Firebrand Revivalists™…"*, which describes a ministry *under* Firebrand rather than Firebrand itself, so it could not be correct as a disclosure for gifts made *to* Firebrand. The opening clause was dropped and nothing else altered. **This is tax language and needs a human decision.**
- [ ] **Privacy** and **Terms** pages contain marked placeholders and need real content.
- [ ] Confirm **Anne** is comfortable being named on the About page.
- [ ] Test every giving link goes where it should. Wrong destinations here are the most damaging possible bug.
- [ ] Upload a **signature** image.
- [ ] Higher-resolution **portrait** if one exists — the supplied file is 640×640, which is why it is framed at a controlled size rather than used full-bleed.
- [ ] Publish a poem end to end and confirm the site rebuilds automatically.
- [ ] Check the poem page on a real phone.

## Troubleshooting

**"Sanity is not configured yet"** — `PUBLIC_SANITY_PROJECT_ID` is missing. Locally: check `.env` exists and restart the dev server. On Netlify: add it under Environment variables and redeploy.

**Poems do not appear** — they are published, not drafts; the date is not in the future; the CORS origin is added in Sanity; and for the live site, a rebuild has run since publishing.

**Shannon published but nothing changed** — the build hook. Netlify → Deploys: did one start? If not, the webhook in Sanity is missing or filtered wrong. See [Part 6](#part-6--automatic-publishing-the-important-one).

**Line breaks collapsed** — check the poem was typed with Enter rather than pasted as one block from an app that stripped the formatting. Re-pasting into the Studio usually fixes it.

**Preview says "Nothing to preview"** — `SANITY_VIEWER_TOKEN` is missing, or the poem is already published rather than a draft.

**Build fails on Netlify but works locally** — environment variables are almost always the cause; they do not transfer from `.env` automatically.

---

Built with [Astro](https://astro.build), [Sanity](https://sanity.io), and [Tailwind CSS](https://tailwindcss.com).
