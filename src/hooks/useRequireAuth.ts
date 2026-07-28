import { useAuth } from './useAuth';
import { useAuthPrompt } from '../store/authPromptStore';
import { type PendingAction, setPendingAction, clearPendingAction } from '../lib/pendingAction';

const REDIRECT_KEY = 'postLoginRedirect';

/**
 * How long a stashed destination stays valid.
 *
 * Without an expiry the stash is sticky for the whole browser session: browse
 * to /account/addresses while signed out, wander off, sign in an hour later,
 * and you land on Addresses instead of the home page with no idea why. Signing
 * in should only ever return you somewhere specific if you were sent to the
 * login screen a moment ago.
 */
const REDIRECT_TTL_MS = 10 * 60 * 1000;

/** Auth screens are never a sensible place to return to after signing in. */
const NON_RETURNABLE = ['/login', '/signup', '/auth/'];

type StashedRedirect = { path: string; at: number };

function readStash(): string | null {
  try {
    const raw = sessionStorage.getItem(REDIRECT_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StashedRedirect>;
    if (typeof parsed?.path !== 'string' || typeof parsed?.at !== 'number') return null;
    if (Date.now() - parsed.at > REDIRECT_TTL_MS) return null;

    return parsed.path;
  } catch {
    // Unparseable or unavailable storage — fall back to the default destination.
    return null;
  }
}

/**
 * Gate an action behind authentication. Call `ensureAuth()` at the top of a
 * protected action (checkout, buy now, grant submit): if the user is signed in
 * it returns true; otherwise it stashes the current location, opens the
 * centered login prompt, and returns false so the caller can bail out.
 *
 * Pass a `PendingAction` to also remember what the user was doing, so the page
 * can restore it when they come back instead of making them start over.
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const { open } = useAuthPrompt();

  const ensureAuth = (action?: PendingAction): boolean => {
    if (isAuthenticated) return true;
    try {
      sessionStorage.setItem(REDIRECT_KEY, window.location.pathname + window.location.search);
    } catch {
      // ignore storage errors (private mode)
    }
    // Always overwrite: a leftover action from an earlier gate must not fire
    // after some unrelated one.
    if (action) setPendingAction(action);
    else clearPendingAction();
    open();
    return false;
  };

  // isLoading matters for anything that *renders* differently when signed out:
  // the session restores asynchronously, so gating on `!isAuthenticated` alone
  // flashes a signed-out state at users who are in fact signed in.
  return { ensureAuth, isAuthenticated, isLoading };
}

/**
 * Remember where to return after signing in. `ensureAuth` does this for gated
 * actions; page-level guards that redirect to /login outright need it directly.
 */
export function stashPostLoginRedirect(
  path: string = window.location.pathname + window.location.search,
) {
  if (NON_RETURNABLE.some((p) => path.startsWith(p))) return;
  try {
    const entry: StashedRedirect = { path, at: Date.now() };
    sessionStorage.setItem(REDIRECT_KEY, JSON.stringify(entry));
  } catch {
    // ignore storage errors (private mode)
  }
}

/** Read (without clearing) the stashed post-login destination, defaulting to '/'. */
export function peekPostLoginRedirect(): string {
  return readStash() ?? '/';
}

/**
 * Read and clear the stashed post-login destination. Returns null when there is
 * nothing fresh to return to, so the caller sends the user to the home page.
 */
export function takePostLoginRedirect(): string | null {
  const dest = readStash();
  try {
    sessionStorage.removeItem(REDIRECT_KEY);
  } catch {
    // ignore storage errors (private mode)
  }
  return dest;
}
