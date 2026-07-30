import { products } from '../data/products';
import { useWishlist } from '../store/wishlistStore';

/**
 * The wishlist rehydrated into full products from the live catalog, preserving
 * save order. Ids that no longer match a product are dropped, so a discontinued
 * item disappears from the list instead of rendering a blank card.
 */
export function useSavedProducts() {
  const { ids } = useWishlist();

  return ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[number] => Boolean(p));
}
