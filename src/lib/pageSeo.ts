/**
 * Per-page titles and meta descriptions for every static route, plus the head
 * builders for the two dynamic route patterns.
 *
 * The static table is user-facing copy: the title is the clickable blue line in
 * Google results and the description is the grey text under it. Both are worth
 * writing deliberately — these are first-pass drafts, not final copy.
 *
 * Guidelines: titles under ~60 characters, descriptions 120–155. Anything
 * longer gets truncated with an ellipsis by Google.
 *
 * Everything a route's head needs lives in this module rather than in App.tsx,
 * because two callers need it: the router at runtime, and the prerender plugin
 * in vite.config.ts at build time. A build tool cannot import App.tsx (it pulls
 * in every page component), so anything only reachable from there would silently
 * be missing from the prerendered HTML.
 */
import { products } from '../data/products';
import {
  seo,
  clamp,
  productJsonLd,
  breadcrumbJsonLd,
  type SeoInput,
} from './seo';

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
      'How the Tour Pure system redefines practice - and why Dominus Golf builds training equipment rather than another set of clubs.',
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
      'New to golf? Where to start with swing path, plane, and tempo - and which Dominus Golf training system fits a beginner.',
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
    description: 'Golf professional Leroy Bates - profile and training background.',
  },
  '/gabe-salvanera': {
    title: 'Gabe Salvanera',
    description: 'Golf professional Gabe Salvanera - profile and training background.',
  },

  '/affiliates': {
    title: 'Affiliate Program',
    description:
      'Earn commission promoting Dominus Golf. For coaches, content creators, clubs and academies.',
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
  '/auth/reset-password': {
    title: 'Set a New Password',
    description: 'Choose a new password for your Dominus Golf account.',
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
  '/account/wishlist': {
    title: 'Your Wishlist',
    description: 'Products you have saved at Dominus Golf.',
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
      'Browse every Dominus Golf product - training systems, apparel, and accessories.',
  },
  'training-system': {
    label: 'Golf Training Systems',
    description:
      'Swing training systems from Dominus Golf, built to develop swing path, plane, and tempo.',
  },
  apparel: {
    label: 'Golf Apparel',
    description: 'Dominus Golf apparel - on and off the course.',
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

// ── Dynamic routes ─────────────────────────────────────────────────────────
// These take the route param rather than a router context, so the prerender
// plugin can call them with a plain string.

/** Head for `/shop/$category`. Unknown categories get generic but valid meta. */
export function shopCategoryHead(category: string) {
  const meta = (SHOP_CATEGORIES as Record<string, { label: string; description: string }>)[
    category
  ];

  return seo({
    path: `/shop/${category}`,
    title: meta?.label ?? 'Shop',
    description:
      meta?.description ?? 'Browse golf training systems, apparel, and accessories.',
    jsonLd: [
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: meta?.label ?? 'Shop', path: `/shop/${category}` },
      ]),
    ],
  });
}

/** Head for `/product/$id`, including Product and BreadcrumbList JSON-LD. */
export function productHead(id: string) {
  const product = products.find((p) => p.id === id);

  // An unknown id renders the not-found path — give it a title but keep it out
  // of the index rather than emitting Product schema for nothing.
  if (!product) {
    return seo({
      path: `/product/${id}`,
      title: 'Product Not Found',
      description: 'This product could not be found.',
      noindex: true,
    });
  }

  return seo({
    path: `/product/${product.id}`,
    title: product.name,
    // The product's own opening paragraph, clipped — better than a generic
    // template line, and it is copy that was already written deliberately.
    description: clamp(product.description.split('\n\n')[0]),
    // JPEG twin, not the .webp catalog image — see SITE.ogImage.
    image: `/images/og/${product.id}.jpg`,
    type: 'product',
    jsonLd: [
      productJsonLd(product),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop/all' },
        { name: product.name, path: `/product/${product.id}` },
      ]),
    ],
  });
}

/**
 * Every URL the prerender plugin should emit static HTML for: the static table,
 * one page per shop category, and one per product.
 *
 * Deliberately includes the `noindex` pages. They cost a couple of KB each and
 * baking their `robots` tag into the HTML means a crawler sees it without having
 * to run JavaScript — which is the whole point of prerendering.
 */
export function prerenderRoutes(): Array<{ path: string; head: ReturnType<typeof seo> }> {
  const routes: Array<{ path: string; head: ReturnType<typeof seo> }> = [];

  for (const [path, meta] of Object.entries(PAGE_SEO)) {
    routes.push({ path, head: seo({ path, ...(meta as PageSeo) }) });
  }
  for (const category of Object.keys(SHOP_CATEGORIES)) {
    routes.push({ path: `/shop/${category}`, head: shopCategoryHead(category) });
  }
  for (const product of products) {
    routes.push({ path: `/product/${product.id}`, head: productHead(product.id) });
  }

  return routes;
}
