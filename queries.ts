import groq from 'groq';
import { client, getPreviewClient } from './client';
import type { Poem, PoemCard, Category, SiteSettings } from './types';

/**
 * All GROQ lives here.
 *
 * Queries are never written inline inside components — one place to read,
 * one place to change, and no risk of two pages disagreeing about what
 * "a published poem" means.
 */

/**
 * The definition of "publicly visible".
 *
 * Drafts in Sanity carry an id prefixed with `drafts.`, and a poem dated in
 * the future should not appear early. Both conditions are enforced here so
 * that no page can accidentally leak unpublished work.
 */
const PUBLISHED = groq`
  _type == "poem"
  && !(_id in path("drafts.**"))
  && defined(slug.current)
  && defined(publishedAt)
  && publishedAt <= now()
`;

const CARD_FIELDS = groq`
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  tags,
  featureImage,
  category->{ title, "slug": slug.current }
`;

const FULL_FIELDS = groq`
  ${CARD_FIELDS},
  body,
  featured,
  showSignature,
  seoTitle,
  seoDescription
`;

/* ------------------------------------------------------------------ poems */

export async function getAllPoems(): Promise<PoemCard[]> {
  return client.fetch(
    groq`*[${PUBLISHED}] | order(publishedAt desc) { ${CARD_FIELDS} }`
  );
}

export async function getRecentPoems(limit = 3): Promise<PoemCard[]> {
  return client.fetch(
    groq`*[${PUBLISHED}] | order(publishedAt desc) [0...$limit] { ${CARD_FIELDS} }`,
    { limit }
  );
}

/**
 * The featured poem. If Shannon has not marked one, the most recent poem is
 * used instead — the home page is never empty because of a forgotten toggle.
 */
export async function getFeaturedPoem(): Promise<Poem | null> {
  const featured = await client.fetch<Poem | null>(
    groq`*[${PUBLISHED} && featured == true] | order(publishedAt desc) [0] { ${FULL_FIELDS} }`
  );
  if (featured) return featured;

  return client.fetch<Poem | null>(
    groq`*[${PUBLISHED}] | order(publishedAt desc) [0] { ${FULL_FIELDS} }`
  );
}

export async function getPoemBySlug(slug: string): Promise<Poem | null> {
  return client.fetch(
    groq`*[${PUBLISHED} && slug.current == $slug][0] { ${FULL_FIELDS} }`,
    { slug }
  );
}

/** Every published slug — used to generate the static poem routes. */
export async function getAllPoemSlugs(): Promise<string[]> {
  return client.fetch(groq`*[${PUBLISHED}].slug.current`);
}

/**
 * Related poems: same category first, then filled out with recent poems if
 * the category is thin. Always returns something, never the poem itself.
 */
export async function getRelatedPoems(
  poemId: string,
  categorySlug?: string,
  limit = 3
): Promise<PoemCard[]> {
  const sameCategory = categorySlug
    ? await client.fetch<PoemCard[]>(
        groq`*[${PUBLISHED} && _id != $poemId && category->slug.current == $categorySlug]
             | order(publishedAt desc) [0...$limit] { ${CARD_FIELDS} }`,
        { poemId, categorySlug, limit }
      )
    : [];

  if (sameCategory.length >= limit) return sameCategory;

  const exclude = [poemId, ...sameCategory.map((p) => p._id)];
  const filler = await client.fetch<PoemCard[]>(
    groq`*[${PUBLISHED} && !(_id in $exclude)]
         | order(publishedAt desc) [0...$limit] { ${CARD_FIELDS} }`,
    { exclude, limit: limit - sameCategory.length }
  );

  return [...sameCategory, ...filler].slice(0, limit);
}

/* -------------------------------------------------------------- categories */

export async function getAllCategories(): Promise<Category[]> {
  return client.fetch(
    groq`*[_type == "category"] | order(order asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      order,
      "poemCount": count(*[${PUBLISHED} && references(^._id)])
    }`
  );
}

export async function getPoemsByCategory(categorySlug: string): Promise<PoemCard[]> {
  return client.fetch(
    groq`*[${PUBLISHED} && category->slug.current == $categorySlug]
         | order(publishedAt desc) { ${CARD_FIELDS} }`,
    { categorySlug }
  );
}

/* ---------------------------------------------------------------- settings */

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(
    groq`*[_type == "siteSettings"][0] {
      signatureImage,
      signatureFallback,
      defaultSeoTitle,
      defaultSeoDescription,
      defaultShareImage
    }`
  );
}

/* ----------------------------------------------------------------- preview */

/**
 * Fetch a draft for the private preview route. Returns null when no viewer
 * token is configured, which the preview page renders as a friendly
 * "preview not set up" message rather than an error.
 */
export async function getPoemPreview(slug: string): Promise<Poem | null> {
  const previewClient = getPreviewClient();
  if (!previewClient) return null;

  return previewClient.fetch(
    groq`*[_type == "poem" && slug.current == $slug]
         | order(_updatedAt desc) [0] { ${FULL_FIELDS} }`,
    { slug }
  );
}
