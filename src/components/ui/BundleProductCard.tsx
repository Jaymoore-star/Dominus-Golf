import { Link } from '@tanstack/react-router';
import { ShoppingBag, Star } from 'lucide-react';
import type { Product } from '../../data/products';
import { useCart } from '../../store/cartStore';

interface BundleProductCardProps {
  product: Product;
}

export function BundleProductCard({ product }: BundleProductCardProps) {
  const { addItem, openCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    openCart();
  };

  return (
    <Link to={`/product/$id`} params={{ id: product.id }} className="block group product-card">
      {/* Main product image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="product-image w-full h-full object-contain p-3 transition-transform duration-300"
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

        {/* Add to Cart overlay */}
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

      {/* Included items strip — only shown when includedImages exist */}
      {product.includedImages && product.includedImages.length > 0 && (
        <div className="border-x border-b border-border bg-muted/50 px-3 py-3">
          <p className="font-sans text-[9px] font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-2">
            Also Includes
          </p>
          <div className="flex items-center gap-2">
            {product.includedImages.map((item, i) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 bg-background border border-border flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.label}
                      className="w-full h-full object-contain p-1"
                      loading="lazy"
                    />
                  </div>
                  <span className="font-sans text-[8px] text-muted-foreground text-center leading-tight max-w-[40px]">
                    {item.label}
                  </span>
                </div>
                {i < product.includedImages!.length - 1 && (
                  <span className="text-muted-foreground/50 text-xs pb-3">+</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product info */}
      <div className="pt-3 pb-1">
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
