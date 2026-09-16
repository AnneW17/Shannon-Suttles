import { defineField, defineType } from 'sanity';

/**
 * POEM
 *
 * The heart of the site. Every field label and description below is written
 * for Shannon, not for a developer — no schema jargon, no field names leaking
 * into the interface.
 *
 * Fields are split into three tabs so that the first thing she sees on a phone
 * is simply: a title box and a place to write. Everything else is optional and
 * tucked into "Details" and "Sharing".
 */
export default defineType({
  name: 'poem',
  title: 'Word or Prayer',
  type: 'document',

  groups: [
    { name: 'write', title: 'Write', default: true },
    { name: 'details', title: 'Details' },
    { name: 'seo', title: 'Sharing' },
  ],

  fields: [
    // ---------------------------------------------------------------- WRITE
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'write',
      validation: (Rule) => Rule.required().error('Every entry needs a title.'),
    }),

    defineField({
      name: 'body',
      title: 'The words',
      type: 'array',
      group: 'write',
      description:
        'Write or paste the word or prayer here. Press Enter to start a new line. Press Enter twice to leave a blank line between sections. Your line breaks and spacing appear on the website exactly as you type them.',
      of: [
        {
          type: 'block',
          // Poetry does not need headings, lists, or block quotes cluttering
          // the toolbar. Keeping this list short keeps the phone toolbar clean.
          styles: [
            { title: 'Line', value: 'normal' },
            { title: 'Section heading', value: 'h2' },
            { title: 'Indented passage', value: 'blockquote' },
          ],
          lists: [],
          marks: {
            decorators: [
              { title: 'Italic', value: 'em' },
              { title: 'Bold', value: 'strong' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'Web address',
                    validation: (Rule) =>
                      Rule.uri({ scheme: ['http', 'https', 'mailto'] }),
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required().error('This cannot be empty.'),
    }),

    defineField({
      name: 'excerpt',
      title: 'Short introduction',
      type: 'text',
      rows: 3,
      group: 'write',
      description:
        'Optional. One or two lines shown beneath the title in the list and when shared. If you leave this blank, the opening lines are used.',
      validation: (Rule) =>
        Rule.max(280).warning('Shorter reads better here — aim for under 280 characters.'),
    }),

    // -------------------------------------------------------------- DETAILS
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      group: 'details',
      description:
        'This is created automatically from the title. You only need to change it if you want a different web address.',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/['’]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 96),
      },
      validation: (Rule) => Rule.required().error('Press "Generate" to create the web address.'),
    }),

    defineField({
      name: 'publishedAt',
      title: 'Date',
      type: 'datetime',
      group: 'details',
      description: 'The date shown with it. Defaults to today.',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'details',
      description: 'Which part of the collection does this belong to?',
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description:
        'Optional. A few words describing it — prayer, declaration, surrender. Type a word and press Enter.',
    }),

    defineField({
      name: 'featureImage',
      title: 'Image',
      type: 'image',
      group: 'details',
      options: { hotspot: true },
      description:
        'Optional. Appears at the top of the page. After uploading, you can drag the circle to choose which part stays visible when the image is cropped.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Describe this image',
          type: 'string',
          description:
            'A short description for readers using a screen reader. Example: "Morning light across an empty chapel."',
          validation: (Rule) =>
            Rule.custom((alt, context) => {
              const parent = context.parent as { asset?: unknown } | undefined;
              if (parent?.asset && !alt) {
                return 'Please describe the image so it is accessible to everyone.';
              }
              return true;
            }),
        }),
      ],
    }),

    defineField({
      name: 'featured',
      title: 'Feature this poem on the home page',
      type: 'boolean',
      group: 'details',
      initialValue: false,
      description:
        'Only one is featured at a time. Turning this on for a new entry replaces the previous one.',
    }),

    defineField({
      name: 'showSignature',
      title: 'Sign this',
      type: 'boolean',
      group: 'details',
      initialValue: true,
      description:
        'Adds your signature to the end. Your signature is set once under Settings.',
    }),

    // ------------------------------------------------------------------ SEO
    defineField({
      name: 'seoTitle',
      title: 'Title for search engines',
      type: 'string',
      group: 'seo',
      description:
        'Optional. Leave blank to use the title. Around 60 characters works best.',
      validation: (Rule) => Rule.max(70).warning('Longer titles get cut off in search results.'),
    }),

    defineField({
      name: 'seoDescription',
      title: 'Description for search engines',
      type: 'text',
      rows: 2,
      group: 'seo',
      description:
        'Optional. Leave blank to use the short introduction. Around 155 characters works best.',
      validation: (Rule) =>
        Rule.max(165).warning('Longer descriptions get cut off in search results.'),
    }),
  ],

  orderings: [
    {
      title: 'Newest first',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Oldest first',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
    {
      title: 'Title A–Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      date: 'publishedAt',
      media: 'featureImage',
      category: 'category.title',
      featured: 'featured',
    },
    prepare({ title, date, media, category, featured }) {
      const when = date
        ? new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'No date';
      return {
        title: featured ? `★  ${title}` : title,
        subtitle: category ? `${when}  ·  ${category}` : when,
        media,
      };
    },
  },
});
