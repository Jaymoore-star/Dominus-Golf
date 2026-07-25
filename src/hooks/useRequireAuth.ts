import { useAuth } from './useAuth';
import { useAuthPrompt } from '../store/authPromptStore';
import { type PendingAction, setPendingAction, clearPendingAction } from '../lib/pendingAction';

const REDIRECT_KEY = 'postLoginRedirect';

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
  try {
    sessionStorage.setItem(REDIRECT_KEY, path);
  } catch {
    // ignore storage errors (private mode)
  }
}

/** Read (without clearing) the stashed post-login destination, defaulting to '/'. */
export function peekPostLoginRedirect(): string {
  try {
    return sessionStorage.getItem(REDIRECT_KEY) || '/';
  } catch {
    return '/';
  }
}

/** Read and clear the stashed post-login destination. */
export function takePostLoginRedirect(): string | null {
  try {
    const dest = sessionStorage.getItem(REDIRECT_KEY);
    sessionStorage.removeItem(REDIRECT_KEY);
    return dest;
  } catch {
    return null;
  }
}
