import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { products } from '../data/products';
import { useWishlist } from '../store/wishlistStore';
import { ProductCard } from '../components/ui/ProductCard';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

export function WishlistPage() {
  const { ids } = useWishlist();

  // Rehydrate from the live catalog, preserving save order.
  const saved = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[number] => Boolean(p));

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

        {saved.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
              <Heart size={26} className="text-muted-foreground" />
            </div>
            <p className="font-serif text-2xl text-foreground mb-3">
              Your wishlist is empty
            </p>
            <p className="font-sans text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
              Tap the heart on any product to save it here for later.
            </p>
            <Link
              to="/shop/$category"
              params={{ category: 'all' }}
              className="inline-flex items-center justify-center bg-primary text-primary-foreground font-sans text-[13px] font-semibold tracking-[0.15em] uppercase px-8 py-4 hover:opacity-90 transition-opacity"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
            {saved.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
