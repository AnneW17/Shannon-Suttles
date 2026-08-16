import imageUrlBuilder from '@sanity/image-url';
import { client } from './client';
import type { SanityImage } from './types';

const builder = imageUrlBuilder(client);

/**
 * Build a Sanity CDN url. Sanity handles resizing, cropping to the hotspot,
 * and format negotiation, so no image work happens at build time.
 */
export function urlFor(source: SanityImage) {
  return builder.image(source).auto('format').fit('max');
}

/** A single sized url. */
export function imageUrl(source: SanityImage, width: number, height?: number): string {
  let img = builder.image(source).width(width).auto('format');
  if (height) img = img.height(height).fit('crop');
  return img.url();
}

/**
 * Responsive srcset. Widths are chosen to match the real layout breakpoints
 * rather than arbitrary round numbers, so the browser never downloads a
 * substantially larger file than it will actually display.
 */
export function imageSrcSet(
  source: SanityImage,
  widths: number[] = [480, 768, 1024, 1440, 1920]
): string {
  return widths
    .map((w) => `${builder.image(source).width(w).auto('format').url()} ${w}w`)
    .join(', ');
}

/** Social sharing image — Open Graph wants 1200x630. */
export function ogImageUrl(source: SanityImage): string {
  return builder.image(source).width(1200).height(630).fit('crop').auto('format').url();
}

export function hasImage(source?: SanityImage): source is SanityImage {
  return Boolean(source?.asset);
}
