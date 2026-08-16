import { createClient, type SanityClient } from '@sanity/client';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || '2024-10-01';

/**
 * A missing project id is the single most likely setup mistake, and the
 * default Sanity error for it is cryptic. Fail loudly and in plain language.
 */
if (!projectId) {
  throw new Error(
    [
      '',
      'Sanity is not configured yet.',
      '',
      'PUBLIC_SANITY_PROJECT_ID is missing. To fix this:',
      '  1. Copy .env.example to .env',
      '  2. Add your Sanity project ID (find it at sanity.io/manage)',
      '  3. Restart the dev server',
      '',
      'If you are deploying, add the same variable in',
      'Netlify -> Site configuration -> Environment variables.',
      '',
    ].join('\n')
  );
}

/**
 * Public, read-only client. Used for every published page.
 * `useCdn` is on: pages are built ahead of time, so the cached CDN response
 * is both correct and considerably faster.
 */
export const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
});

/**
 * Preview client. Reads unpublished drafts, so it requires a token and must
 * only ever run on the server. Returns null when no token is configured,
 * which cleanly disables the preview route rather than crashing the build.
 */
export function getPreviewClient(): SanityClient | null {
  const token = import.meta.env.SANITY_VIEWER_TOKEN;
  if (!token) return null;

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: 'drafts',
    token,
  });
}
