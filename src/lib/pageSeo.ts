/**
 * Per-page titles and meta descriptions for every static route.
 *
 * This is user-facing copy: the title is the clickable blue line in Google
 * results and the description is the grey text under it. Both are worth
 * writing deliberately — these are first-pass drafts, not final copy.
 *
 * Guidelines: titles under ~60 characters, descriptions 120–155. Anything
 * longer gets truncated with an ellipsis by Google.
 *
 * Dynamic routes (/product/$id, /shop/$category) build their head in App.tsx
 * from live catalog data instead.
 */
import { seo, type SeoInput } from './seo';

type PageSeo = Omit<SeoInput, 'path'>;

export const PAGE_SEO = {
  '/': {
    // No title — the home page uses the sitewide default from seo().
    description:
      'Golf training systems, apparel, and accessories from Dominus Golf. Train swing path and plane with equipment built for a repeatable swing.',
  },

  '/about': {
    title: 'About Dominus Golf',
    description:
      'How the Tour Pure system redefines practice — and why Dominus Golf builds training equipment rather than another set of clubs.',
  },
  '/about/team': {
    title: 'Our Team',
    description: 'Meet the team behind Dominus Golf training systems.',
  },
  '/about/contact': {
    title: 'Contact Us',
    description:
      'Get in touch with the Dominus Golf team about orders, products, or the Development Grant.',
  },
  '/about/careers': {
    title: 'Careers',
    description: 'Open roles and opportunities to work with Dominus Golf.',
  },
  '/about/sustainability': {
    title: 'Sustainability',
    description:
      "Our approach to materials, manufacturing, and packaging across the Dominus Golf range.",
  },

  '/beginners': {
    title: 'Golf Training for Beginners',
    description:
      'New to golf? Where to start with swing path, plane, and tempo — and which Dominus Golf training system fits a beginner.',
  },
  '/tour-pure-guide': {
    title: 'Tour Pure Training Guide',
    description:
      'How to train with the Tour Pure system: drills, rep counts, and building a repeatable swing path.',
  },
  '/feel-right-band-guide': {
    title: 'Feel Rite Band Guide',
    description:
      'How to use the Feel Rite Band to build tempo, sequencing, and connection through the golf swing.',
  },

  '/grant': {
    title: 'Development Grant Application',
    description:
      'Apply for the Dominus Golf Development Grant. Every applicant receives The Ultimate Guide to Master the Game.',
  },
  '/grant/success': {
    title: 'Application Received',
    description: 'Your Dominus Golf Development Grant application has been received.',
    // A post-payment confirmation page has no search value and should never
    // appear in results ahead of the application page itself.
    noindex: true,
  },

  '/pros': {
    title: 'Practice With Pros',
    description:
      'Train alongside the golf professionals who partner with Dominus Golf.',
  },
  '/leroy-bates': {
    title: 'Leroy Bates',
    description: 'Golf professional Leroy Bates — profile and training background.',
  },
  '/gabe-salvanera': {
    title: 'Gabe Salvanera',
    description: 'Golf professional Gabe Salvanera — profile and training background.',
  },

  '/shipping-policy': {
    title: 'Shipping Policy',
    description: 'Shipping timelines, rates, and delivery information for Dominus Golf orders.',
  },
  '/terms': {
    title: 'Terms & Conditions',
    description: 'Terms and conditions for purchases and use of the Dominus Golf website.',
  },
  '/safety-disclaimer': {
    title: 'Safety Disclaimer',
    description:
      'Important safety information for training with Dominus Golf equipment.',
  },

  // ── Private / utility pages: valid meta, but kept out of the index ────────
  '/wishlist': {
    title: 'Your Wishlist',
    description: 'Products you have saved at Dominus Golf.',
    noindex: true,
  },
  '/login': {
    title: 'Sign In',
    description: 'Sign in to your Dominus Golf account.',
    noindex: true,
  },
  '/auth/confirmed': {
    title: 'Email Confirmed',
    description: 'Your Dominus Golf email address has been confirmed.',
    noindex: true,
  },
  '/signup': {
    title: 'Create an Account',
    description: 'Create a Dominus Golf account to track orders and save products.',
    noindex: true,
  },
  '/account': {
    title: 'Your Profile',
    description: 'Manage your Dominus Golf profile.',
    noindex: true,
  },
  '/account/orders': {
    title: 'Your Orders',
    description: 'Your Dominus Golf purchase history.',
    noindex: true,
  },
  '/account/addresses': {
    title: 'Your Addresses',
    description: 'Manage your saved shipping addresses.',
    noindex: true,
  },
  '/account/preferences': {
    title: 'Your Preferences',
    description: 'Manage your email and account preferences.',
    noindex: true,
  },
} satisfies Record<string, PageSeo>;

/**
 * Titles and descriptions for the /shop/$category routes. Kept here (rather
 * than in App.tsx) so the sitemap generator in vite.config.ts can enumerate the
 * category pages without importing the router.
 */
export const SHOP_CATEGORIES = {
  all: {
    label: 'Shop All',
    description:
      'Browse every Dominus Golf product — training systems, apparel, and accessories.',
  },
  'training-system': {
    label: 'Golf Training Systems',
    description:
      'Swing training systems from Dominus Golf, built to develop swing path, plane, and tempo.',
  },
  apparel: {
    label: 'Golf Apparel',
    description: 'Dominus Golf apparel — on and off the course.',
  },
  accessories: {
    label: 'Golf Accessories',
    description: 'Golf accessories and training add-ons from Dominus Golf.',
  },
  'mens-gear': {
    label: "Men's Golf Gear",
    description: "Men's golf training gear and apparel from Dominus Golf.",
  },
  'womens-gear': {
    label: "Women's Golf Gear",
    description: "Women's golf training gear and apparel from Dominus Golf.",
  },
} satisfies Record<string, { label: string; description: string }>;

export type StaticPath = keyof typeof PAGE_SEO;

/** Build a route `head()` for a static path from the table above. */
export function pageHead(path: StaticPath) {
  return () => seo({ path, ...PAGE_SEO[path] });
}
