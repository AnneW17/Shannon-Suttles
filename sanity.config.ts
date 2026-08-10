import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID!;
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';
const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:4321';

/**
 * THE WRITING DESK
 *
 * The sidebar shows exactly three things: Poems, Categories, Settings.
 *
 * Sanity's default sidebar lists every content type and exposes internal
 * document ids. That is fine for a developer and bewildering for a writer,
 * so the structure below is defined explicitly. Anything Shannon does not
 * need to see is not there.
 */
export default defineConfig({
  name: 'shannon-suttles',
  title: 'Shannon Suttles',

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Poems')
              .schemaType('poem')
              .child(
                S.documentTypeList('poem')
                  .title('Poems')
                  .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
              ),

            S.divider(),

            S.listItem()
              .title('Categories')
              .schemaType('category')
              .child(
                S.documentTypeList('category')
                  .title('Categories')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),

            S.divider(),

            // Settings is a singleton — one document, no "create new" button.
            S.listItem()
              .title('Settings')
              .schemaType('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Settings')
              ),
          ]),
    }),

    // Vision is a developer query tool. It is intentionally excluded from the
    // production Studio so it never appears in Shannon's sidebar.
    ...(process.env.NODE_ENV === 'development' ? [visionTool()] : []),
  ],

  schema: {
    types: schemaTypes,
    // Prevent "Settings" from being creatable more than once.
    templates: (templates) => templates.filter((t) => t.schemaType !== 'siteSettings'),
  },

  document: {
    // The "Preview" link that appears on a poem while editing.
    productionUrl: async (prev, context) => {
      const { document } = context;
      if (document._type !== 'poem') return prev;
      const slug = (document as { slug?: { current?: string } }).slug?.current;
      if (!slug) return prev;
      return `${previewUrl}/preview/${slug}`;
    },

    // Remove "Settings" from the global "new document" menu.
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter((item) => item.templateId !== 'siteSettings');
      }
      return prev;
    },
  },
});
