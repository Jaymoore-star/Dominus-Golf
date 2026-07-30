/**
 * The device side of the wishlist and cart: localStorage keys, and the clears
 * that sign-out runs.
 *
 * This lives apart from the two stores so `hooks/useAuth` can clear both without
 * importing them — the stores read auth state, so that would be an import cycle.
 * The account side (what follows the customer between devices) is in
 * ./accountBaskets.
 *
 * Clearing dispatches an event because each store owns the React copy of its
 * list; dropping the localStorage entry alone would leave the navbar badges
 * showing the previous person's count until a reload.
 */

export const WISHLIST_STORAGE_KEY = 'dominus-wishlist';
export const CART_STORAGE_KEY = 'dominus-cart';

/**
 * Which account the locally stored cart belongs to, or absent if it was built as
 * a guest. The cart merge needs this to tell "quantities a guest added, which
 * should be added on top of the account cart" from "this account's own cart,
 * restored on reload" — summing the latter would double the cart every reload.
 *
 * The wishlist needs no equivalent: merging ids is a set union, so re-merging the
 * same list changes nothing.
 */
const CART_OWNER_KEY = 'dominus-cart-owner';

const WISHLIST_RESET_EVENT = 'dominus-wishlist-reset';
const CART_RESET_EVENT = 'dominus-cart-reset';

function clearAndAnnounce(storageKey: string, eventName: string) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // ignore quota / private-mode errors
  }
  window.dispatchEvent(new Event(eventName));
}

function subscribe(eventName: string, handler: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(eventName, handler);
  return () => window.removeEventListener(eventName, handler);
}

/**
 * Drops the saved list from this device on sign-out, so a shared machine does not
 * show the next person what the last one saved. The account copy in user metadata
 * is untouched and comes back on the next sign-in.
 */
export function clearPersistedWishlist() {
  clearAndAnnounce(WISHLIST_STORAGE_KEY, WISHLIST_RESET_EVENT);
}

/** As above, for the cart — the next person should not inherit a basket. */
export function clearPersistedCart() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(CART_OWNER_KEY);
  } catch {
    // ignore quota / private-mode errors
  }
  clearAndAnnounce(CART_STORAGE_KEY, CART_RESET_EVENT);
}

/** The account the stored cart belongs to, or null if it was built signed out. */
export function readCartOwner(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(CART_OWNER_KEY);
  } catch {
    return null;
  }
}

/** Marks the stored cart as belonging to this account, after hydrating it. */
export function writeCartOwner(userId: string) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CART_OWNER_KEY, userId);
  } catch {
    // ignore quota / private-mode errors
  }
}

export function onWishlistReset(handler: () => void): () => void {
  return subscribe(WISHLIST_RESET_EVENT, handler);
}

export function onCartReset(handler: () => void): () => void {
  return subscribe(CART_RESET_EVENT, handler);
}
