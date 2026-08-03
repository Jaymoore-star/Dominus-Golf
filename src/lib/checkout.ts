import { BACKEND_URL } from './backend';

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
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://www.dominusgolf.com';
  const res = await fetch(`${BACKEND_URL}/api/square/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items,
      successUrl: `${origin}/?checkout=success`,
      cancelUrl: `${origin}/?checkout=cancelled`,
    }),
  });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error || 'Failed to create checkout session');
  return data.url;
}
