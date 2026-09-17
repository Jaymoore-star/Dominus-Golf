export type Category =
  | 'training-system'
  | 'apparel'
  | 'accessories';

export type Money = number;

export type Variant = {
  label: string;
  options: string[];
};


export type Product = {
  id: string;
  name: string;
  category: Category;
  subcategory?: string;
  /**
   * Who the product is built for, where that is a real distinction. Unisex
   * items - training aids, the towel, the guides - leave it unset.
   *
   * The men's / women's split used to be readable only from `subcategory`
   * ("Women's Apparel"), which is true of the tees and misses the women's Tour
   * Pure completely, because that is a training system. /dominus-her lists
   * every female item, so it needs a field that holds for all of them rather
   * than a prefix match on a display string.
   */
  audience?: 'men' | 'women' | 'junior';
  price: Money;
  compareAtPrice?: Money;
  image: string;
  hoverImage?: string;
  gallery?: string[];
  badge?: string;
  /**
   * Search-facing name, used for the <title> tag and the on-page <h1>.
   *
   * `name` stays canonical and is what the cart, the Square checkout line item
   * and the Merchant Center feed use — so a product can be renamed for search
   * without changing what a customer sees on their receipt, and without
   * triggering a Google re-review of all 36 feed entries.
   *
   * It exists because `name` is a product name, not a search term. "Tour Pure
   * Men" is what someone types only if they already know the brand; the page
   * has to answer "swing path trainer" as well. Audited 16 Sep 2026: none of
   * the site's winnable keywords (docs/SEO.md §3) appeared in any title or h1.
   *
   * Write it with the gender in the `(Men's)` / `(Women's)` form where the
   * product has a gendered twin. displayProductName() strips that suffix for
   * the heading, where `subcategory` already renders directly above it, while
   * the title tag keeps it — there it is the only thing separating the men's
   * and women's versions of the same shirt at the same price.
   *
   * Falls back to `name` when unset. Keep it under ~45 characters: seo()
   * appends " | Dominus Golf" and Google truncates the result around 60.
   */
  seoTitle?: string;
  /**
   * Meta description for this product's page.
   *
   * Without it, productHead() clips the first paragraph of `description` to 155
   * characters, which is how the flagship product ended up advertising itself
   * in Google as "Most golfers spend hundreds on new equipment hoping something
   * changes." — true, well written, and no use at all to someone deciding
   * whether to click. Three others were clipped mid-word.
   *
   * 120-155 characters. Say what the product is, not what it evokes.
   */
  seoDescription?: string;
  description: string;
  features: string[];
  specs?: string[];
  variants?: Variant[];
  inStock: boolean;
  /**
   * Delivered by email, never shipped. Excluded from the shipping fee, and a
   * cart holding nothing else is not asked for a shipping address at all.
   * See src/lib/shipping.ts.
   */
  digital?: boolean;
  /* No rating/reviewCount/reviews here. Reviews are real customer records in
     Supabase (see lib/reviews.ts); the fields that used to sit here held
     invented figures that also reached Google as aggregateRating markup. */
  includedImages?: { label: string; image: string }[];
  colorVariants?: Record<string, string>;
  paymentUrl?: string;
};

export type CategoryCard = {
  id: Category | 'company';
  label: string;
  image: string;
  href: string;
};
