import type { PortableTextBlock } from '@portabletext/to-html';

export interface SanityImage {
  asset?: { _ref: string; _type: 'reference' };
  alt?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface Category {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  order?: number;
  poemCount?: number;
}

/**
 * Words and prayers share one shape and one editor; `kind` is what separates
 * them into two pages. Entries published before the field existed have no
 * value stored, so the queries coalesce those to 'word' — the type is
 * therefore required here even though Sanity may not hold it.
 */
export type PoemKind = 'word' | 'prayer';

export interface Poem {
  _id: string;
  kind: PoemKind;
  title: string;
  slug: string;
  body: PortableTextBlock[];
  excerpt?: string;
  featureImage?: SanityImage;
  category?: Pick<Category, 'title' | 'slug'>;
  tags?: string[];
  publishedAt: string;
  featured?: boolean;
  showSignature?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

/** Lightweight shape used by archive lists and related-poem rows. */
export type PoemCard = Pick<
  Poem,
  | '_id'
  | 'kind'
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'publishedAt'
  | 'featureImage'
  | 'category'
  | 'tags'
>;

export interface SiteSettings {
  signatureImage?: SanityImage;
  signatureFallback?: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  defaultShareImage?: SanityImage;
}
