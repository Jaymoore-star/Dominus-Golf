import { BACKEND_URL } from './backend';
import { supabase } from './supabase';
import { readReferral } from './referral';

export type CheckoutLineItem = {
  /** What the backend prices the line from. Everything below is display only. */
  id: string;
  name: string;
  /**
   * Ignored by the backend, which prices from the catalogue — the browser used
   * to set the charge, so a hand-written POST could buy anything for a cent.
   *
   * Still sent because the site and the API deploy separately: dropping it would
   * break checkout in the window where the site is newer than the backend.
   * Removable once both have shipped.
   */
  price: number;
  quantity: number;
  image?: string;
  /** Chosen size/colour. Becomes the Square line item variation_name. */
  variant?: string;
};

/**
 * Creates a Square hosted-checkout session and returns the URL to send the buyer to.
 *
 * This lived as a byte-identical copy in CartDrawer and ProductPage; the product
 * card needs it too for Buy Now, so it moved here rather than becoming a third copy.
 */
export async function createCheckoutSession(items: CheckoutLineItem[]): Promise<string> {
  // Best effort. A guest checkout is still a valid order; it just cannot be
  // attached to an account afterwards.
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth?.user?.id;

  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://www.dominusgolf.com';
  const res = await fetch(`${BACKEND_URL}/api/square/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items,
      // Both ride along as Square order metadata and come back on the webhook.
      // Resolved here rather than at each call site so no caller can forget and
      // silently lose the order record or the affiliate's commission.
      userId,
      referralCode: readReferral() ?? undefined,
      /* Square appends orderId and transactionId to whichever of these it uses.
         successUrl used to be `/?checkout=success` — a parameter nothing in the
         app ever read, so paying dropped the customer on the home page with no
         acknowledgement. */
      successUrl: `${origin}/checkout/success`,
      cancelUrl: `${origin}/?checkout=cancelled`,
    }),
  });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error || 'Failed to create checkout session');
  return data.url;
}
