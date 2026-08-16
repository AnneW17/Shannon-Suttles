import poem from './documents/poem';
import category from './documents/category';
import siteSettings from './documents/siteSettings';

/**
 * The content model is deliberately small right now.
 *
 * To add a future content type — essays, reflections, audio readings,
 * books, photography — create a new file in ./documents, import it here,
 * and add it to this array. Nothing else in the CMS needs to change.
 */
export const schemaTypes = [poem, category, siteSettings];
