import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  mergeWishlistIds,
  readWishlistIds,
  scheduleWishlistSync,
} from '../lib/accountBaskets';
import { WISHLIST_STORAGE_KEY as STORAGE_KEY, onWishlistReset } from '../lib/basketStorage';

function loadPersistedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string');
  } catch {
    return [];
  }
}

type WishlistContextValue = {
  ids: string[];
  count: number;
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(loadPersistedIds);
  const { user } = useAuth();

  /**
   * Which user id the account list has been merged in for. Keyed by id rather
   * than a boolean because `updateUser` re-emits the auth state with fresh
   * metadata — without this, saving would re-trigger hydration and the cart's
   * quantity merge would compound on every write.
   */
  const hydratedFor = useRef<string | null>(null);

  /**
   * Only pushes to the account once this device's list represents that account.
   * Hydration arms it; sign-out disarms it before clearing, which is what stops
   * a sign-out from being pushed up as "the customer emptied their wishlist".
   */
  const syncArmed = useRef(false);

  /** Latest ids, so the merge below can read them without depending on `ids`. */
  const idsRef = useRef(ids);

  useEffect(() => {
    idsRef.current = ids;

    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // ignore quota / private-mode errors
    }
  }, [ids]);

  // Signing in: fold whatever was saved as a guest into the account's list, then
  // write the result back so those guest additions are kept.
  useEffect(() => {
    if (!user) {
      hydratedFor.current = null;
      syncArmed.current = false;
      return;
    }
    if (hydratedFor.current === user.id) return;

    hydratedFor.current = user.id;
    // Arming before the state change lets the mirror effect below do the write,
    // which also persists the merge itself.
    syncArmed.current = true;
    setIds(mergeWishlistIds(readWishlistIds(user.metadata), idsRef.current));
  }, [user]);

  useEffect(
    () =>
      onWishlistReset(() => {
        syncArmed.current = false;
        setIds([]);
      }),
    [],
  );

  // Mirror customer edits up to the account. Skipped until hydration has armed
  // it, so this never fires for a guest or during sign-out.
  useEffect(() => {
    if (!syncArmed.current) return;
    scheduleWishlistSync(ids);
  }, [ids]);

  const isWishlisted = useCallback(
    (productId: string) => ids.includes(productId),
    [ids],
  );

  const toggle = useCallback((productId: string) => {
    setIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const value = useMemo<WishlistContextValue>(
    () => ({ ids, count: ids.length, isWishlisted, toggle, remove, clear }),
    [ids, isWishlisted, toggle, remove, clear],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
