import { useAuth } from './useAuth';
import { useAuthPrompt } from '../store/authPromptStore';

const REDIRECT_KEY = 'postLoginRedirect';

/**
 * Gate an action behind authentication. Call `ensureAuth()` at the top of a
 * protected action (checkout, buy now, grant submit): if the user is signed in
 * it returns true; otherwise it stashes the current location, opens the
 * centered login prompt, and returns false so the caller can bail out.
 */
export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const { open } = useAuthPrompt();

  const ensureAuth = (): boolean => {
    if (isAuthenticated) return true;
    try {
      sessionStorage.setItem(REDIRECT_KEY, window.location.pathname + window.location.search);
    } catch {
      // ignore storage errors (private mode)
    }
    open();
    return false;
  };

  return { ensureAuth, isAuthenticated };
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
