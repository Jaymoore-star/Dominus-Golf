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
import { products, productsInShopCategory } from '../data/products';
import { trainingSystems } from '../data/products/trainingSystems';
import { apparel } from '../data/products/apparel';
import { accessories } from '../data/products/accessories';
import { REVIEW_SUMMARIES } from '../data/reviewSummaries.generated';
import {
  seo,
  clamp,
  productJsonLd,
  breadcrumbJsonLd,
  organizationJsonLd,
  websiteJsonLd,
  itemListJsonLd,
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
    description:
      'The coaches, players and builders behind Dominus Golf training systems, and why the company builds practice equipment rather than clubs.',
  },
  '/about/contact': {
    title: 'Contact Us',
    description:
      'Contact the Dominus Golf team about an order, a product question, shipping, returns or a partnership enquiry. Send a message and we will reply.',
  },
  '/about/careers': {
    title: 'Careers',
    description:
      'Open roles at Dominus Golf. We hire for product, content and community across golf training and direct-to-consumer retail.',
  },
  '/about/sustainability': {
    title: 'Sustainability',
    description:
      'How Dominus Golf approaches materials, manufacturing and packaging across the range, and what we are still working to improve.',
  },

  '/beginners': {
    title: 'Golf Training Aids for Beginners',
    description:
      'New to golf? What to practise first, how to build a swing that repeats, and which training aid actually helps a beginner improve.',
  },
  '/tour-pure-guide': {
    title: 'Golf Swing Path Drills - Tour Pure Guide',
    description:
      'How to fix an over-the-top swing and train a repeatable path. Drills, rep counts and a practice structure using the Tour Pure trainer.',
  },
  '/feel-right-band-guide': {
    title: 'Golf Tempo and Connection Drills - Band Guide',
    description:
      'Drills for golf tempo, sequencing and arm connection through the swing, using a connection band. Includes the tour floatie drill.',
  },

  /* Unpublished pending legal review (2026-08-31). Removing the entry is what
     takes the URL out of sitemap.xml and out of the prerendered HTML, since
     both are generated from this table.
  '/dominus-her': {
    title: 'DOMINUS HER',
    description:
      "DOMINUS HER is the national women's golf and leadership initiative - a six-stage pathway from her first swing to the boardroom, plus the women's range.",
  },
  */

  /* Unpublished (2026-09-02). Removing the entry is what takes the URL out of
     sitemap.xml and out of the prerendered HTML, since both are generated from
     this table. The '/grant/success' entry below stays: that route is still
     live for anyone returning from a Square payment, and it is noindex.
  '/grant': {
    title: 'Development Grant Application',
    description:
      'Apply for the Dominus Golf Development Grant. Every applicant receives The Ultimate Guide to Master the Game.',
  },
  */
  '/grant/success': {
    title: 'Application Received',
    description: 'Your Dominus Golf Development Grant application has been received.',
    // A post-payment confirmation page has no search value and should never
    // appear in results ahead of the application page itself.
    noindex: true,
  },

  '/checkout/success': {
    title: 'Order Confirmed',
    description: 'Your Dominus Golf order has been placed.',
    // Same reasoning as /grant/success — reachable only by paying, useless in
    // search results, and it would leak an order reference into the index.
    noindex: true,
  },

  '/pros': {
    title: 'Practice With Golf Professionals',
    description:
      'Train alongside the golf professionals who partner with Dominus Golf. Browse coach profiles and book a session with one near you.',
  },
  '/leroy-bates': {
    title: 'Leroy Bates - Golf Professional',
    description:
      'Golf professional Leroy Bates: credentials, technical expertise and instructional philosophy. Book a coaching appointment through Dominus Golf.',
  },
  '/gabe-salvanera': {
    title: 'Gabe Salvanera - Golf Professional',
    description:
      'Golf professional Gabe Salvanera: credentials, tour experience and instructional philosophy. Book a session through Dominus Golf.',
  },

  '/affiliates': {
    title: 'Affiliate Program',
    description:
      'Earn commission promoting Dominus Golf training systems. Built for coaches, content creators, clubs and academies with a golf audience.',
  },

  '/shipping-policy': {
    title: 'Shipping Policy',
    description:
      'Shipping rates, handling and delivery times for Dominus Golf orders. Free US shipping over $150, a flat $6.99 below it, 30-day returns.',
  },
  '/terms': {
    title: 'Terms & Conditions',
    description:
      'Terms and conditions for purchases from Dominus Golf and use of this website, covering orders, payment, delivery, returns and liability.',
  },
  '/safety-disclaimer': {
    title: 'Safety Disclaimer',
    description:
      'Safety guidance for training with Dominus Golf equipment. Read this before using a weighted swing trainer or a resistance band.',
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
 * The /shop/$category routes. Kept here (rather than in App.tsx) so the sitemap
 * generator in vite.config.ts can enumerate the category pages without
 * importing the router.
 *
 * **This is the single source of truth for category naming.** ShopPage.tsx used
 * to keep its own `categoryLabels` table for the sidebar and the on-page
 * heading, and the two had already drifted: this file said "Golf Training
 * Systems" while the page heading said "Training Systems", and "Golf Apparel"
 * against "Dominus Golf Apparel". The same mistake `productsInShopCategory()`
 * exists to prevent — the page and its own schema disagreeing about itself.
 *
 * Two names per category, because the three places one is read want different
 * lengths:
 *
 * - `label` — short. The sidebar nav and the breadcrumb, where a long string
 *   wraps and reads badly.
 * - `seoTitle` — the <title> tag and the on-page <h1>. Carries the search term,
 *   because "Training Systems" is not what anyone types. Falls back to `label`.
 */
export const SHOP_CATEGORIES = {
  all: {
    label: 'Shop All',
    seoTitle: 'Shop All Golf Training Gear',
    description:
      'Every Dominus Golf product in one place: swing trainers, training bands, golf apparel and accessories. Free shipping over $150.',
  },
  'training-system': {
    label: 'Training Systems',
    seoTitle: 'Golf Swing Trainers and Training Aids',
    description:
      'Swing path and swing plane training aids built for repeatable mechanics. Weighted trainers and tempo bands for indoor or outdoor practice.',
  },
  apparel: {
    label: 'Dominus Golf Apparel',
    seoTitle: 'Golf T-Shirts and Apparel',
    description:
      'Dominus Golf t-shirts and apparel for men and women. Premium cotton and moisture-wicking triblend, built for the course and beyond.',
  },
  accessories: {
    label: 'Accessories',
    seoTitle: 'Golf Accessories and Training Add-Ons',
    description:
      'Golf towels, training manuals and practice add-ons from Dominus Golf. The small gear that makes a practice session work.',
  },
  /* "Apparel", not "Gear". These two pages are apparel-only on purpose (see the
     comment on productsInShopCategory), and a visitor who arrives on "men's
     golf gear" expecting trainers and finds three t-shirts bounces — which is
     itself a ranking signal. */
  'mens-gear': {
    label: "Men's Gear",
    seoTitle: "Men's Golf Apparel",
    description:
      "Men's golf t-shirts and apparel from Dominus Golf. Premium cotton and moisture-wicking triblend in icon, wordmark and performance cuts.",
  },
  'womens-gear': {
    label: "Women's Gear",
    seoTitle: "Women's Golf Apparel",
    description:
      "Women's golf t-shirts and apparel from Dominus Golf. Premium cotton and moisture-wicking triblend in icon and performance cuts.",
  },
} satisfies Record<string, { label: string; seoTitle: string; description: string }>;

export type StaticPath = keyof typeof PAGE_SEO;

// ── Sitemap lastmod ────────────────────────────────────────────────────────

/**
 * The source file whose history stands for each indexed page's content, used by
 * the sitemap plugin to date that URL from git rather than stamping every entry
 * with the build date.
 *
 * Only indexed routes appear — `noindex` pages are never listed in the sitemap.
 *
 * Deliberately the page component and the product data, *not* this file. Titles
 * and descriptions live here, so including it would move all 36 dates together
 * on any copy edit, which is the uniform-timestamp problem being fixed. What a
 * reader would call the page's content is in the component.
 */
const PAGE_SOURCE: Partial<Record<StaticPath, string>> = {
  '/': 'src/pages/HomePage.tsx',
  '/about': 'src/pages/AboutPage.tsx',
  '/about/team': 'src/pages/TeamPage.tsx',
  '/about/contact': 'src/pages/ContactPage.tsx',
  '/about/careers': 'src/pages/CareersPage.tsx',
  '/about/sustainability': 'src/pages/SustainabilityPage.tsx',
  '/beginners': 'src/pages/BeginnersPage.tsx',
  '/tour-pure-guide': 'src/pages/TourPureGuidePage.tsx',
  '/feel-right-band-guide': 'src/pages/FeelRightBandGuidePage.tsx',
  // '/dominus-her': 'src/pages/DominusHerPage.tsx',  // unpublished, see above
  // '/grant': 'src/pages/GrantPage.tsx',  // unpublished, see above
  '/pros': 'src/pages/ProDirectoryPage.tsx',
  '/leroy-bates': 'src/pages/LeroyBatesPage.tsx',
  '/gabe-salvanera': 'src/pages/GabeSalvaneraPage.tsx',
  '/affiliates': 'src/pages/AffiliatesPage.tsx',
  '/shipping-policy': 'src/pages/ShippingPolicyPage.tsx',
  '/terms': 'src/pages/TermsPage.tsx',
  '/safety-disclaimer': 'src/pages/SafetyDisclaimerPage.tsx',
};

/** Catalog files, in the order products.ts concatenates them. */
const PRODUCT_SOURCES = [
  { file: 'src/data/products/trainingSystems.ts', ids: new Set(trainingSystems.map((p) => p.id)) },
  { file: 'src/data/products/accessories.ts', ids: new Set(accessories.map((p) => p.id)) },
  { file: 'src/data/products/apparel.ts', ids: new Set(apparel.map((p) => p.id)) },
];

/**
 * Files that decide a URL's content, for `lastmod`. An empty list means "no
 * better answer than the build date" — the sitemap plugin falls back for those.
 *
 * A product page is dated by its catalog entry: price, copy and stock all live
 * there, and ProductPage.tsx is a shared template whose every edit would
 * otherwise re-date all 13 products at once.
 */
export function routeSourceFiles(routePath: string): string[] {
  const page = PAGE_SOURCE[routePath as StaticPath];
  if (page) return [page];

  if (routePath.startsWith('/product/')) {
    const id = routePath.slice('/product/'.length);
    const source = PRODUCT_SOURCES.find((entry) => entry.ids.has(id));
    return source ? [source.file] : [];
  }

  // A category listing changes when the catalog it lists changes.
  if (routePath.startsWith('/shop/')) {
    return [...PRODUCT_SOURCES.map((entry) => entry.file), 'src/data/categories.ts'];
  }

  return [];
}

/** Build a route `head()` for a static path from the table above. */
export function pageHead(path: StaticPath) {
  return () => seo({ path, ...PAGE_SEO[path] });
}

// ── Dynamic routes ─────────────────────────────────────────────────────────
// These take the route param rather than a router context, so the prerender
// plugin can call them with a plain string.

type ShopCategoryMeta = { label: string; seoTitle: string; description: string };

/**
 * A category's naming, or undefined for an unknown slug.
 *
 * Exported so ShopPage renders its heading, sidebar and breadcrumb from this
 * table rather than keeping a second copy that drifts out of step with it.
 */
export function shopCategoryMeta(category: string): ShopCategoryMeta | undefined {
  return (SHOP_CATEGORIES as Record<string, ShopCategoryMeta>)[category];
}

/** Head for `/shop/$category`. Unknown categories get generic but valid meta. */
export function shopCategoryHead(category: string) {
  const meta = shopCategoryMeta(category);

  // The same resolver the page renders from, so the ItemList and the grid
  // cannot disagree about what this category contains.
  const listed = productsInShopCategory(category);

  return seo({
    path: `/shop/${category}`,
    // seoTitle for the title tag — it carries the search term. The breadcrumb
    // below keeps the short `label`, matching the one drawn on the page.
    title: meta?.seoTitle ?? meta?.label ?? 'Shop',
    description:
      meta?.description ?? 'Browse golf training systems, apparel, and accessories.',
    jsonLd: [
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: meta?.label ?? 'Shop', path: `/shop/${category}` },
      ]),
      // Omitted rather than emitted empty: an ItemList with no items describes
      // the page as a collection of nothing, which is worse than staying quiet.
      ...(listed.length
        ? [
            itemListJsonLd(
              listed.map((p) => ({ name: p.name, path: `/product/${p.id}` })),
            ),
          ]
        : []),
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
    // `seoTitle` where it exists, because `name` is a product name rather than
    // a search term — "Tour Pure Men" is only typed by someone who already
    // knows the brand. `name` still runs the cart, the Square line item and the
    // Merchant feed; see the field's note in data/types.ts.
    title: product.seoTitle ?? product.name,
    // A written description where there is one. The fallback clips the opening
    // paragraph, which is real copy but not written to be a search snippet —
    // it left the flagship product advertising itself as "Most golfers spend
    // hundreds on new equipment hoping something changes."
    description: product.seoDescription ?? clamp(product.description.split('\n\n')[0]),
    // JPEG twin, not the .webp catalog image — see SITE.ogImage.
    image: `/images/og/${product.id}.jpg`,
    type: 'product',
    jsonLd: [
      // Absent from the snapshot means nobody has reviewed it — productJsonLd
      // then omits aggregateRating rather than inventing one.
      productJsonLd(product, REVIEW_SUMMARIES[product.id]),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop/all' },
        { name: product.name, path: `/product/${product.id}` },
      ]),
    ],
  });
}

/**
 * Head for the static `404.html` shell.
 *
 * This is NOT a route. It is the file Cloudflare serves, with a real 404 status,
 * for any URL that has no prerendered file — see the fallback Worker in
 * `worker/index.ts`.
 *
 * Until this existed, `not_found_handling = "single-page-application"` served
 * `dist/index.html` for every unknown URL: a byte-identical copy of the home
 * page, with a `200` status and a canonical pointing at `/`. Google reported
 * those as **Soft 404** — it asked for a page, got `200 OK`, and found the home
 * page. Verified 16 Sep 2026: `curl /no-such-page-xyz` returned the home page's
 * exact md5.
 *
 * Two things here are deliberate:
 *
 * - **`noindex`**, so that even if this shell is served somewhere unexpected it
 *   can never enter the index.
 * - **No canonical.** `seo()` would otherwise emit one pointing at this page's
 *   own URL. A canonical on an error page tells Google the URL is a real,
 *   indexable destination, which is the opposite of what a 404 means.
 */
export function notFoundHead() {
  return seo({
    path: '/404',
    title: 'Page Not Found',
    description: 'This page could not be found. Browse Dominus Golf training systems, apparel, and accessories.',
    noindex: true,
    canonical: false,
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

  /* Sitewide JSON-LD, which the root route emits at runtime in App.tsx.
     The prerenderer only walks the routes above, so until this was added the
     static HTML carried no Organization or WebSite schema at all - a crawler
     that does not run JavaScript never saw either, which defeats the point of
     prerendering. Applied to every page rather than just the home page because
     the root route is an ancestor of every match, so this is what the hydrated
     DOM contains too. */
  const sitewide = [organizationJsonLd(), websiteJsonLd()].map((block) => ({
    'script:ld+json': block,
  }));
  for (const route of routes) {
    route.head.meta.push(...sitewide);
  }

  return routes;
}
