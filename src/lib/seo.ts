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
    : `${SITE.name} — Golf Training Systems, Apparel & Accessories`;

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

export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl('/images/dominus-logo.png'),
    email: 'Customersupport@dominusgolf.com',
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

/**
 * Product schema — this is what puts price, availability and star ratings
 * directly into Google results.
 */
export function productJsonLd(product: Product): Record<string, unknown> {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: clamp(product.description, 500),
    image: (product.gallery?.length ? product.gallery : [product.image]).map(absoluteUrl),
    sku: product.id,
    brand: { '@type': 'Brand', name: SITE.name },
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/product/${product.id}`),
      price: product.price.toFixed(2),
      priceCurrency: 'USD',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: SITE.name },
    },
  };

  // Only advertise ratings we actually have — Google penalises invented review
  // markup, and a missing field is far safer than a fabricated one.
  if (product.rating && product.reviewCount) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    };
  }

  return data;
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
