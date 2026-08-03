import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchProductReviews,
  fetchReviewSummaries,
  summariseReviews,
  type ProductReview,
  type ReviewSummary,
} from '../lib/reviews';

export const productReviewsKey = (productId: string) => ['product-reviews', productId] as const;
export const reviewSummariesKey = ['product-review-summaries'] as const;

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
    staleTime: 60_000,
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
    staleTime: 30_000,
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
