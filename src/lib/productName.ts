/**
 * Display-only trimming of the gendered suffix on apparel names.
 *
 * `product.name` stays canonical — "Icon Tee (Women's)" — because it is the only
 * identifier sent to Square as a checkout line item, and it also backs the page
 * title, the structured-data product name, nav search results and the analytics
 * item_name. In every one of those a bare "Icon Tee" would collide with its
 * opposite-gender twin at the same price.
 *
 * The three places a shopper reads the name — the apparel card, the cart line and
 * the product page heading — each already render `subcategory` ("Men's Apparel" /
 * "Women's Apparel") immediately above it, so the suffix only repeats what is
 * already on screen. This strips it there and nowhere else.
 */
export function displayProductName(name: string): string {
  return name.replace(/\s*\((?:Men|Women)'s\)\s*$/, '');
}
