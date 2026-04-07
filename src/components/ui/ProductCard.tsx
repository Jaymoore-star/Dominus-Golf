import { Link } from '@tanstack/react-router';
import { ShoppingBag, Star } from 'lucide-react';
import type { Product } from '../../data/products';
import { useCart } from '../../store/cartStore';

interface ProductCardProps {
  product: Product;
  aspectRatio?: 'square' | 'portrait';
}

export function ProductCard({ product, aspectRatio = 'square' }: ProductCardProps) {
  const { addItem, openCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    openCart();
  };

  const aspectClass =
    aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square';

  return (
    <Link to={`/product/$id`} params={{ id: product.id }} className="block group product-card">
      <div className={`relative ${aspectClass} overflow-hidden bg-muted`}>
        <img
          src={product.image}
          alt={product.name}
          className="product-image w-full h-full object-cover"
        />

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

      {/* Product Info */}
      <div className="pt-3 pb-1">
        {product.subcategory && (
          <p className="text-[10px] font-sans font-medium tracking-widest uppercase text-muted-foreground mb-1">
            {product.subcategory}
          </p>
        )}
        <h3 className="font-serif text-base font-semibold text-foreground leading-tight mb-1 group-hover:text-accent transition-colors duration-200">
          {product.name}
        </h3>

        {/* Rating — only shown if present */}
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

        {/* Price */}
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
