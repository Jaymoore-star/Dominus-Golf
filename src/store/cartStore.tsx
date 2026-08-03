import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import type { Product } from '../data/products';
import { products } from '../data/products';
import { trackAddToCart } from '../lib/analytics';
import { useAuth } from '../hooks/useAuth';
import {
  cartLineKey,
  mergeCartLines,
  readCartLines,
  scheduleCartSync,
  type StoredCartLine,
} from '../lib/accountBaskets';
import {
  CART_STORAGE_KEY as STORAGE_KEY,
  onCartReset,
  readCartOwner,
  writeCartOwner,
} from '../lib/basketStorage';

/** Rehydrate stored lines into cart items, dropping ids no longer in the catalog. */
function linesToItems(lines: StoredCartLine[]): CartItem[] {
  return lines
    .map((line): CartItem | null => {
      const product = products.find((p) => p.id === line.id);
      if (!product) return null;
      return {
        product,
        quantity: Math.max(1, Math.floor(line.quantity)),
        variant: line.variant,
      };
    })
    .filter((item): item is CartItem => item !== null);
}

/** The shape stored on the account: ids and quantities only. */
function itemsToLines(items: CartItem[]): StoredCartLine[] {
  return items.map((item) => ({
    id: item.product.id,
    quantity: item.quantity,
    variant: item.variant,
  }));
}

// Persist only ids + quantities; product details are rehydrated from the live
// catalog on load so prices/names never go stale.
function loadPersistedItems(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredCartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry): CartItem | null => {
        const product = products.find((p) => p.id === entry.id);
        if (!product) return null;
        const quantity = Math.max(1, Math.floor(Number(entry.quantity) || 1));
        return {
          product,
          quantity,
          variant: typeof entry.variant === 'string' && entry.variant ? entry.variant : undefined,
        };
      })
      .filter((item): item is CartItem => item !== null);
  } catch {
    return [];
  }
}

function persistItems(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    const payload = items.map((item) => ({
      id: item.product.id,
      quantity: item.quantity,
      variant: item.variant,
    }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore quota / private-mode errors
  }
}

export type CartItem = {
  product: Product;
  quantity: number;
  /** Chosen size, when the product offers them. Part of the line identity. */
  variant?: string;
};

/** The same product in two sizes is two separate lines. */
export function lineKeyOf(item: CartItem): string {
  return cartLineKey(item.product.id, item.variant);
}

export type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; variant?: string }
  | { type: 'REMOVE_ITEM'; lineKey: string }
  | { type: 'UPDATE_QUANTITY'; lineKey: string; quantity: number }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'CLEAR_CART' }
  /** Wholesale replacement, for hydrating the account cart on sign-in. */
  | { type: 'SET_ITEMS'; items: CartItem[] };

const initialState: CartState = {
  items: [],
  isOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const key = cartLineKey(action.product.id, action.variant);
      const existing = state.items.find((item) => lineKeyOf(item) === key);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            lineKeyOf(item) === key
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { product: action.product, quantity: 1, variant: action.variant },
        ],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => lineKeyOf(item) !== action.lineKey),
      };
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => lineKeyOf(item) !== action.lineKey),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          lineKeyOf(item) === action.lineKey
            ? { ...item, quantity: action.quantity }
            : item,
        ),
      };
    }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_ITEMS':
      return { ...state, items: action.items };
    default:
      return state;
  }
}

type CartContextValue = {
  state: CartState;
  /**
   * Adds one unit. Callers adding several units in a loop should pass
   * `{ track: false }` and fire a single trackAddToCart with the real quantity,
   * so analytics records one add-to-cart rather than one per unit.
   */
  addItem: (product: Product, opts?: { track?: boolean; variant?: string }) => void;
  /** Keyed by line, not product — see lineKeyOf. */
  removeItem: (lineKey: string) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialState,
    (init) => ({ ...init, items: loadPersistedItems() }),
  );

  const { user } = useAuth();

  /** See wishlistStore: keyed by user id so saving cannot re-trigger the merge. */
  const hydratedFor = useRef<string | null>(null);
  const syncArmed = useRef(false);
  const itemsRef = useRef(state.items);

  // Save cart contents whenever they change.
  useEffect(() => {
    itemsRef.current = state.items;
    persistItems(state.items);
  }, [state.items]);

  // Signing in: fold the guest cart into the account's, then write the result
  // back. Merging rather than replacing matters here — the common path is adding
  // to the cart and only then signing in to check out.
  useEffect(() => {
    if (!user) {
      hydratedFor.current = null;
      syncArmed.current = false;
      return;
    }
    if (hydratedFor.current === user.id) return;

    hydratedFor.current = user.id;
    syncArmed.current = true;

    // A cart already marked as this account's is a reload, not a guest cart, so
    // quantities must not be summed again.
    const localIsSameAccount = readCartOwner() === user.id;
    writeCartOwner(user.id);

    dispatch({
      type: 'SET_ITEMS',
      items: linesToItems(
        mergeCartLines(
          readCartLines(user.metadata),
          itemsToLines(itemsRef.current),
          localIsSameAccount,
        ),
      ),
    });
  }, [user]);

  useEffect(
    () =>
      onCartReset(() => {
        syncArmed.current = false;
        dispatch({ type: 'CLEAR_CART' });
      }),
    [],
  );

  // Mirror customer edits up to the account. Skipped until hydration has armed
  // it, so this never fires for a guest or during sign-out.
  useEffect(() => {
    if (!syncArmed.current) return;
    scheduleCartSync(itemsToLines(state.items));
  }, [state.items]);

  /**
   * These are memoised because consumers put them in effect dependency arrays,
   * and a fresh identity on every render makes those effects re-run on every
   * cart change. The bag's Back-button handler was the casualty: removing a line
   * re-rendered the provider, which re-ran the effect, whose cleanup called
   * history.back() — and the resulting popstate landed on the newly registered
   * listener and closed the bag. Deleting an item shut the drawer.
   *
   * `dispatch` is stable across renders, so an empty dependency list is correct.
   */
  const addItem = useCallback(
    (product: Product, opts?: { track?: boolean; variant?: string }) => {
      dispatch({ type: 'ADD_ITEM', product, variant: opts?.variant });
      if (opts?.track !== false) trackAddToCart(product);
    },
    [],
  );
  const removeItem = useCallback(
    (lineKey: string) => dispatch({ type: 'REMOVE_ITEM', lineKey }),
    [],
  );
  const updateQuantity = useCallback(
    (lineKey: string, quantity: number) =>
      dispatch({ type: 'UPDATE_QUANTITY', lineKey, quantity }),
    [],
  );
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), []);
  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), []);
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);

  const total = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const itemCount = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        toggleCart,
        openCart,
        closeCart,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
