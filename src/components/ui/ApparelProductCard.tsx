import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ShoppingBag, Star } from 'lucide-react';
import type { Product } from '../../data/products';
import { useCart } from '../../store/cartStore';

interface ApparelProductCardProps {
  product: Product;
}

const COLOR_ORDER = ['Black', 'White'] as const;

export function ApparelProductCard({ product }: ApparelProductCardProps) {
  const { addItem, openCart } = useCart();

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
    addItem(product);
    openCart();
  };

  return (
    <Link to={`/product/$id`} params={{ id: product.id }} className="block group product-card">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-white border border-border">
        <img
          src={displayImage}
          alt={`${product.name}${selectedColor ? ` — ${selectedColor}` : ''}`}
          className="w-full h-full object-contain p-3 transition-all duration-300 group-hover:scale-105"
        />

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

        {/* Add to cart overlay */}
        <div className="product-card-overlay absolute bottom-0 left-0 right-0 p-3 bg-primary">
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 text-primary-foreground text-xs font-semibold tracking-widest uppercase font-sans py-1"
          >
            <ShoppingBag size={14} />
            Add to Bag
          </button>
        </div>
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
      <div className="pt-2 pb-1">
        {product.subcategory && (
          <p className="text-[10px] font-sans font-medium tracking-widest uppercase text-muted-foreground mb-1">
            {product.subcategory}
          </p>
        )}
        <h3 className="font-serif text-base font-semibold text-foreground leading-tight mb-1 group-hover:text-accent transition-colors duration-200">
          {product.name}
        </h3>

        {product.rating !== undefined && product.reviewCount !== undefined && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={
                    i < Math.floor(product.rating!)
                      ? 'fill-accent text-accent'
                      : 'text-border fill-border'
                  }
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground font-sans">
              ({product.reviewCount.toLocaleString()})
            </span>
          </div>
        )}

        <div className="flex items-baseline gap-2">
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
    </Link>
  );
}
