import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProductReviews, summariseReviews, type ProductReview } from '../lib/reviews';

export const productReviewsKey = (productId: string) => ['product-reviews', productId] as const;

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
    refresh: () => queryClient.invalidateQueries({ queryKey: productReviewsKey(productId) }),
  };
}
