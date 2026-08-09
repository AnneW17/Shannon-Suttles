/**
 * SITE CONSTANTS
 *
 * Navigation, organisations, and giving destinations.
 *
 * Every url below was supplied by Shannon's team. None are inferred, and
 * none should be edited without confirming the destination is correct — a
 * giving link pointing at the wrong place is the most damaging possible bug
 * on this site.
 */

export const SITE = {
  name: 'Shannon Suttles',
  tagline: 'Poetry · Testimony · Living Legacy',
  description:
    'The poetry of Shannon Suttles — prayers, remembrances, laments, and honest conversations with God.',
  email: 'info@firebrandrevivalists.com',
  url: import.meta.env.PUBLIC_SITE_URL || 'https://shannonsuttles.com',
} as const;

export const NAV = [
  { label: 'Poetry', href: '/poetry' },
  { label: 'About', href: '/about' },
  { label: 'Her Work', href: '/work' },
  { label: 'Support', href: '/support' },
  { label: 'Contact', href: '/contact' },
] as const;

/**
 * ORGANISATIONS
 *
 * Presented as typographic entries rather than a logo grid. The five marks
 * share no palette — black-and-gold, teal-and-gold, purple-and-silver, and a
 * bright rainbow — so a row of them on cream reads as a sponsor wall and
 * pulls attention away from the poetry. Each gets its own block instead,
 * with its logo given room to sit on its own.
 */
export interface Organisation {
  name: string;
  descriptor?: string;
  role?: string;
  body: string;
  href: string;
  logo?: string;
  /** Marks are supplied as transparent WebP, so they sit on the ink ground
   *  directly. Kept for the few places that still want an explicit plate. */
  logoOnDark?: boolean;
  /** 'light' puts the mark on a cream medallion — used for navy, purple and
   *  deep-blue artwork that would otherwise vanish on black. */
  markTone?: 'dark' | 'light';
}

export const ORGANISATIONS: Organisation[] = [
  {
    name: 'Sophion Media & Consulting Group',
    role: 'President and Founder',
    body: 'Grew from years of responsibility and complex leadership. It brings together the leadership team’s collective discernment, strategic insight, and operational wisdom to help organisations find clarity and become healthy.',
    href: 'https://sophionhq.com/',
    logo: '/brand/orgs/sophion-onink.webp',
    logoOnDark: true,
  },
  {
    name: 'Jesus Loves the Little Children Chaplaincy',
    descriptor: 'School Chaplains',
    role: 'President',
    body: 'Grew from a burden for children, and from knowing what it means for a child to need safety, healing, and the faithful presence of someone who sees beyond outward behaviour to the heart beneath it.',
    href: 'https://www.firebrandrevivalists.com/jllc',
    logo: '/brand/orgs/jllc-onink.webp',
    markTone: 'light',
  },
  {
    name: 'Generational Legacy Foundation',
    descriptor: 'Protecting Children. Restoring Families. Rebuilding Generations.',
    role: 'President',
    body: 'Born from Shannon’s own experiences with adoption, family separation, custody struggles, and miraculous restoration — created to help remove financial barriers between children and safe, loving families.',
    href: 'https://www.thegenerationallegacy.org/',
    logo: '/brand/orgs/generational-legacy-onink.webp',
    markTone: 'light',
  },
  {
    name: 'Ember Ridge',
    descriptor: 'A house that ministers first to the Lord.',
    role: 'President',
    body: 'Being formed first as a house of worship and prayer — a place set apart for the Lord, where ministers and leaders who have grown weary can rest, be restored, and return strengthened to the assignments He has given them.',
    href: 'https://www.theemberridge.com/',
    logo: '/brand/orgs/ember-ridge.png',
    logoOnDark: true,
  },
  {
    name: 'Firebrand Revivalists',
    descriptor: 'Igniting Hearts. Awakening Destiny. Reviving Glory.',
    role: 'President and CEO',
    body: 'The ministry through which much of this work is carried, and to which all contributions are made.',
    href: 'https://www.firebrandrevivalists.com/',
    logo: '/brand/orgs/firebrand-onink.webp',
    logoOnDark: true,
  },
  {
    name: 'Nehemiah Alliance',
    descriptor: '52-Day National Rebuild Initiative · Rebuild. Restore. Renew.',
    role: 'National Leader',
    body: 'Shannon serves as a national leader with the Nehemiah Alliance and its 52-Day National Rebuild Initiative.',
    href: 'https://na52.org/',
    logo: '/brand/orgs/nehemiah.png',
    markTone: 'light',
  },
];

/**
 * GIVING
 *
 * All contributions go to Firebrand Revivalists. Zelle has no web link by
 * design — it is used inside a person's own banking app — so it carries
 * instructions instead of a url.
 */
export interface GivingOption {
  name: string;
  handle?: string;
  href?: string;
  note?: string;
}

export const GIVING: GivingOption[] = [
  {
    name: 'PayPal',
    href: 'https://www.paypal.com/biz/profile/firebrandrevivalists',
  },
  {
    name: 'Venmo',
    handle: '@Firebrand45',
    href: 'https://venmo.com/u/Firebrand45',
  },
  {
    name: 'Cash App',
    handle: '$firebrand45',
    href: 'https://cash.app/$firebrand45',
  },
  {
    name: 'Givelify',
    href: 'https://www.givelify.com/donate/firebrand-revivalists-randolph-nj-2j7wy5NjE2MjQ=/donation/amount',
    note: 'Givelify deducts a processing fee from each contribution.',
  },
  {
    name: 'Zelle',
    handle: 'Firebrand Revivalists',
    note: 'Send through your own banking app. Please list your email in the memo line.',
  },
];

/**
 * Legal disclosure for the Support page.
 *
 * NOTE FOR REVIEW — the sentence supplied began "An auxiliary ministry of
 * Firebrand Revivalists™…", which describes a ministry *under* Firebrand
 * rather than Firebrand itself, and so could not be correct as a disclosure
 * for gifts made *to* Firebrand. The opening clause has been dropped and
 * nothing else altered. Confirm with Shannon's team before launch.
 */
export const GIVING_DISCLOSURE =
  'All contributions are made to Firebrand Revivalists™, a Washington nonprofit corporation organized and operated as a church within Section 501(c)(3) of the Internal Revenue Code and exempt from the notice and application requirement under Section 508(c)(1)(A).';

export const CATEGORY_FALLBACKS = [
  {
    title: 'Prayers and Surrender',
    description:
      'Written from places of prayer, consecration, waiting, and learning to trust God with what cannot be controlled.',
  },
  {
    title: 'Restoration and Family',
    description:
      'Separation and reunion, motherhood, marriage, forgiveness, belonging, and the God who gathers what appeared permanently scattered.',
  },
  {
    title: 'Fire and Remembrance',
    description:
      'For the weary, the wounded, and those who wonder whether anything living remains beneath the ashes.',
  },
];
