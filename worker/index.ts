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
 */

interface Env {
  ASSETS: Fetcher;
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
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

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
