import type { Product } from '../data/products';

/**
 * What a product card can decide on the shopper's behalf.
 *
 * Cards have no variant picker, so adding straight to the bag is only honest
 * when there is nothing to pick. Products fall into three cases:
 *
 * - **No variants** (towel, book) — add directly.
 * - **One option** (Tour Pure Men, whose only "Color" is Black) — there is a
 *   single valid answer, so resolve it and add directly.
 * - **Several options** (every tee, S through XXL) — the card cannot ask, and an
 *   order with no size cannot be fulfilled, so send the shopper to the product
 *   page to choose.
 */
/**
 * What the product calls its variant group — "Size" for apparel, "Color" for the
 * Tour Pure trainers. Hardcoding "Size" would put "Tour Pure Men — Size Black"
 * on a Square order.
 */
export function variantLabel(product: Product): string {
  return product.variants?.[0]?.label ?? 'Size';
}

/** How a chosen variant is written onto a checkout line item. */
export function withVariantName(product: Product, variant?: string): string {
  return variant ? `${product.name} — ${variantLabel(product)} ${variant}` : product.name;
}

export function resolveCardVariant(product: Product): {
  requiresChoice: boolean;
  variant: string | undefined;
} {
  const options = product.variants?.[0]?.options ?? [];
  if (options.length === 0) return { requiresChoice: false, variant: undefined };
  if (options.length === 1) return { requiresChoice: false, variant: options[0] };
  return { requiresChoice: true, variant: undefined };
}
