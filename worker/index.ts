/**
 * Fallback handler for the site Worker.
 *
 * This Worker does NOT serve the site. Cloudflare Static Assets matches every
 * prerendered file first and returns it directly, without invoking this script
 * (`run_worker_first` defaults to false). This code runs *only* when no asset
 * matches — which is why adding it cannot break a page that exists, and why the
 * "no JavaScript in the request path" property the site had before is kept for
 * every real request.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 *
 * `wrangler.toml` previously set `not_found_handling = "single-page-application"`,
 * which serves `dist/index.html` with a **200** for any unmatched URL. Since
 * `dist/index.html` is the prerendered *home page*, every unknown URL returned
 * the home page, with the home page's canonical, under a 200 status. Verified
 * 16 Sep 2026:
 *
 *   curl -s /                 | md5sum  -> 7ceb562f946268f23ec53779789927a3
 *   curl -s /no-such-page-xyz | md5sum  -> 7ceb562f946268f23ec53779789927a3
 *
 * Google reported these as **Soft 404** in Search Console: it requested a page,
 * got `200 OK`, and found the home page. A human still saw the right thing —
 * React boots and renders NotFoundPage — but the HTTP status never said so, and
 * a crawler never runs that far.
 *
 * ── Why not just use `not_found_handling = "404-page"` ─────────────────────
 *
 * Because it would break `/account/orders/<id>`. That route is genuinely
 * dynamic: order ids are unbounded, so it cannot be prerendered, and it is the
 * one real page on the site that depends on the SPA fallback. `"404-page"`
 * would serve it a 404 — trading a customer's order page for two soft 404s.
 *
 * So the split below is the whole point: the SPA fallback survives exactly
 * where it is load-bearing, and everywhere else a missing URL is honestly a 404.
 *
 * ── /api/reviews/*: the shared review cache (added 10 Oct 2026) ────────────
 *
 * The star ratings and review lists are the only public data every visitor
 * fetched, each browser straight from Supabase. These two GET routes serve the
 * same data through Cloudflare's edge cache, so one Supabase read per minute
 * per Cloudflare location answers every visitor there. No /api/* path is a
 * file, so they run here, after the asset lookup, like any other miss.
 *
 *   GET /api/reviews/summaries        -> product_review_summaries (migration 0011)
 *   GET /api/reviews/product/<id>     -> one product's reviews, newest first
 *
 * Public data only: the same rows Supabase already serves to anyone holding the
 * anon key. Nothing per-user is ever cached here.
 *
 * Nothing purges this cache. Review writes go straight from the browser to
 * Supabase, never through here, and the Cache API only clears one location.
 * Instead the entries are short-lived (REVIEWS_EDGE_TTL_SECONDS), and a browser
 * that has just written a review skips this route until anything it could have
 * cached has expired (src/lib/reviews.ts, edgeCacheUsable). Everyone else sees a
 * new review within the TTL.
 *
 * Every failure (no Supabase secrets, Supabase error) returns a non-2xx that is
 * not cached, and the client then reads Supabase directly, as it did before.
 * SUPABASE_URL and SUPABASE_ANON_KEY are Worker secrets on `tit`, set in the
 * Cloudflare dashboard; secrets survive deploys, plain dashboard variables do not.
 */

interface Env {
  ASSETS: Fetcher;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}

/** Keep in step with REVIEWS_EDGE_TTL_MS in src/lib/reviews.ts. */
const REVIEWS_EDGE_TTL_SECONDS = 60;

/** Matches every Product.id in src/data/products.ts; also stops odd cache keys. */
const PRODUCT_ID = /^[a-z0-9-]{1,100}$/;

/** The columns fetchProductReviews selects (src/lib/reviews.ts SELECT). */
const REVIEW_COLUMNS = 'id,product_id,user_id,author_name,rating,title,body,created_at';

function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

async function handleReviewsApi(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  url: URL,
): Promise<Response> {
  if (request.method !== 'GET') return jsonError(405, 'Method not allowed');

  let query: string;
  const product = url.pathname.match(/^\/api\/reviews\/product\/([^/]+)$/);
  if (url.pathname === '/api/reviews/summaries') {
    query = 'product_review_summaries?select=product_id,rating_sum,review_count';
  } else if (product && PRODUCT_ID.test(product[1])) {
    query = `product_reviews?select=${REVIEW_COLUMNS}&product_id=eq.${product[1]}&order=created_at.desc`;
  } else {
    return jsonError(404, 'Not found');
  }

  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    return jsonError(503, 'Review cache not configured');
  }

  // Keyed on the path alone, so a query string can neither bypass the cache nor
  // fill it with copies of the same answer.
  const cacheKey = new Request(new URL(url.pathname, url.origin).toString());
  const cache = caches.default;

  /* The expiry is enforced here, from our own timestamp, rather than trusted to
     Cache-Control. Verified live on 11 Oct 2026: a cached copy came back with
     `max-age=14400`, the zone's Browser Cache TTL, in place of the 60 we stored,
     so the zone settings rewrite what the Cache API hands back. Checking the age
     ourselves and always answering with our own headers keeps both the edge TTL
     and what browsers are told at REVIEWS_EDGE_TTL_SECONDS whatever the zone says. */
  const hit = await cache.match(cacheKey);
  const cachedAt = Number(hit?.headers.get('X-Cached-At') ?? 0);
  if (hit && Date.now() - cachedAt < REVIEWS_EDGE_TTL_SECONDS * 1000) {
    return reviewsResponse(await hit.text(), cachedAt);
  }

  /* A dropped connection throws rather than returning a bad status. Uncaught, it
     surfaced as a bare Worker exception (seen in the 11 Oct 2026 load test,
     "Network connection lost."); caught, it is the same uncached 502 as any
     other Supabase failure, and the browser reads Supabase itself. */
  let body: string;
  try {
    const upstream = await fetch(`${env.SUPABASE_URL}/rest/v1/${query}`, {
      headers: { apikey: env.SUPABASE_ANON_KEY, Accept: 'application/json' },
    });
    if (!upstream.ok) return jsonError(502, `Supabase returned ${upstream.status}`);
    body = await upstream.text();
  } catch (err) {
    return jsonError(502, `Supabase unreachable: ${err instanceof Error ? err.message : String(err)}`);
  }

  const response = reviewsResponse(body, Date.now());
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

/** Browsers may keep it only for what is left of the edge TTL. */
function reviewsResponse(body: string, cachedAt: number): Response {
  const ageSeconds = Math.floor((Date.now() - cachedAt) / 1000);
  const maxAge = Math.max(0, REVIEWS_EDGE_TTL_SECONDS - ageSeconds);
  return new Response(body, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${maxAge}`,
      'X-Cached-At': String(cachedAt),
    },
  });
}

/**
 * Path prefixes that are real application routes with no prerendered file, and
 * so must still receive the SPA shell with a 200.
 *
 * Keep this list as small as it can be. Every entry is a path where a genuinely
 * missing URL will report success instead of 404, so it should only ever hold
 * routes with an unbounded dynamic segment.
 *
 * `/account/orders/$orderId` is the only one today. The rest of `/account` is
 * prerendered from PAGE_SEO, and is `Disallow`ed in robots.txt and behind auth
 * regardless.
 */
const SPA_FALLBACK_PREFIXES = ['/account/'];

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/reviews/')) {
      return handleReviewsApi(request, env, ctx, url);
    }

    if (SPA_FALLBACK_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) {
      return env.ASSETS.fetch(new URL('/index.html', url.origin));
    }

    const notFound = await env.ASSETS.fetch(new URL('/404.html', url.origin));

    /* Rebuild the response rather than returning it as-is: the asset comes back
       with a 200 (it exists), and the status is the entire point here. Headers
       are copied so the asset's own content-type and caching survive. */
    return new Response(notFound.body, {
      status: 404,
      statusText: 'Not Found',
      headers: notFound.headers,
    });
  },
};
