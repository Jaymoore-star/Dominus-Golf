import React from 'react';
import { Star } from 'lucide-react';
import type { Product } from '../../../data/products';

interface ProductReviewsProps {
  product: Product;
}

export function ProductReviews({ product }: ProductReviewsProps) {
  const hasReviews = product.reviewCount && product.reviewCount > 0;
  const hasReviewCards = product.reviews && product.reviews.length > 0;

  if (!hasReviews) return null;

  return (
    <section id="reviews-section" className="mt-24 pt-16 border-t border-border">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-2">
            Customer Feedback
          </p>
          <h2 className="font-serif text-3xl font-bold text-foreground">
            Verified Reviews
          </h2>
        </div>

        <div className="flex items-center gap-4 bg-muted px-6 py-4 border border-border">
          <div className="text-center border-r border-border pr-6">
            <p className="text-2xl font-bold text-foreground">{product.rating}</p>
            <div className="flex items-center gap-0.5 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={
                    i < Math.floor(product.rating!)
                      ? 'fill-accent text-accent'
                      : 'text-border fill-border'
                  }
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Based on {product.reviewCount?.toLocaleString()} reviews
            </p>
            <p className="text-[10px] text-muted-foreground tracking-wide uppercase mt-0.5">
              98% of customers recommend
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hasReviewCards ? (
          product.reviews!.map((review) => (
            <div
              key={review.id}
              className="bg-muted/30 border border-border p-8 flex flex-col"
            >
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={
                      i < review.rating
                        ? 'fill-accent text-accent'
                        : 'text-border fill-border'
                    }
                  />
                ))}
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-3">
                {review.title}
              </h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed flex-1 mb-6 italic">
                "{review.body}"
              </p>
              <div className="flex items-center justify-between pt-6 border-t border-border/50">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {review.author}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    {review.date}
                  </p>
                </div>
                {review.verified && (
                  <span className="text-[9px] font-bold text-accent tracking-widest uppercase flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-accent" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center border border-dashed border-border">
            <p className="font-sans text-muted-foreground">
              No featured reviews yet for this product.
            </p>
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <button className="font-sans text-xs font-semibold tracking-widest uppercase border border-border px-10 py-4 hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
          Read All {product.reviewCount?.toLocaleString()} Reviews
        </button>
      </div>
    </section>
  );
}
