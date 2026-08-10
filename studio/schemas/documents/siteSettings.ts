import { defineField, defineType } from 'sanity';

/**
 * SETTINGS
 *
 * A single document — there is never more than one. Holds the things Shannon
 * may want to change once in a while without touching code: her signature
 * image, the default social sharing image, and site-wide SEO defaults.
 */
export default defineType({
  name: 'siteSettings',
  title: 'Settings',
  type: 'document',

  groups: [
    { name: 'signature', title: 'Signature', default: true },
    { name: 'seo', title: 'Search & sharing' },
  ],

  fields: [
    defineField({
      name: 'signatureImage',
      title: 'Your signature',
      type: 'image',
      group: 'signature',
      description:
        'Upload a picture of your signature once, and it can be added to the end of any poem. A PNG with a transparent background works best.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Description',
          type: 'string',
          initialValue: 'Shannon Suttles',
        }),
      ],
    }),

    defineField({
      name: 'signatureFallback',
      title: 'Or type your signature',
      type: 'string',
      group: 'signature',
      initialValue: 'Shannon',
      description:
        'Used if no signature image is uploaded. Appears in an elegant script at the end of the poem.',
    }),

    defineField({
      name: 'defaultSeoTitle',
      title: 'Default page title',
      type: 'string',
      group: 'seo',
      initialValue: 'Shannon Suttles',
    }),

    defineField({
      name: 'defaultSeoDescription',
      title: 'Default description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Used for pages that do not have their own description.',
    }),

    defineField({
      name: 'defaultShareImage',
      title: 'Default sharing image',
      type: 'image',
      group: 'seo',
      description:
        'Shown when a link to the site is shared on social media or in a message. Used when a poem has no image of its own.',
    }),
  ],

  preview: {
    prepare: () => ({ title: 'Settings' }),
  },
});
