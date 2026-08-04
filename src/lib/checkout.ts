import { BACKEND_URL } from './backend';
import { supabase } from './supabase';
import { readReferral } from './referral';

export type CheckoutLineItem = {
  name: string;
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
      successUrl: `${origin}/?checkout=success`,
      cancelUrl: `${origin}/?checkout=cancelled`,
    }),
  });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error || 'Failed to create checkout session');
  return data.url;
}
