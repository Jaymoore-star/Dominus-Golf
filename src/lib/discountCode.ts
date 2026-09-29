import { useEffect, useState } from 'react';
import { BACKEND_URL } from './backend';
import { supabase } from './supabase';

/**
 * The shopper's welcome code from the email list.
 *
 * It arrives two ways: typed into the bag, or on the Shop Now link in the
 * welcome email (`/?code=WELCOME-XXXXXX`). Either way it is kept here and sent
 * with every checkout, so Buy Now on a product card gets the discount too, not
 * only the bag.
 *
 * localStorage for the same reason as the referral code: the gap between
 * opening the email and buying is often days. Unlike the referral, the latest
 * code wins - a customer pasting a new code means that one.
 *
 * Nothing here is trusted for money. The backend checks the code again when it
 * makes the payment link and applies the percentage itself.
 */

const KEY = 'discountCode';
const CHANGE_EVENT = 'dominus:discount-code';

function normalise(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, '');
}

export function readDiscountCode(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function storeDiscountCode(code: string): void {
  try {
    localStorage.setItem(KEY, normalise(code));
  } catch {
    // Private mode: the code still applies if it is typed in the bag this visit.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function clearDiscountCode(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing stored, so nothing to clear.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Picks up ?code= from the welcome email's link. Run on every navigation. */
export function captureDiscountCodeFromUrl(search: string = window.location.search): void {
  try {
    const code = new URLSearchParams(search).get('code');
    if (code && code.trim() && normalise(code) !== readDiscountCode()) storeDiscountCode(code);
  } catch {
    // A malformed query string should never break the page.
  }
}

/** The stored code, kept in step across the bag, the cards and other tabs. */
export function useDiscountCode(): string | null {
  const [code, setCode] = useState<string | null>(null);
  useEffect(() => {
    const sync = () => setCode(readDiscountCode());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  return code;
}

export type DiscountCheck =
  | { ok: true; code: string; percent: number; name: string }
  /* `invalid` = spent, unknown, or another email's: forget it. The others
     (`sign_in`, `unavailable`) are fixed by signing in or trying again. */
  | { ok: false; error: string; reason?: 'invalid' | 'sign_in' | 'unavailable' };

/**
 * Sends the session token when there is one, so a code belonging to a different
 * email is refused in the bag rather than only at checkout.
 */
export async function validateDiscountCode(code: string): Promise<DiscountCheck> {
  try {
    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;
    const res = await fetch(`${BACKEND_URL}/api/discount/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ code: normalise(code) }),
    });
    return (await res.json()) as DiscountCheck;
  } catch {
    return { ok: false, error: "Codes can't be checked right now. Please try again shortly." };
  }
}
