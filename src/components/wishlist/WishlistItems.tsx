import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { useSavedProducts } from '../../hooks/useSavedProducts';
import { ProductCard } from '../ui/ProductCard';

/**
 * The wishlist body: empty state or product grid. Shared by the standalone
 * /wishlist page and the /account/wishlist panel so the two cannot drift.
 *
 * `variant` only changes the framing — "panel" is bordered like the other
 * account cards and drops to three columns, since the account sidebar leaves
 * the content column too narrow for four.
 */
export function WishlistItems({ variant = 'page' }: { variant?: 'page' | 'panel' }) {
  const saved = useSavedProducts();
  const isPanel = variant === 'panel';

  if (saved.length === 0) {
    return (
      <div className={isPanel ? 'border border-border p-10 sm:p-16 text-center' : 'text-center py-20'}>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
          <Heart size={26} className="text-muted-foreground" />
        </div>
        <p className="font-serif text-2xl font-bold text-foreground mb-3">
          Your wishlist is empty
        </p>
        <p className="font-sans text-sm text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
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
    );
  }

  return (
    <div
      className={`grid grid-cols-2 gap-x-5 gap-y-8 ${
        isPanel ? 'sm:grid-cols-3' : 'sm:grid-cols-3 lg:grid-cols-4'
      }`}
    >
      {saved.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
