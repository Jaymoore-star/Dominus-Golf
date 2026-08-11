/**
 * Google Merchant Center product feed (RSS 2.0 + the `g:` namespace).
 *
 * Free Shopping listings need a feed; the site had none, so the catalogue could
 * only ever be found through ordinary web results. Generated from the same
 * `products` array the storefront renders, so a new product is listed without a
 * spreadsheet to maintain, exactly like sitemap.xml.
 *
 * Lives under src/ rather than beside the plugin in vite.config.ts so that
 * `npm run lint:types` checks it, and so it sits next to seo.ts where the other
 * structured-data builders are.
 *
 * Two rules shape almost every decision below:
 *
 * 1. A feed that overstates anything risks the whole Merchant Center account,
 *    not just one item. Where a value is unknown it is declared unknown rather
 *    than guessed.
 * 2. Apparel is a special case. Google requires size, colour, gender, age group
 *    and an item_group_id tying the sizes together, and one entry per garment
 *    with a list of sizes gets disapproved. So a tee becomes five entries.
 */
import { products } from '../data/products';
import type { Product } from '../data/types';
import { SITE, absoluteUrl, clamp } from './seo';
import { shippingFeeFor } from './shipping';

/** Escape text for XML character data. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function tag(name: string, value: string | number): string {
  return `      <${name}>${escapeXml(String(value))}</${name}>`;
}

/**
 * Google's gender values, from the subcategory the storefront already sorts by.
 * Only apparel needs it, and only these two subcategories exist.
 */
function genderOf(product: Product): string | null {
  if (product.subcategory === "Men's Apparel") return 'male';
  if (product.subcategory === "Women's Apparel") return 'female';
  return null;
}

/** The single colour each garment currently ships in, e.g. 'White'. */
function colorOf(product: Product): string | null {
  const colors = Object.keys(product.colorVariants ?? {});
  return colors.length === 1 ? colors[0] : null;
}

/** Sizes from the Size variant, or [null] for anything not sold by size. */
function sizesOf(product: Product): Array<string | null> {
  const sizeVariant = product.variants?.find((v) => v.label === 'Size');
  return sizeVariant?.options.length ? sizeVariant.options : [null];
}

/**
 * One `<item>`. `size` is null for everything except apparel, where the caller
 * emits one call per size.
 */
/**
 * The product's opening paragraph, with promotional cross-sell removed.
 *
 * The physical book was rejected as **"Digital books not supported"**. Nothing
 * about the entry says digital — the title ends "(Physical Copy)", the specs say
 * "Physical Spiral-bound Hard Copy", and it declares a shipping rate. What did
 * it was the last sentence of the description:
 *
 *     FREE (PDF Version) with the purchase of any Tour Pure trainer.
 *
 * That is a cross-sell for the *other* product — the separate PDF, which is
 * `digital: true` and excluded from the feed. Google's automated check read
 * "PDF Version" in a book's description and classified the book as an eBook.
 *
 * Dropping it is right on its own terms, independent of the rejection: Google's
 * feed spec asks descriptions to describe the product and to leave out
 * promotional text, which is exactly what a "free with purchase of" line is.
 *
 * Deliberately feed-only. The sentence stays on the product page, where it is
 * true and useful — the site's copy is not Merchant Center's to dictate.
 */
export function feedDescription(product: Product): string {
  const opening = product.description.split('\n\n')[0];

  // Split on sentence ends, keeping the terminator, then drop the promotional
  // ones. Matching whole sentences rather than deleting the phrase avoids
  // leaving a dangling fragment behind.
  const kept = (opening.match(/[^.!?]+[.!?]*/g) ?? [opening]).filter((sentence) => {
    const text = sentence.toLowerCase();
    const isOffer = /\bfree\b|\bbonus\b|\bdiscount\b|\bsale\b/.test(text);
    // Both halves must match. "Includes" alone is ordinary description ("Includes
    // three resistance bands") and must survive; it is only promotional next to
    // "free" or "bonus".
    const isConditional =
      /with (the )?purchase|when you buy|\binclude[sd]?\b|\bcomes with\b/.test(text);
    return !(isOffer && isConditional);
  });

  // If every sentence looked promotional, keep the original rather than emit an
  // empty description — a missing description fails the feed outright.
  const cleaned = kept.join('').trim();
  return clamp(cleaned || opening, 500);
}

function itemXml(product: Product, size: string | null): string {
  const lines: string[] = [];

  // A variant needs its own stable id; item_group_id is what tells Google the
  // five sizes are one garment rather than five products.
  const id = size ? `${product.id}-${size.toLowerCase()}` : product.id;
  lines.push(tag('g:id', id));
  if (size) {
    lines.push(tag('g:item_group_id', product.id));
    lines.push(tag('g:size', size));
  }

  lines.push(tag('g:title', product.name));
  // The catalogue's own opening paragraph, as on the product page, minus the
  // promotional sentences — see feedDescription.
  lines.push(tag('g:description', feedDescription(product)));
  lines.push(tag('g:link', absoluteUrl(`/product/${product.id}`)));

  lines.push(tag('g:image_link', absoluteUrl(product.image)));
  for (const extra of (product.gallery ?? []).filter((img) => img !== product.image).slice(0, 10)) {
    lines.push(tag('g:additional_image_link', absoluteUrl(extra)));
  }

  lines.push(tag('g:availability', product.inStock ? 'in_stock' : 'out_of_stock'));

  /* compareAtPrice is the "was" figure the product page strikes through, so it
     is the regular price and `price` is the discounted one. Stating it the other
     way round would advertise a saving that does not exist. */
  if (product.compareAtPrice && product.compareAtPrice > product.price) {
    lines.push(tag('g:price', `${product.compareAtPrice.toFixed(2)} USD`));
    lines.push(tag('g:sale_price', `${product.price.toFixed(2)} USD`));
  } else {
    lines.push(tag('g:price', `${product.price.toFixed(2)} USD`));
  }

  lines.push(tag('g:condition', 'new'));
  lines.push(tag('g:brand', SITE.name));

  /* Dominus Golf products carry no barcode, and there is no manufacturer part
     number for an own-brand item. `identifier_exists: no` is the documented way
     to say so; inventing a GTIN would be a data-quality violation. The blank
     garment's model in `specs` is the supplier's, not this product's. */
  lines.push(tag('g:identifier_exists', 'no'));

  // Free-text merchandising path. Deliberately not google_product_category,
  // whose values must match Google's taxonomy exactly - a wrong string is worse
  // than letting Google classify the item itself.
  lines.push(tag('g:product_type', product.subcategory ?? product.category));

  const gender = genderOf(product);
  if (gender) {
    lines.push(tag('g:gender', gender));
    lines.push(tag('g:age_group', 'adult'));
  }

  const color = colorOf(product);
  if (color) lines.push(tag('g:color', color));

  // The same rate checkout charges, from the same function.
  lines.push(
    [
      '      <g:shipping>',
      `        <g:country>US</g:country>`,
      `        <g:service>Standard</g:service>`,
      `        <g:price>${shippingFeeFor(product.price, true).toFixed(2)} USD</g:price>`,
      '      </g:shipping>',
    ].join('\n'),
  );

  return `    <item>\n${lines.join('\n')}\n    </item>`;
}

/**
 * Products the feed advertises.
 *
 * Physical goods only. The eBook is a download: Merchant Center treats digital
 * goods under different rules and a shipping declaration would be meaningless
 * for it, so it is left out rather than described incorrectly. Sold-out items
 * stay in with `out_of_stock`, which is what Google expects - pulling them makes
 * the listing lose its history and start over when stock returns.
 */
export function feedProducts(): Product[] {
  return products.filter((product) => !product.digital);
}

export function buildMerchantFeed(): string {
  const items = feedProducts()
    .flatMap((product) => sizesOf(product).map((size) => itemXml(product, size)))
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">',
    '  <channel>',
    `    <title>${escapeXml(SITE.name)}</title>`,
    `    <link>${SITE.url}</link>`,
    `    <description>${escapeXml(SITE.description)}</description>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
