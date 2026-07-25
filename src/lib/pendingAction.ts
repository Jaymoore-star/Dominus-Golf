/**
 * An action the user started but that the login gate interrupted, remembered so
 * they can pick it up again on the way back.
 *
 * This deliberately restores *state* rather than re-firing the action. Both
 * checkout paths finish with `window.open`, and browsers block popups that
 * aren't tied to a user gesture — a post-login redirect is not one. So we put
 * the user back exactly where they were and let their next click do the work.
 *
 * localStorage for the same reason as the grant draft: the login round-trip does
 * not reliably stay in one tab (an emailed confirmation link opens a new one),
 * and sessionStorage would be empty there. Always cleared as soon as it is
 * claimed, so a stale intent cannot fire later.
 */

const PENDING_ACTION_KEY = 'postLoginAction';

export type PendingAction =
  | { type: 'openCart' }
  | { type: 'buyNow'; productId: string; quantity: number; variant: string }
  | { type: 'grantForm' };

export function setPendingAction(action: PendingAction) {
  try {
    localStorage.setItem(PENDING_ACTION_KEY, JSON.stringify(action));
  } catch {
    // ignore storage errors (private mode)
  }
}

/**
 * Read without consuming. Callers should check the action is theirs before
 * clearing it — several of these components mount on the same page, and a
 * blind take() would swallow another component's action.
 */
export function peekPendingAction(): PendingAction | null {
  try {
    const raw = localStorage.getItem(PENDING_ACTION_KEY);
    return raw ? (JSON.parse(raw) as PendingAction) : null;
  } catch {
    return null;
  }
}

export function clearPendingAction() {
  try {
    localStorage.removeItem(PENDING_ACTION_KEY);
  } catch {
    // ignore storage errors (private mode)
  }
}
