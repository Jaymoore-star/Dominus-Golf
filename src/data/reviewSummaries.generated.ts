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
 *
 * REVIEW_SNAPSHOT holds the reviews themselves, newest first, so the product
 * page renders them into the static HTML instead of a spinner. The page still
 * refetches them live on load; this is only the first paint. No user ids: the
 * page needs them only to label the viewer's own review, which the live fetch
 * supplies.
 */

export type ReviewSummarySnapshot = { average: number; count: number };

export type ReviewSnapshot = {
  id: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
};

export const REVIEW_SUMMARIES: Record<string, ReviewSummarySnapshot> = {
  "dominus-tee-icon-white": { average: 5, count: 1 },
  "dominus-tee-wordmark-white": { average: 5, count: 1 },
  "tour-pure-men": { average: 5, count: 1 },
  "tour-pure-women": { average: 5, count: 1 },
};

export const REVIEW_SNAPSHOT: Record<string, ReviewSnapshot[]> = {
  "dominus-tee-icon-white": [
    {
      "id": "c7ae3735-cafc-4e3e-8a2a-00ef4b7d1060",
      "authorName": "Jeet Patel",
      "rating": 5,
      "title": "Value for Money Product",
      "body": "I like the Dominus golf logo on the Tee.",
      "createdAt": "2026-08-03T00:22:56.360293+00:00"
    }
  ],
  "dominus-tee-wordmark-white": [
    {
      "id": "2a907ee3-2771-46c4-a3b9-99ede555c8f6",
      "authorName": "Jeet Patel",
      "rating": 5,
      "title": "Awesome",
      "body": "The material is the best.",
      "createdAt": "2026-08-03T00:22:04.313394+00:00"
    }
  ],
  "tour-pure-men": [
    {
      "id": "132a64d4-3c02-4457-9e15-f2b861e496dd",
      "authorName": "Jeet Patel",
      "rating": 5,
      "title": "Good Product",
      "body": "The product actually works very well.",
      "createdAt": "2026-08-03T00:55:37.422813+00:00"
    }
  ],
  "tour-pure-women": [
    {
      "id": "23c7df09-9260-4c96-a8e5-0f28c08794b1",
      "authorName": "Jeet Patel",
      "rating": 5,
      "title": "Good Product",
      "body": "Good Fitting and Fabric",
      "createdAt": "2026-08-03T00:20:45.566122+00:00"
    }
  ],
};
