/**
 * Analytics: GA4 + Meta Pixel.
 *
 * Both are gated on env vars. With no ID configured nothing is injected and no
 * network request is made — so local dev and preview builds stay clean, and the
 * site ships safely before the accounts exist.
 *
 * Set in .env:
 *   VITE_GA4_ID=G-XXXXXXXXXX
 *   VITE_META_PIXEL_ID=1234567890
 */
import type { Product } from '../data/types';

const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean };
    _fbq?: unknown;
  }
}

const hasGa4 = () => Boolean(GA4_ID) && typeof window !== 'undefined' && Boolean(window.gtag);
const hasPixel = () => Boolean(META_PIXEL_ID) && typeof window !== 'undefined' && Boolean(window.fbq);

let initialized = false;

/** Inject whichever trackers are configured. Safe to call more than once. */
export function initAnalytics(): void {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  if (GA4_ID) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    const gtag: (...args: unknown[]) => void = function (...args) {
      window.dataLayer!.push(args);
    };
    window.gtag = gtag;
    gtag('js', new Date());
    // Page views are sent manually on route change — this is an SPA, so GA4's
    // automatic pageview would only ever fire once, on first load.
    gtag('config', GA4_ID, { send_page_view: false });
  }

  if (META_PIXEL_ID) {
    /* eslint-disable */
    (function (f: any, b: Document, e: string, v: string) {
      if (f.fbq) return;
      const n: any = (f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      });
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      const t = b.createElement(e) as HTMLScriptElement;
      t.async = true;
      t.src = v;
      const s = b.getElementsByTagName(e)[0];
      s.parentNode?.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */

    window.fbq?.('init', META_PIXEL_ID);
  }
}

/** Fire on every route change (and once on first load). */
export function trackPageView(path: string, title?: string): void {
  if (hasGa4()) {
    window.gtag!('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: title ?? document.title,
    });
  }
  if (hasPixel()) {
    window.fbq!('track', 'PageView');
  }
}

// ── E-commerce events ──────────────────────────────────────────────────────
// GA4 and Meta use different event names and payload shapes for the same
// action, so each helper emits both rather than leaking that split into pages.

function ga4Item(product: Product, quantity = 1) {
  return {
    item_id: product.id,
    item_name: product.name,
    item_category: product.category,
    price: product.price,
    quantity,
  };
}

export function trackViewItem(product: Product): void {
  if (hasGa4()) {
    window.gtag!('event', 'view_item', {
      currency: 'USD',
      value: product.price,
      items: [ga4Item(product)],
    });
  }
  if (hasPixel()) {
    window.fbq!('track', 'ViewContent', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price,
      currency: 'USD',
    });
  }
}

export function trackAddToCart(product: Product, quantity = 1): void {
  if (hasGa4()) {
    window.gtag!('event', 'add_to_cart', {
      currency: 'USD',
      value: product.price * quantity,
      items: [ga4Item(product, quantity)],
    });
  }
  if (hasPixel()) {
    window.fbq!('track', 'AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price * quantity,
      currency: 'USD',
    });
  }
}

export function trackBeginCheckout(
  items: Array<{ product: Product; quantity: number }>,
): void {
  const value = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  if (hasGa4()) {
    window.gtag!('event', 'begin_checkout', {
      currency: 'USD',
      value,
      items: items.map((i) => ga4Item(i.product, i.quantity)),
    });
  }
  if (hasPixel()) {
    window.fbq!('track', 'InitiateCheckout', {
      content_ids: items.map((i) => i.product.id),
      content_type: 'product',
      num_items: items.reduce((sum, i) => sum + i.quantity, 0),
      value,
      currency: 'USD',
    });
  }
}

/**
 * Grant application fee. Not a catalog product, so it gets its own event with a
 * literal payload rather than being forced through the product helpers.
 */
export function trackGrantCheckout(): void {
  if (hasGa4()) {
    window.gtag!('event', 'begin_checkout', {
      currency: 'USD',
      value: 15,
      items: [
        {
          item_id: 'grant-application-fee',
          item_name: 'Development Grant Application Fee',
          item_category: 'grant',
          price: 15,
          quantity: 1,
        },
      ],
    });
  }
  if (hasPixel()) {
    window.fbq!('track', 'InitiateCheckout', {
      content_ids: ['grant-application-fee'],
      content_type: 'product',
      num_items: 1,
      value: 15,
      currency: 'USD',
    });
  }
}

/** Grant fee confirmed paid — fired from the success page after verification. */
export function trackGrantPurchase(orderId?: string): void {
  if (hasGa4()) {
    window.gtag!('event', 'purchase', {
      transaction_id: orderId,
      currency: 'USD',
      value: 15,
      items: [
        {
          item_id: 'grant-application-fee',
          item_name: 'Development Grant Application Fee',
          item_category: 'grant',
          price: 15,
          quantity: 1,
        },
      ],
    });
  }
  if (hasPixel()) {
    window.fbq!('track', 'Purchase', { value: 15, currency: 'USD' });
  }
}

export function trackSignup(method: string): void {
  if (hasGa4()) window.gtag!('event', 'sign_up', { method });
  if (hasPixel()) window.fbq!('track', 'CompleteRegistration');
}
