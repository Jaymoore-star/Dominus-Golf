import { Product, Category } from './types';
import { trainingSystems } from './products/trainingSystems';
import { apparel } from './products/apparel';
import { accessories } from './products/accessories';
import { categoryCards } from './categories';

export * from './types';
export * from './categories';
export * from './products/trainingSystems';
export * from './products/apparel';
export * from './products/accessories';

export const products: Product[] = [
  ...trainingSystems,
  ...accessories,
  ...apparel,
];

// Legacy export kept for any other components that may reference `categories`
export const categories = categoryCards;

/**
 * The products a `/shop/$category` page lists.
 *
 * `mens-gear` and `womens-gear` are not values of `Category` — no product
 * carries them, and they are not in the `Category` union. They are gender views
 * over the catalogue, resolved from `subcategory`, which is where the men's /
 * women's split is actually recorded.
 *
 * Before this existed, both routes were matched with `p.category === category`,
 * which is never true for either, so each rendered an empty grid — while still
 * being prerendered and listed in `sitemap.xml`. Two of the site's 36 indexed
 * URLs were empty pages promising men's and women's gear.
 *
 * Gender pages list that gender's apparel only. Training systems and
 * accessories are unisex, and adding them to both pages would leave the two
 * URLs ~70% identical to each other and to `/shop/all` — the near-duplicate
 * listing that thin-content demotion exists to catch.
 *
 * Shared with the head builder in lib/pageSeo.ts so the ItemList schema and the
 * rendered grid cannot disagree about what is on the page.
 */
export function productsInShopCategory(category: string): Product[] {
  if (!category || category === 'all') return products;

  if (category === 'mens-gear' || category === 'womens-gear') {
    const prefix = category === 'mens-gear' ? "Men's" : "Women's";
    return products.filter((p) => p.subcategory?.startsWith(prefix));
  }

  return products.filter((p) => p.category === (category as Category));
}
