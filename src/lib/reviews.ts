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

/*
 * The public review reads go through the site Worker's edge cache
 * (/api/reviews/*, worker/index.ts) and fall back to Supabase directly whenever
 * that fails: in `npm run dev`, which has no Worker, under `vite preview`, whose
 * SPA fallback answers with HTML, and if the Worker's secrets are not set.
 *
 * Nothing purges the edge copy when a review is written, so the writer's own
 * browser skips it until any copy cached before the write has expired. Without
 * that, a reviewer reloading the page would see their review missing.
 */

/** Keep in step with REVIEWS_EDGE_TTL_SECONDS in worker/index.ts. */
const REVIEWS_EDGE_TTL_MS = 60_000;
const REVIEW_WRITTEN_AT_KEY = 'dominus:review-written-at';

function noteReviewWritten() {
  try {
    localStorage.setItem(REVIEW_WRITTEN_AT_KEY, String(Date.now()));
  } catch {
    // Storage blocked: the writer may see the cached list for up to a minute.
  }
}

function edgeCacheUsable(): boolean {
  if (import.meta.env.DEV) return false;
  try {
    const writtenAt = Number(localStorage.getItem(REVIEW_WRITTEN_AT_KEY) ?? 0);
    // Doubled for clock skew between this device and Cloudflare.
    return Date.now() - writtenAt > 2 * REVIEWS_EDGE_TTL_MS;
  } catch {
    return true;
  }
}

/** The cached route's JSON, or null for any failure so the caller reads Supabase. */
async function fromEdgeCache<T>(path: string): Promise<T | null> {
  if (!edgeCacheUsable()) return null;
  try {
    const res = await fetch(path);
    if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchProductReviews(productId: string): Promise<ReviewsResult> {
  const cached = await fromEdgeCache<ReviewRow[]>(
    `/api/reviews/product/${encodeURIComponent(productId)}`,
  );
  if (cached) return { status: 'ok', reviews: cached.map(toReview) };

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
 * True when the product_review_summaries view does not exist yet, i.e. migration
 * 0011 has not been run. PostgREST reports a relation missing from its schema
 * cache as PGRST205; Postgres itself says 42P01.
 */
function isMissingSummariesView(error: { code?: string; message?: string }): boolean {
  return (
    error.code === 'PGRST205' ||
    error.code === '42P01' ||
    /product_review_summaries/i.test(error.message ?? '')
  );
}

function toSummaries(totals: Iterable<[string, { sum: number; count: number }]>) {
  const summaries = new Map<string, ReviewSummary>();
  for (const [productId, { sum, count }] of totals) {
    summaries.set(productId, {
      average: Math.round((sum / count) * 10) / 10,
      count,
    });
  }
  return summaries;
}

/**
 * Rating and count for every reviewed product, in one request.
 *
 * A shop grid needs a rating per card. Asking per card would fire one query per
 * product on every listing page, so this reads the per-product totals for the
 * whole catalogue at once: one row per reviewed product, from the
 * product_review_summaries view (supabase/migrations/0011). It used to download
 * every review and add them up here, which grew with each review ever written
 * and was the most frequent query on the database.
 */
export async function fetchReviewSummaries(): Promise<Map<string, ReviewSummary>> {
  type SummaryRow = { product_id: string; rating_sum: number; review_count: number };

  let rows = await fromEdgeCache<SummaryRow[]>('/api/reviews/summaries');
  if (!rows) {
    const { data, error } = await supabase
      .from('product_review_summaries')
      .select('product_id, rating_sum, review_count');

    if (error) {
      if (isMissingSummariesView(error)) return fetchReviewSummariesFromRows();
      throw new Error(error.message);
    }
    rows = data as SummaryRow[];
  }

  return toSummaries(
    rows.map((row) => [row.product_id, { sum: row.rating_sum, count: row.review_count }]),
  );
}

/**
 * The pre-0011 path: every review's rating, totalled here. Used only until the
 * view exists, so the frontend can deploy before the migration runs.
 */
async function fetchReviewSummariesFromRows(): Promise<Map<string, ReviewSummary>> {
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
  return toSummaries(totals);
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

  noteReviewWritten();
  return toReview(data as ReviewRow);
}

export async function deleteProductReview(id: string): Promise<void> {
  const { error } = await supabase.from('product_reviews').delete().eq('id', id);
  if (error) throw new Error(error.message);
  noteReviewWritten();
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
