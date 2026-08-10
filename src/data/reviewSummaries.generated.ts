/**
 * GENERATED FILE - do not edit by hand.
 *
 * Written by scripts/fetch-review-summaries.mjs, which runs as part of
 * `npm run build`. Regenerate with `npm run seo:reviews`.
 *
 * A snapshot of the real ratings in the Supabase product_reviews table, used to
 * emit aggregateRating in Product JSON-LD. Both the prerenderer and the router
 * read this so the static HTML and the hydrated DOM carry the same rating.
 *
 * Products with no reviews are absent rather than zero: schema.org has no way to
 * say "rated zero out of five", and inventing a rating is the exact thing Google
 * penalises.
 */

export type ReviewSummarySnapshot = { average: number; count: number };

export const REVIEW_SUMMARIES: Record<string, ReviewSummarySnapshot> = {
  "dominus-tee-icon-white": { average: 5, count: 1 },
  "dominus-tee-wordmark-white": { average: 5, count: 1 },
  "tour-pure-men": { average: 5, count: 1 },
  "tour-pure-women": { average: 5, count: 1 },
};
