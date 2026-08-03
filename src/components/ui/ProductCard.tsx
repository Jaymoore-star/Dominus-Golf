import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingBag, Heart, Loader2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Product } from '../../data/products';
import { useCart } from '../../store/cartStore';
import { useWishlist } from '../../store/wishlistStore';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { useReviewSummaries } from '../../hooks/useProductReviews';
import { createCheckoutSession } from '../../lib/checkout';
import { resolveCardVariant, variantLabel, variantDescriptor } from '../../lib/productVariants';
import { trackBeginCheckout } from '../../lib/analytics';

interface ProductCardProps {
  product: Product;
  aspectRatio?: 'square' | 'portrait';
}

export function ProductCard({ product, aspectRatio = 'square' }: ProductCardProps) {
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { ensureAuth } = useRequireAuth();
  const navigate = useNavigate();
  const { summaryFor } = useReviewSummaries();
  const rating = summaryFor(product.id);

  // Apparel has five sizes and this card has no picker, so those products
  // route to the product page instead of entering the bag without a size.
  const { requiresChoice, variant } = resolveCardVariant(product);

  const goToProduct = (message: string) => {
    toast(message);
    void navigate({ to: '/product/$id', params: { id: product.id } });
  };
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (requiresChoice) return goToProduct(`Choose a ${variantLabel(product).toLowerCase()} first`);
    addItem(product, { variant });
    // Deliberately does not open the bag. Being yanked into the drawer on
    // every add interrupts browsing; the toast confirms it just as well.
    toast.success('Added to bag');
  };

  /** See ApparelProductCard — no pending action, since `buyNow` replays on the
      product page and needs a size this card cannot offer. */
  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (requiresChoice) return goToProduct(`Choose a ${variantLabel(product).toLowerCase()} first`);
    if (!ensureAuth()) return;
    setIsBuyingNow(true);
    try {
      trackBeginCheckout([{ product, quantity: 1 }]);
      const url = await createCheckoutSession([
        {
          name: product.name,
          variant: variantDescriptor(product, variant),
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ]);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not start checkout');
    } finally {
      setIsBuyingNow(false);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
    toast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist', {
      icon: '♥',
    });
  };

  const aspectClass =
    aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square';

  return (
    <Link to="/product/$id" params={{ id: product.id }} className="flex h-full flex-col group product-card">
      <div className={`relative ${aspectClass} shrink-0 overflow-hidden bg-white border border-border`}>
        <img
          src={product.image}
          alt={product.name}
          className="product-image w-full h-full object-contain p-3 transition-transform duration-300"
        />

        {/* Wishlist toggle */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm text-foreground hover:bg-white transition-colors"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
        >
          <Heart
            size={16}
            className={wishlisted ? 'fill-accent text-accent' : 'text-foreground'}
          />
        </button>

        {/* Badge */}
        {product.badge && (
          <div className={`absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase font-sans ${
            product.badge === 'Out of Stock'
              ? 'bg-muted-foreground text-white'
              : 'bg-accent text-accent-foreground'
          }`}>
            {product.badge}
          </div>
        )}
      </div>

      {/* Product Info */}
      {/* flex-1 + mt-auto on the buttons keeps every card in a row the same
          height with its actions aligned, whether or not it has a rating. */}
      <div className="pt-3 pb-1 flex flex-1 flex-col">
        {product.subcategory && (
          <p className="text-[10px] font-sans font-medium tracking-widest uppercase text-muted-foreground mb-1">
            {product.subcategory}
          </p>
        )}
        {/* Name and price share a row from sm up, which keeps the card short
            enough for the two buttons underneath. They stack on a phone: the
            grid is 2-up there, so sharing a ~161px row left the name about
            107px and truncated nearly every product. min-w-0 is what lets the
            name truncate inside the flex row rather than widening it. */}
        <div className="flex flex-col items-start gap-0.5 mb-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
          <h3
            title={product.name}
            className="font-serif text-base font-semibold text-foreground leading-tight min-w-0 truncate group-hover:text-accent transition-colors duration-200"
          >
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 shrink-0">
            <span className="font-sans font-semibold text-sm text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="font-sans text-xs text-muted-foreground line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Real customer reviews only. Absent until someone writes one, so a
            product with no reviews shows no stars rather than an invented 4.9. */}
        {rating && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={
                    i < Math.round(rating.average)
                      ? 'fill-accent text-accent'
                      : 'text-border fill-border'
                  }
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground font-sans">
              {rating.average} ({rating.count.toLocaleString()})
            </span>
          </div>
        )}

        {/* Always visible, rather than the old panel that slid up over the photo
            on hover — that was unreachable on touch and hid the product.

            Stacked below lg. Side by side, a card on a 375px phone gives each
            button ~77px while "Add to Bag" plus its icon needs ~90px, so the
            label wrapped. lg rather than md because the related-products grid
            on a product page is 4-up from sm, where even a md card is only ~165px.
            Taller rows also give a proper 44px touch target. */}
        <div className="grid grid-cols-1 gap-2 mt-auto pt-3 lg:grid-cols-2">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex items-center justify-center gap-1.5 py-3 lg:py-2.5 border border-foreground font-sans text-[10px] font-semibold tracking-widest uppercase text-foreground hover:bg-foreground hover:text-background transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-foreground"
          >
            <ShoppingBag size={12} />
            Add to Bag
          </button>
          <button
            onClick={handleBuyNow}
            disabled={!product.inStock || isBuyingNow}
            className="flex items-center justify-center gap-1.5 py-3 lg:py-2.5 bg-primary font-sans text-[10px] font-semibold tracking-widest uppercase text-primary-foreground hover:bg-primary/90 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isBuyingNow ? <Loader2 size={12} className="animate-spin" /> : 'Buy Now'}
          </button>
        </div>
      </div>
    </Link>
  );
}
