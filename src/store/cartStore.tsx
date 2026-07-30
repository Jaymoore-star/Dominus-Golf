import React, {
  createContext,
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
    .map((line) => {
      const product = products.find((p) => p.id === line.id);
      if (!product) return null;
      return { product, quantity: Math.max(1, Math.floor(line.quantity)) };
    })
    .filter((item): item is CartItem => item !== null);
}

/** The shape stored on the account: ids and quantities only. */
function itemsToLines(items: CartItem[]): StoredCartLine[] {
  return items.map((item) => ({ id: item.product.id, quantity: item.quantity }));
}

// Persist only ids + quantities; product details are rehydrated from the live
// catalog on load so prices/names never go stale.
function loadPersistedItems(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { id: string; quantity: number }[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => {
        const product = products.find((p) => p.id === entry.id);
        if (!product) return null;
        const quantity = Math.max(1, Math.floor(Number(entry.quantity) || 1));
        return { product, quantity };
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
    }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore quota / private-mode errors
  }
}

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
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
      const existing = state.items.find(
        (item) => item.product.id === action.product.id,
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (item) => item.product.id !== action.productId,
        ),
      };
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.product.id !== action.productId,
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.productId
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
  addItem: (product: Product, opts?: { track?: boolean }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
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

  const addItem = (product: Product, opts?: { track?: boolean }) => {
    dispatch({ type: 'ADD_ITEM', product });
    if (opts?.track !== false) trackAddToCart(product);
  };
  const removeItem = (productId: string) =>
    dispatch({ type: 'REMOVE_ITEM', productId });
  const updateQuantity = (productId: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

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
