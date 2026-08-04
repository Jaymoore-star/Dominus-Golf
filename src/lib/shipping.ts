/**
 * Shipping policy, in one place.
 *
 * The site promises free shipping over $150 in four places — the announcement
 * bar, the cart drawer's progress meter, the trust badges and the shipping
 * policy page — but nothing implemented it. The fee was a flat rate configured
 * in the Square Dashboard, which Square applied to every payment link no matter
 * what the cart was worth. A customer could clear the threshold, watch the cart
 * congratulate them, and still be charged at the Square page.
 *
 * The fee is now decided here and passed to Square explicitly, so the promise
 * and the charge come from the same number. The Dashboard rate must stay at $0
 * or the two will stack.
 */

/** At or above this subtotal, standard shipping is free. */
export const FREE_SHIPPING_THRESHOLD = 150;

/** Flat standard shipping below the threshold. */
export const STANDARD_SHIPPING_FEE = 6.99;

/** What the buyer pays for shipping on a given subtotal, in dollars. */
export function shippingFeeFor(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}
