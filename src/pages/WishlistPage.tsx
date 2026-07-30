import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { WishlistItems } from '../components/wishlist/WishlistItems';
import { useSavedProducts } from '../hooks/useSavedProducts';

/**
 * Standalone wishlist, reachable by anyone — the navbar heart points here and
 * the list lives in localStorage, so it works signed out. Signed-in members get
 * the same list inside the account chrome at /account/wishlist.
 */
export function WishlistPage() {
  const saved = useSavedProducts();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-2">
            Your Saved Items
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Wishlist
          </h1>
          {saved.length > 0 && (
            <p className="font-sans text-sm text-muted-foreground mt-2">
              {saved.length} {saved.length === 1 ? 'item' : 'items'} saved
            </p>
          )}
        </div>

        <WishlistItems />
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
