import React from 'react';
import { Star, Minus, Plus, Loader2 } from 'lucide-react';
import type { Product } from '../../../data/products';

interface ProductInfoProps {
  product: Product;
  quantity: number;
  setQuantity: (q: number) => void;
  selectedVariant: string;
  setSelectedVariant: (v: string) => void;
  handleAddToCart: () => void;
  handleBuyNow: () => void;
  isBuyingNow: boolean;
  addedEffect: boolean;
  scrollToReviews: (e: React.MouseEvent) => void;
}

export function ProductInfo({
  product,
  quantity,
  setQuantity,
  selectedVariant,
  setSelectedVariant,
  handleAddToCart,
  handleBuyNow,
  isBuyingNow,
  addedEffect,
  scrollToReviews,
}: ProductInfoProps) {
  return (
    <div className="lg:pt-2">
      {product.badge && (
        <div className="inline-block mb-3 px-3 py-1 bg-accent text-accent-foreground font-sans font-semibold text-[10px] tracking-widest uppercase">
          {product.badge}
        </div>
      )}

      {product.subcategory && (
        <p className="font-sans text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-2">
          {product.subcategory}
        </p>
      )}

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">
        {product.name}
      </h1>

      {/* Rating — only shown if present */}
      {product.rating !== undefined && product.reviewCount !== undefined && (
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(product.rating!)
                    ? 'fill-accent text-accent'
                    : 'text-border fill-border'
                }
              />
            ))}
          </div>
          <a
            href="#reviews"
            onClick={scrollToReviews}
            className="font-sans text-sm text-muted-foreground hover:text-accent transition-colors underline underline-offset-4"
          >
            {product.rating} ({product.reviewCount.toLocaleString()} reviews)
          </a>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-border">
        <span className="font-sans text-2xl font-bold text-foreground">
          ${product.price.toFixed(2)}
        </span>
        {product.compareAtPrice && (
          <span className="font-sans text-sm text-muted-foreground line-through">
            ${product.compareAtPrice.toFixed(2)}
          </span>
        )}
        {product.compareAtPrice && (
          <span className="font-sans text-xs font-semibold text-destructive">
            Save ${(product.compareAtPrice - product.price).toFixed(2)}
          </span>
        )}
      </div>

      {/* Variants — new shape: { label, options[] } */}
      {product.variants && product.variants.length > 0 && (
        <div className="mb-6">
          {product.variants.map((variant) => (
            <div key={variant.label} className="mb-4">
              <p className="font-sans text-xs font-semibold tracking-widest uppercase text-foreground mb-3">
                {variant.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {variant.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedVariant(opt)}
                    className={`px-4 py-2 font-sans text-sm border transition-colors ${
                      selectedVariant === opt
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-foreground hover:border-foreground'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quantity */}
      <div className="mb-6">
        <p className="font-sans text-xs font-semibold tracking-widest uppercase text-foreground mb-3">
          Quantity
        </p>
        <div className="flex items-center border border-border w-fit">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-11 h-11 flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="w-12 h-11 flex items-center justify-center font-sans font-semibold text-sm border-x border-border">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-11 h-11 flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Add to Cart */}
      <div className="space-y-4">
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full py-4 font-sans font-semibold text-sm tracking-widest uppercase transition-colors duration-200 ${
            addedEffect
              ? 'bg-accent text-accent-foreground'
              : product.inStock
              ? 'btn-primary-black'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {!product.inStock
            ? 'Out of Stock'
            : addedEffect
            ? 'Added to Bag'
            : 'Add to Bag'}
        </button>

        {product.inStock && (
          <button
            onClick={handleBuyNow}
            disabled={isBuyingNow}
            className="block w-full py-4 font-sans font-semibold text-sm tracking-widest uppercase text-center btn-gold transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isBuyingNow ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Preparing…
              </>
            ) : (
              'Buy Now'
            )}
          </button>
        )}

        {/* Shopify-style Trust Info */}
        <div className="grid grid-cols-2 gap-4 py-6 border-y border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <Star size={14} className="fill-accent" />
            </div>
            <span className="font-sans text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
              Premium Quality
            </span>
          </div>
          
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="mb-8 p-5 bg-muted">
        <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
          Key Features
        </p>
        <ul className="space-y-2">
          {product.features.map((feat) => (
            <li key={feat} className="flex items-center gap-2.5">
              <span className="w-1 h-1 bg-accent shrink-0" />
              <span className="font-sans text-sm text-foreground">{feat}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
