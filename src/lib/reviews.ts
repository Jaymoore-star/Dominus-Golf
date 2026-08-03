import { supabase } from './supabase';

export type ProductReview = {
  id: string;
  productId: string;
  userId: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
};

type ReviewRow = {
  id: string;
  product_id: string;
  user_id: string;
  author_name: string;
  rating: number;
  title: string;
  body: string;
  created_at: string;
};

const SELECT = 'id, product_id, user_id, author_name, rating, title, body, created_at';

function toReview(row: ReviewRow): ProductReview {
  return {
    id: row.id,
    productId: row.product_id,
    userId: row.user_id,
    authorName: row.author_name,
    rating: row.rating,
    title: row.title,
    body: row.body,
    createdAt: row.created_at,
  };
}

/**
 * True when the failure is "the migration hasn't been run yet" rather than a real
 * error. PostgREST reports an undefined table as 42P01. Callers treat this as
 * "reviews are unavailable" and fall back to read-only instead of showing an
 * error to shoppers.
 */
function isMissingTable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return error.code === '42P01' || /product_reviews/i.test(error.message ?? '');
}

export type ReviewsResult =
  | { status: 'ok'; reviews: ProductReview[] }
  | { status: 'unavailable'; reviews: [] };

export async function fetchProductReviews(productId: string): Promise<ReviewsResult> {
  const { data, error } = await supabase
    .from('product_reviews')
    .select(SELECT)
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) {
    if (isMissingTable(error)) return { status: 'unavailable', reviews: [] };
    throw new Error(error.message);
  }

  return { status: 'ok', reviews: (data as ReviewRow[]).map(toReview) };
}

export type ReviewSummary = { average: number; count: number };

/**
 * Rating and count for every reviewed product, in one request.
 *
 * A shop grid needs a rating per card. Asking per card would fire one query per
 * product on every listing page, so this fetches the two columns it needs for the
 * whole table and aggregates client-side. Cheap while the store is young; if
 * review volume ever makes that wasteful, replace it with a Postgres view or an
 * RPC that returns the aggregate and keep this signature.
 */
export async function fetchReviewSummaries(): Promise<Map<string, ReviewSummary>> {
  const { data, error } = await supabase.from('product_reviews').select('product_id, rating');

  // Same as fetchProductReviews: a missing table means the migration has not run,
  // which is not an error worth surfacing to a shopper.
  if (error) {
    if (isMissingTable(error)) return new Map();
    throw new Error(error.message);
  }

  const totals = new Map<string, { sum: number; count: number }>();
  for (const row of data as { product_id: string; rating: number }[]) {
    const entry = totals.get(row.product_id) ?? { sum: 0, count: 0 };
    entry.sum += row.rating;
    entry.count += 1;
    totals.set(row.product_id, entry);
  }

  const summaries = new Map<string, ReviewSummary>();
  for (const [productId, { sum, count }] of totals) {
    summaries.set(productId, {
      average: Math.round((sum / count) * 10) / 10,
      count,
    });
  }
  return summaries;
}

export type ReviewDraft = {
  productId: string;
  rating: number;
  title: string;
  body: string;
};

/**
 * Creates or replaces the signed-in user's review for a product.
 *
 * Upsert rather than insert because the table allows one review per person per
 * product — a second submission is an edit, not a duplicate. The user id comes
 * from the live session rather than a prop so it always matches what RLS checks.
 */
export async function saveProductReview(
  draft: ReviewDraft,
  authorName: string,
): Promise<ProductReview> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) throw new Error('You need to be signed in to write a review.');

  const { data, error } = await supabase
    .from('product_reviews')
    .upsert(
      {
        product_id: draft.productId,
        user_id: user.id,
        author_name: authorName.slice(0, 80),
        rating: draft.rating,
        title: draft.title.trim().slice(0, 120),
        body: draft.body.trim().slice(0, 4000),
      },
      { onConflict: 'product_id,user_id' },
    )
    .select(SELECT)
    .single();

  if (error) {
    if (isMissingTable(error)) {
      throw new Error('Reviews are not set up yet. Run the product_reviews migration.');
    }
    throw new Error(error.message);
  }

  return toReview(data as ReviewRow);
}

export async function deleteProductReview(id: string): Promise<void> {
  const { error } = await supabase.from('product_reviews').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/**
 * Average and count over real reviews. Returns null when there are none, so the
 * caller can decide what to show rather than rendering a misleading 0.0.
 */
export function summariseReviews(
  reviews: ProductReview[],
): { average: number; count: number } | null {
  if (reviews.length === 0) return null;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return {
    average: Math.round((total / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}

export function formatReviewDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
