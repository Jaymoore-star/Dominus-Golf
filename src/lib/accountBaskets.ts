/**
 * Wishlist and cart persisted on the Supabase user's `user_metadata`, for the
 * same reasons as the address and preferences in ./accountProfile: they are
 * small, they belong to exactly one user, and Supabase already returns them with
 * the session — so a customer's saved items follow them onto any device without a
 * table or an RLS policy to maintain.
 *
 * Signed out, both lists live only in localStorage (see the two stores). Signing
 * in merges that guest list into the account copy rather than replacing it, so
 * items added before logging in are never silently dropped — which matters most
 * for the cart, where the usual flow is add-then-sign-in-to-check-out.
 *
 * Only ids and quantities are stored. Names and prices are rehydrated from the
 * live catalog on load, so a saved item never shows a stale price.
 */

import { supabase } from './supabase';

export type StoredCartLine = { id: string; quantity: number };

type Metadata = Record<string, unknown> | undefined;

/** Read saved wishlist ids out of user metadata, tolerating absent/garbage data. */
export function readWishlistIds(metadata: Metadata): string[] {
  const raw = metadata?.wishlist;
  if (!Array.isArray(raw)) return [];
  return raw.filter((id): id is string => typeof id === 'string');
}

/** Read saved cart lines out of user metadata, tolerating absent/garbage data. */
export function readCartLines(metadata: Metadata): StoredCartLine[] {
  const raw = metadata?.cart;
  if (!Array.isArray(raw)) return [];

  return raw
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null;
      const { id, quantity } = entry as { id?: unknown; quantity?: unknown };
      if (typeof id !== 'string') return null;
      return { id, quantity: Math.max(1, Math.floor(Number(quantity) || 1)) };
    })
    .filter((line): line is StoredCartLine => line !== null);
}

/** Account order preserved, then anything saved as a guest that is not already in it. */
export function mergeWishlistIds(account: string[], guest: string[]): string[] {
  return [...account, ...guest.filter((id) => !account.includes(id))];
}

/**
 * Union by product id. How quantities combine depends on where the local cart
 * came from, which is why the caller has to say:
 *
 * - **Guest cart** (`localIsSameAccount: false`) — sum. Someone who adds one of
 *   something they already had two of in their account cart means to have three.
 * - **This account's own mirror** (`true`) — take the larger. While signed in,
 *   localStorage holds a copy of the account cart, so summing on every session
 *   restore would double the quantities on each reload. Taking the larger is
 *   still safe for an add that has not finished syncing yet.
 */
export function mergeCartLines(
  account: StoredCartLine[],
  local: StoredCartLine[],
  localIsSameAccount: boolean,
): StoredCartLine[] {
  const merged = account.map((line) => ({ ...line }));

  for (const line of local) {
    const existing = merged.find((m) => m.id === line.id);
    if (!existing) {
      merged.push({ ...line });
    } else if (localIsSameAccount) {
      existing.quantity = Math.max(existing.quantity, line.quantity);
    } else {
      existing.quantity += line.quantity;
    }
  }

  return merged;
}

/**
 * Writes are debounced so a burst of quantity taps costs one request, and each
 * carries a snapshot of the payload rather than reading state when the timer
 * fires. That snapshot is what makes sign-out safe: clearing the lists locally
 * can never be mistaken for the customer emptying them, so sign-out cannot wipe
 * the account copy.
 */
const SYNC_DELAY_MS = 700;

type BasketKey = 'wishlist' | 'cart';
type Pending = { timer: ReturnType<typeof setTimeout>; run: () => Promise<void> };

const pending = new Map<BasketKey, Pending>();

function schedule(key: BasketKey, payload: unknown) {
  const existing = pending.get(key);
  if (existing) clearTimeout(existing.timer);

  const run = async () => {
    pending.delete(key);
    try {
      // `data` is shallow-merged into user_metadata, so writing one key leaves
      // the saved address and preferences alone.
      await supabase.auth.updateUser({ data: { [key]: payload } });
    } catch {
      // Offline, or the session went away. localStorage still holds the list,
      // and the next mutation while signed in will push it again.
    }
  };

  pending.set(key, { timer: setTimeout(run, SYNC_DELAY_MS), run });
}

export function scheduleWishlistSync(ids: string[]) {
  schedule('wishlist', ids);
}

export function scheduleCartSync(lines: StoredCartLine[]) {
  schedule('cart', lines);
}

/**
 * Lands any debounced write immediately. Called before sign-out, while the
 * session is still valid — otherwise a removal made in the last moment before
 * signing out would never reach the account.
 */
export async function flushAccountBaskets(): Promise<void> {
  const entries = [...pending.values()];
  pending.clear();

  await Promise.all(
    entries.map((entry) => {
      clearTimeout(entry.timer);
      return entry.run();
    }),
  );
}
