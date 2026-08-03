import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Product } from '../../../data/products';
import { useAuth } from '../../../hooks/useAuth';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { displayProductName } from '../../../lib/productName';
import { useProductReviews } from '../../../hooks/useProductReviews';
import {
  saveProductReview,
  formatReviewDate,
} from '../../../lib/reviews';

interface ProductReviewsProps {
  product: Product;
}

function Stars({ value, size = 12 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.floor(value) ? 'fill-accent text-accent' : 'text-border fill-border'}
        />
      ))}
    </div>
  );
}

/** Star picker. A radio group rather than buttons so it is keyboard and screen-reader operable. */
function RatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div role="radiogroup" aria-label="Rating" className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n === 1 ? '' : 's'}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Star
            size={22}
            className={n <= shown ? 'fill-accent text-accent' : 'text-border fill-border'}
          />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({ product }: ProductReviewsProps) {
  const { user, isAuthenticated } = useAuth();
  const { ensureAuth } = useRequireAuth();

  const { reviews, isLoading: loading, unavailable, summary, refresh } =
    useProductReviews(product.id);

  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);


  const openForm = () => {
    if (!ensureAuth()) return;
    setRating(5);
    setTitle('');
    setBody('');
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error('Add a headline and a few words about the product.');
      return;
    }
    setSaving(true);
    try {
      const authorName = user?.displayName?.trim() || user?.email?.split('@')[0] || 'Customer';
      await saveProductReview({ productId: product.id, rating, title, body }, authorName);
      toast.success('Thanks for your review.');
      setFormOpen(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save your review.');
    } finally {
      setSaving(false);
    }
  };



  // Real customer reviews are the only source. The seeded example reviews and
  // hardcoded 4.9/87-review figures were removed from the product data: they
  // were fabricated, and they were also being emitted as aggregateRating
  // structured data, which Google treats as review spam.
  const showingReal = reviews.length > 0;
  const headlineRating = summary?.average;
  const headlineCount = summary?.count ?? 0;

  const inputClass =
    'w-full border border-border bg-background px-4 py-3 font-sans text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors';

  return (
    <section id="reviews-section" className="mt-24 pt-16 border-t border-border">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-2">
            Customer Feedback
          </p>
          <h2 className="font-serif text-3xl font-bold text-foreground">Reviews</h2>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {headlineRating !== undefined && headlineCount > 0 && (
            <div className="flex items-center gap-4 bg-muted px-6 py-4 border border-border">
              <div className="text-center border-r border-border pr-6">
                <p className="text-2xl font-bold text-foreground">{headlineRating}</p>
                <div className="mt-1">
                  <Stars value={headlineRating} />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Based on {headlineCount.toLocaleString()}{' '}
                  {headlineCount === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>
          )}

          {!unavailable && (
            <button
              onClick={openForm}
              className="font-sans text-xs font-semibold tracking-widest uppercase bg-primary text-primary-foreground px-8 py-4 hover:bg-primary/90 transition-colors duration-200"
            >
              Write a Review
            </button>
          )}
        </div>
      </div>

      {formOpen && isAuthenticated && (
        <form onSubmit={handleSubmit} className="mb-12 border border-border bg-muted/40 p-6 sm:p-8">
          <h3 className="font-serif text-xl font-bold text-foreground mb-6">
            {`Review ${displayProductName(product.name)}`}
          </h3>

          <div className="mb-6">
            <label className="block font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-2">
              Your rating
            </label>
            <RatingInput value={rating} onChange={setRating} />
          </div>

          <div className="mb-6">
            <label
              htmlFor="review-title"
              className="block font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-2"
            >
              Headline
            </label>
            <input
              id="review-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder="Sum it up in a few words"
              className={inputClass}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="review-body"
              className="block font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-2"
            >
              Your review
            </label>
            <textarea
              id="review-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={4000}
              rows={5}
              placeholder="What did you think? How did it perform?"
              className={`${inputClass} resize-y`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 font-sans text-xs font-semibold tracking-widest uppercase bg-primary text-primary-foreground px-8 py-3.5 hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="font-sans text-xs font-semibold tracking-widest uppercase border border-border px-8 py-3.5 text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-16 text-center">
          <Loader2 size={20} className="animate-spin mx-auto text-muted-foreground" />
        </div>
      ) : showingReal ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-muted/30 border border-border p-8 flex flex-col">
              <div className="mb-4">
                <Stars value={review.rating} />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-3">{review.title}</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed flex-1 mb-6 whitespace-pre-line">
                {review.body}
              </p>
              <div className="flex items-center justify-between pt-6 border-t border-border/50">
                <div>
                  <p className="text-sm font-semibold text-foreground">{review.authorName}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    {formatReviewDate(review.createdAt)}
                  </p>
                </div>
                {user?.id === review.userId && (
                  <span className="text-[9px] font-bold text-accent tracking-widest uppercase">
                    Your review
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center border border-dashed border-border">
          <p className="font-sans text-muted-foreground mb-4">
            No reviews yet for this product.
          </p>
          {!unavailable && (
            <button
              onClick={openForm}
              className="font-sans text-xs font-semibold tracking-widest uppercase border border-border px-8 py-3.5 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Be the first to review
            </button>
          )}
        </div>
      )}
    </section>
  );
}
