import { defineField, defineType } from 'sanity';

/**
 * CATEGORY
 *
 * Shannon defined three to begin with: Prayers and Surrender,
 * Restoration and Family, Fire and Remembrance. She can add more at any time
 * without a developer — which is the whole point.
 */
export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description:
        'One line describing this part of the collection. Shown on the poetry page beneath the category name.',
    }),
    defineField({
      name: 'order',
      title: 'Position',
      type: 'number',
      description:
        'Controls the order categories appear in. Lower numbers come first.',
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: 'Position', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
});
