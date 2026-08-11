/**
 * SEO helpers for router-managed document head tags.
 *
 * TanStack Router collects `head()` output from every active route match and
 * renders it via <HeadContent />. Deeper matches win, so the root route sets
 * sitewide defaults and each child overrides only what it needs.
 *
 * Meta entries use the router's own shape:
 *   { title }                     -> <title>
 *   { name | property, content }  -> <meta>
 *   { 'script:ld+json': {...} }   -> <script type="application/ld+json">
 */
import type { Product } from '../data/types';
import { shippingFeeFor } from './shipping';

export const SITE = {
  name: 'Dominus Golf',
  /** Canonical origin. Must match the Square redirect URLs in backend/index.ts. */
  url: 'https://www.dominusgolf.com',
  locale: 'en_US',
  /**
   * Fallback share image — used whenever a page has nothing more specific.
   *
   * Must stay a JPEG at 1200x630. The catalog images are .webp, which
   * Facebook's crawler does not reliably render, so shared links would come out
   * with no picture. Regenerate with: python scripts/generate-og-images.py
   */
  ogImage: '/og-default.jpg',
  description:
    'Golf training systems, apparel, and accessories from Dominus Golf. Train swing path and plane with equipment built for a repeatable swing.',
} as const;

/** Resolve a site-relative path to an absolute URL; passes through absolute URLs. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE.url}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

/** Collapse whitespace and clip to a length search engines will actually show. */
export function clamp(text: string, max = 155): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (flat.length <= max) return flat;
  return `${flat.slice(0, max - 1).replace(/[\s,;:.-]+$/, '')}…`;
}

export type SeoInput = {
  /** Page title without the brand suffix. Omit on the home page. */
  title?: string;
  description: string;
  /** Site-relative path, e.g. '/shop/apparel'. Used for canonical + og:url. */
  path: string;
  /** Site-relative or absolute image URL. */
  image?: string;
  type?: 'website' | 'product' | 'article';
  /** Keep the page out of search results (account pages, auth, checkout states). */
  noindex?: boolean;
  /** Extra structured data to embed as JSON-LD. */
  jsonLd?: Array<Record<string, unknown>>;
  /**
   * Emit a canonical link. The root route must pass `false`.
   *
   * The router dedupes <link> tags by exact equality rather than by rel, so a
   * canonical from the root match and one from the page match would both
   * render — leaving every page with two canonicals, one of them pointing at
   * the homepage. Only the deepest match may emit one.
   */
  canonical?: boolean;
};

type MetaEntry = Record<string, unknown>;
type LinkEntry = Record<string, unknown>;

/**
 * Build the `head()` return value for a route.
 * Titles get the brand suffix unless they already end with it.
 */
export function seo(input: SeoInput): { meta: MetaEntry[]; links: LinkEntry[] } {
  const {
    title,
    description,
    path,
    image,
    type = 'website',
    noindex,
    jsonLd,
    canonical = true,
  } = input;

  const fullTitle = title
    ? title.endsWith(SITE.name)
      ? title
      : `${title} | ${SITE.name}`
    : `${SITE.name} - Golf Training Systems, Apparel & Accessories`;

  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image || SITE.ogImage);
  const desc = clamp(description);

  const meta: MetaEntry[] = [
    { title: fullTitle },
    { name: 'description', content: desc },

    { property: 'og:site_name', content: SITE.name },
    { property: 'og:type', content: type },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: desc },
    { property: 'og:url', content: url },
    { property: 'og:image', content: imageUrl },
    { property: 'og:locale', content: SITE.locale },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: desc },
    { name: 'twitter:image', content: imageUrl },
  ];

  if (noindex) {
    meta.push({ name: 'robots', content: 'noindex, nofollow' });
  }

  for (const block of jsonLd ?? []) {
    meta.push({ 'script:ld+json': block });
  }

  return {
    meta,
    links: canonical ? [{ rel: 'canonical', href: url }] : [],
  };
}

// ── Structured data ────────────────────────────────────────────────────────

/**
 * Official social profiles, for the `sameAs` field.
 *
 * This is how Google ties the site, the accounts and the brand together into one
 * entity for the knowledge panel. Must stay in sync with the icons in
 * components/layout/Footer.tsx, and must only ever list profiles Dominus Golf
 * actually controls — `sameAs` is an identity claim.
 */
const SOCIAL_PROFILES = [
  'https://www.facebook.com/DominusGolf',
  'https://www.instagram.com/dominus_golf/',
  'https://www.youtube.com/@DominusGolf',
  'https://x.com/GolfDominus',
];

export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl('/images/dominus-logo.png'),
    email: 'Customersupport@dominusgolf.com',
    sameAs: SOCIAL_PROFILES,
  };
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
  };
}

/** A real rating, averaged over real reviews. Never synthesised. */
export type RatingSummary = { average: number; count: number };

/**
 * Product schema — this is what puts price, availability and star ratings
 * directly into Google results.
 */
export function productJsonLd(
  product: Product,
  rating?: RatingSummary,
): Record<string, unknown> {
  const offer: Record<string, unknown> = {
    '@type': 'Offer',
    url: absoluteUrl(`/product/${product.id}`),
    price: product.price.toFixed(2),
    priceCurrency: 'USD',
    availability: product.inStock
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
    // Recommended for merchant listings, and unambiguous here: everything in
    // the catalogue is sold new, direct from the brand. Google warns on its
    // absence rather than failing, but an explicit value is one less reason for
    // an item to be held back from free listings.
    itemCondition: 'https://schema.org/NewCondition',
    seller: { '@type': 'Organization', name: SITE.name },
  };

  /* Shipping cost, delivery estimate and returns, for merchant listings.
     Physical goods only: a download has no shipping and is not covered by a
     policy written around "unopened products in original condition", so
     claiming either for the eBook would be marking up something untrue.

     Every value here traces to something already published. The rate comes from
     shippingFeeFor() so the markup and the checkout cannot disagree; the times
     and the returns terms are the shipping policy page verbatim. */
  if (!product.digital) {
    offer.shippingDetails = {
      '@type': 'OfferShippingDetails',
      shippingRate: {
        '@type': 'MonetaryAmount',
        // Priced for a single unit, which is what a product page offers. No
        // product currently reaches FREE_SHIPPING_THRESHOLD on its own, so this
        // is the flat rate today - it becomes 0 for anything listed above it.
        value: shippingFeeFor(product.price, true).toFixed(2),
        currency: 'USD',
      },
      shippingDestination: {
        '@type': 'DefinedRegion',
        addressCountry: 'US',
      },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        // "Processed within 1-3 business days", then "standard 3-7 business days".
        handlingTime: {
          '@type': 'QuantitativeValue',
          minValue: 1,
          maxValue: 3,
          unitCode: 'DAY',
        },
        transitTime: {
          '@type': 'QuantitativeValue',
          minValue: 3,
          maxValue: 7,
          unitCode: 'DAY',
        },
      },
    };

    offer.hasMerchantReturnPolicy = {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'US',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 30,
      returnMethod: 'https://schema.org/ReturnByMail',
      // The buyer pays return postage unless the item was defective or wrong.
      // Deliberately not ReturnShippingFees, which would require naming a fixed
      // amount we do not charge - the customer pays the carrier directly.
      returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
    };
  }

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: clamp(product.description, 500),
    image: (product.gallery?.length ? product.gallery : [product.image]).map(absoluteUrl),
    sku: product.id,
    brand: { '@type': 'Brand', name: SITE.name },
    offers: offer,
  };

  /* aggregateRating comes only from real reviews.
     This once emitted hardcoded product figures, which is exactly the invented
     review markup Google penalises. The ratings now come from the Supabase
     product_reviews table, snapshotted at build time into
     data/reviewSummaries.generated.ts so the prerendered HTML and the hydrated
     DOM agree. A product nobody has reviewed gets no rating at all rather than
     a zero — there is no honest way to mark up "unrated". */
  if (rating && rating.count > 0) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.average,
      reviewCount: rating.count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return data;
}

/**
 * ItemList for a `/shop/$category` page — the products it lists, in the order a
 * visitor sees them.
 *
 * A category page previously carried only a BreadcrumbList, which says where the
 * page sits but nothing about what is on it. This tells Google the page is a
 * collection and which products it collects, so the listing is understood as a
 * category rather than as a thin page of links.
 *
 * Deliberately a *summary* list — position and `url` per entry, no nested
 * Product objects. The full Product schema, with price, availability and
 * rating, lives on each product page, and repeating a partial copy here would
 * give Google two descriptions of the same item to reconcile.
 */
export function itemListJsonLd(
  items: Array<{ name: string; path: string }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function breadcrumbJsonLd(
  trail: Array<{ name: string; path: string }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
