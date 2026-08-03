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
import { displayProductName } from '../../lib/productName';

interface ApparelProductCardProps {
  product: Product;
}

const COLOR_ORDER = ['Black', 'White'] as const;

export function ApparelProductCard({ product }: ApparelProductCardProps) {
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

  const colors = product.colorVariants
    ? COLOR_ORDER.filter((c) => c in product.colorVariants!)
    : [];

  const defaultColor = colors[0] ?? null;
  const [selectedColor, setSelectedColor] = useState<string | null>(defaultColor);

  const displayImage =
    selectedColor && product.colorVariants?.[selectedColor]
      ? product.colorVariants[selectedColor]
      : product.image;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (requiresChoice) return goToProduct(`Choose a ${variantLabel(product).toLowerCase()} first`);
    addItem(product, { variant });
    // Deliberately does not open the bag. Being yanked into the drawer on
    // every add interrupts browsing; the toast confirms it just as well.
    toast.success('Added to bag');
  };

  /**
   * No pending action is stashed for the signed-out case. `buyNow` replays on the
   * product page and needs a chosen size, which this card has no way to offer —
   * so the auth gate just returns the shopper here and lets them click again.
   */
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

  return (
    <Link to="/product/$id" params={{ id: product.id }} className="flex h-full flex-col group product-card">
      {/* Image */}
      <div className="relative aspect-square shrink-0 overflow-hidden bg-white border border-border">
        <img
          src={displayImage}
          alt={`${product.name}${selectedColor ? ` - ${selectedColor}` : ''}`}
          className="w-full h-full object-contain p-3 transition-all duration-300 group-hover:scale-105"
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
          <div
            className={`absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase font-sans ${
              product.badge === 'Out of Stock' || product.badge === 'Sold Out'
                ? 'bg-muted-foreground text-white'
                : 'bg-accent text-accent-foreground'
            }`}
          >
            {product.badge}
          </div>
        )}

      </div>

      {/* Color selector */}
      {colors.length > 0 && (
        <div
          className="flex items-center gap-2 px-0.5 pt-3"
          onClick={(e) => e.preventDefault()}
        >
          {colors.map((color) => (
            <button
              key={color}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedColor(color);
              }}
              title={color}
              className={`relative px-3 py-1 font-sans text-[10px] font-semibold tracking-wider uppercase border transition-colors duration-150 ${
                selectedColor === color
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      )}

      {/* Product info */}
      {/* flex-1 + mt-auto on the buttons keeps every card in a row the same
          height with its actions aligned, whether or not it has a rating. */}
      <div className="pt-2 pb-1 flex flex-1 flex-col">
        {product.subcategory && (
          <p className="text-[10px] font-sans font-medium tracking-widest uppercase text-muted-foreground mb-1">
            {product.subcategory}
          </p>
        )}
        {/* Name and price share a row so the card stays short enough for the
            two action buttons underneath. min-w-0 is what lets the name
            actually truncate inside a flex row instead of forcing it wider. */}
        <div className="flex items-baseline justify-between gap-3 mb-1">
          <h3
            title={displayProductName(product.name)}
            className="font-serif text-base font-semibold text-foreground leading-tight min-w-0 truncate group-hover:text-accent transition-colors duration-200"
          >
            {displayProductName(product.name)}
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
            on hover — that was unreachable on touch and hid the product. */}
        <div className="grid grid-cols-2 gap-2 mt-auto pt-3">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex items-center justify-center gap-1.5 py-2.5 border border-foreground font-sans text-[10px] font-semibold tracking-widest uppercase text-foreground hover:bg-foreground hover:text-background transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-foreground"
          >
            <ShoppingBag size={12} />
            Add to Bag
          </button>
          <button
            onClick={handleBuyNow}
            disabled={!product.inStock || isBuyingNow}
            className="flex items-center justify-center gap-1.5 py-2.5 bg-primary font-sans text-[10px] font-semibold tracking-widest uppercase text-primary-foreground hover:bg-primary/90 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isBuyingNow ? <Loader2 size={12} className="animate-spin" /> : 'Buy Now'}
          </button>
        </div>
      </div>
    </Link>
  );
}
