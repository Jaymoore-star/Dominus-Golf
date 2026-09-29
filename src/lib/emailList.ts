import { BACKEND_URL } from './backend';
import { trackEmailSignup } from './analytics';

/**
 * Joining the email list. The backend stores the address and emails the
 * shopper their single-use 10% code - see backend/subscribers.ts.
 */

export type SignupSource = 'footer' | 'popup';

/** Per-browser memory of having joined or dismissed, so the popup stays away. */
const JOINED_KEY = 'emailListJoined';
const DISMISSED_KEY = 'emailListPopupDismissedAt';

/** A dismissed popup comes back after this long, not on the next page view. */
const DISMISS_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export async function joinEmailList(
  email: string,
  source: SignupSource,
): Promise<{ already: boolean }> {
  const res = await fetch(`${BACKEND_URL}/api/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), source }),
  });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; already?: boolean; error?: string };
  if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong. Please try again.');

  try {
    localStorage.setItem(JOINED_KEY, '1');
  } catch {
    // Only costs a popup the visitor has already answered.
  }
  if (!data.already) trackEmailSignup(source);
  return { already: Boolean(data.already) };
}

export function hasJoinedEmailList(): boolean {
  try {
    return localStorage.getItem(JOINED_KEY) === '1';
  } catch {
    return false;
  }
}

export function dismissEmailPopup(): void {
  try {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  } catch {
    // Private mode: it may show again next visit, which is tolerable.
  }
}

export function emailPopupRecentlyDismissed(): boolean {
  try {
    const at = Number(localStorage.getItem(DISMISSED_KEY));
    return Boolean(at) && Date.now() - at < DISMISS_TTL_MS;
  } catch {
    // Storage blocked means we cannot remember a dismissal, so do not nag.
    return true;
  }
}
