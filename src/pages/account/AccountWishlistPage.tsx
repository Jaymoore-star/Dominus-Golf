import { AccountLayout } from './AccountLayout';
import { WishlistItems } from '../../components/wishlist/WishlistItems';
import { useSavedProducts } from '../../hooks/useSavedProducts';

/**
 * Wishlist rendered inside the account chrome, so the sidebar stays put when a
 * signed-in member clicks through to it. The standalone /wishlist page is still
 * the destination for the navbar heart, which guests use too — the wishlist
 * itself lives in localStorage and needs no account.
 */
export function AccountWishlistPage() {
  const saved = useSavedProducts();

  return (
    <AccountLayout
      active="wishlist"
      title="Wishlist"
      description={
        saved.length > 0
          ? `${saved.length} ${saved.length === 1 ? 'item' : 'items'} saved for later.`
          : 'Products you have saved at Dominus Golf.'
      }
    >
      <WishlistItems variant="panel" />
    </AccountLayout>
  );
}
