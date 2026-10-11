import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchProductReviews,
  fetchReviewSummaries,
  summariseReviews,
  type ProductReview,
  type ReviewsResult,
  type ReviewSummary,
} from '../lib/reviews';
import { REVIEW_SNAPSHOT, REVIEW_SUMMARIES } from '../data/reviewSummaries.generated';

export const productReviewsKey = (productId: string) => ['product-reviews', productId] as const;
export const reviewSummariesKey = ['product-review-summaries'] as const;

/*
 * Both queries start from the build-time snapshot (scripts/fetch-review-summaries.mjs)
 * rather than from nothing. The prerenderer never runs a queryFn, so without
 * initialData the static HTML held a spinner where the reviews go, and Google
 * saw stars in the schema with no review text on the page. Every product gets
 * an entry, an empty one when it has no reviews, so the HTML says "No reviews
 * yet" instead of spinning.
 *
 * initialDataUpdatedAt: 0 marks the snapshot as already stale, so the live
 * fetch still runs on mount and replaces it. The snapshot is the first paint,
 * never the answer.
 */
const snapshotSummaries = () => new Map(Object.entries(REVIEW_SUMMARIES));

/*
 * How long a visitor's browser reuses each answer before asking Supabase again.
 * These two reads are the only public data every visitor fetches (pg_stat_statements,
 * 10 Oct 2026: ~1,550 summary and ~780 per-product calls since July), and reviews
 * change a few times a year. Someone else's new review reaching this visitor a few
 * minutes late is harmless; the reviewer's own new or edited review is never
 * late, because ProductReviews calls refresh() after saving, which invalidates
 * both queries in their browser.
 *
 * This is the per-browser layer. Behind it, the fetches read through the shared
 * edge cache in worker/index.ts (one minute), which the reviewer's own browser
 * skips right after a write (src/lib/reviews.ts). Worst case, another visitor
 * sees a new review about six minutes after it was posted.
 */
const SUMMARIES_STALE_MS = 5 * 60_000;
const PRODUCT_REVIEWS_STALE_MS = 2 * 60_000;

function snapshotReviews(productId: string): ReviewsResult {
  const reviews: ProductReview[] = (REVIEW_SNAPSHOT[productId] ?? []).map((review) => ({
    ...review,
    productId,
    // Not in the snapshot; only used to label the viewer's own review, which
    // the live fetch fills in.
    userId: '',
  }));
  return { status: 'ok', reviews };
}

/**
 * Ratings for every product, shared by all cards on a page.
 *
 * One query for the whole grid rather than one per card — every card reads the
 * same cache entry, so a six-product listing costs a single request.
 */
export function useReviewSummaries() {
  const query = useQuery({
    queryKey: reviewSummariesKey,
    queryFn: fetchReviewSummaries,
    initialData: snapshotSummaries,
    initialDataUpdatedAt: 0,
    staleTime: SUMMARIES_STALE_MS,
  });

  const summaries: Map<string, ReviewSummary> = query.data ?? new Map();
  return {
    summaryFor: (productId: string) => summaries.get(productId),
    isLoading: query.isLoading,
  };
}

/**
 * Reviews for one product.
 *
 * Both the rating beside the product title and the review list below it read
 * from here. Going through React Query means they share a single request and can
 * never disagree — before, the header showed a hardcoded rating while the list
 * showed something else.
 */
export function useProductReviews(productId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: productReviewsKey(productId),
    queryFn: () => fetchProductReviews(productId),
    initialData: () => snapshotReviews(productId),
    initialDataUpdatedAt: 0,
    staleTime: PRODUCT_REVIEWS_STALE_MS,
  });

  const reviews: ProductReview[] = query.data?.reviews ?? [];

  return {
    reviews,
    isLoading: query.isLoading,
    /** The product_reviews table is missing — the migration has not been run. */
    unavailable: query.data?.status === 'unavailable',
    summary: summariseReviews(reviews),
    /**
     * Invalidates the grid summaries too. Without that, posting a review updated
     * the product page but left every card showing the old count until the cache
     * expired.
     */
    refresh: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: productReviewsKey(productId) }),
        queryClient.invalidateQueries({ queryKey: reviewSummariesKey }),
      ]);
    },
  };
}
