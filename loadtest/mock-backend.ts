/**
 * The real backend (backend/index.ts) with every third-party service mocked, for
 * load testing on this machine. Never deploy this.
 *
 * Why a wrapper and not just `npm run dev:backend`: that reads the root
 * `.dev.vars`, which holds the PRODUCTION Square, Supabase (service role) and
 * Resend keys, and the checkout route calls https://connect.squareup.com
 * unconditionally. Under load that would mint thousands of real payment links,
 * write test rows to the real subscriber table and send real email.
 *
 * So this file replaces `fetch` before the backend runs:
 *   - Square, Supabase, Resend and GoAffPro get canned answers after a delay
 *     that imitates the real service (MOCK_LATENCY_MS - estimates, not measured).
 *   - ANY other outbound request throws. Fail closed: a new third-party call
 *     added to the backend later breaks the load test instead of leaking out.
 *
 * It also serves the same mock Supabase over HTTP at /__mock/supabase/*, which
 * the site Worker's /api/reviews/* route reads (see wrangler.site.toml).
 *
 * Every account is on a FREE plan, so the mock Resend refuses mail the way the
 * free plan does (RESEND_FREE below): a 429 past 10 requests a second, and a
 * 429 `daily_quota_exceeded` once 100 emails have gone out. The real daily
 * count also includes order confirmations and review requests already sent that
 * day; this one starts at zero each run. GET /__mock/stats reports the counts,
 * and run.sh hands them to report.mjs.
 *
 * The config next to this file (wrangler.mock-backend.toml) sits in loadtest/,
 * so wrangler looks for loadtest/.dev.vars - which does not exist - and never
 * loads the real keys. Its [vars] are dummies.
 */
import backend from '../backend/index';

/** Rough real-world response times. Change these to model a slower provider. */
const MOCK_LATENCY_MS = {
  squarePaymentLink: [250, 450],
  supabaseRest: [20, 60],
  supabaseAuth: [40, 90],
  resend: [100, 200],
  goaffpro: [100, 200],
} as const;

/**
 * Resend Free, as published on 11 Oct 2026 (resend.com/pricing and
 * resend.com/docs/api-reference/rate-limit). The monthly 3,000 is left to
 * report.mjs: a test run is minutes long, so only the per-day cap can bite.
 * MOCK_RESEND_DAILY_QUOTA in wrangler.mock-backend.toml overrides perDay.
 */
const RESEND_FREE = { perSecond: 10, perDay: 100 };

/** What the mocked services were asked to do this run. Served at /__mock/stats. */
const stats = {
  emailsSent: 0,
  emailsRefusedDailyQuota: 0,
  emailsRefusedRateLimit: 0,
  squarePaymentLinks: 0,
  supabaseRequests: 0,
  firstQuotaRefusalAt: null as string | null,
};
let dailyQuota: number = RESEND_FREE.perDay;
let rateWindowStart = 0;
let rateWindowCount = 0;

function mockResend(): Response {
  const now = Date.now();
  if (now - rateWindowStart >= 1000) {
    rateWindowStart = now;
    rateWindowCount = 0;
  }
  if (++rateWindowCount > RESEND_FREE.perSecond) {
    stats.emailsRefusedRateLimit++;
    return json({ statusCode: 429, name: 'rate_limit_exceeded', message: 'Too many requests.' }, 429);
  }
  if (stats.emailsSent >= dailyQuota) {
    stats.emailsRefusedDailyQuota++;
    stats.firstQuotaRefusalAt ??= new Date(now).toISOString();
    return json({ statusCode: 429, name: 'daily_quota_exceeded', message: 'You have reached your daily email sending quota.' }, 429);
  }
  stats.emailsSent++;
  return json({ id: crypto.randomUUID() });
}

function wait([min, max]: readonly [number, number]) {
  return new Promise((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/* Ten products with a few reviews each, the shape product_review_summaries and
   product_reviews return. Enough to make the review endpoints do real work. */
const PRODUCT_IDS = [
  'tour-pure-men', 'tour-pure-women', 'tour-pure-jr', 'laser-path-trainer',
  'feel-right-band', 'dominus-towel', 'tour-pure-pro-path-bundle-men',
  'training-manual-pdf', 'mastering-the-game-book', 'dominus-tee-icon-white',
];
const SUMMARIES = PRODUCT_IDS.map((product_id, i) => ({
  product_id,
  rating_sum: 4 * (i % 4 + 1) + 3,
  review_count: i % 4 + 1,
}));
function reviewsFor(productId: string) {
  const n = SUMMARIES.find((s) => s.product_id === productId)?.review_count ?? 0;
  return Array.from({ length: n }, (_, i) => ({
    id: `00000000-0000-4000-8000-${String(i).padStart(12, '0')}`,
    product_id: productId,
    user_id: `10000000-0000-4000-8000-${String(i).padStart(12, '0')}`,
    author_name: `Load Test ${i + 1}`,
    rating: 5 - (i % 2),
    title: 'Mock review',
    body: 'Mock review text for load testing. '.repeat(8),
    created_at: new Date(Date.UTC(2026, 8, 1 + i)).toISOString(),
  }));
}

/** `path` is everything after the Supabase base URL, e.g. /rest/v1/orders?x=y. */
async function mockSupabase(method: string, path: string): Promise<Response> {
  stats.supabaseRequests++;
  if (path.startsWith('/auth/v1/user')) {
    await wait(MOCK_LATENCY_MS.supabaseAuth);
    // No shopper is ever signed in during the test.
    return json({ message: 'invalid JWT' }, 401);
  }
  await wait(MOCK_LATENCY_MS.supabaseRest);
  if (path.startsWith('/rest/v1/product_review_summaries')) return json(SUMMARIES);
  if (path.startsWith('/rest/v1/product_reviews')) {
    const id = new URL(path, 'http://x').searchParams.get('product_id')?.replace(/^eq\./, '') ?? '';
    return json(reviewsFor(id));
  }
  if (path.startsWith('/rest/v1/email_subscribers') && method === 'POST') {
    // A brand-new subscriber every time, so each signup sends the welcome email.
    return json([{ id: crypto.randomUUID(), discount_code: 'WELCOME-LOADTS' }], 201);
  }
  // Any other read finds nothing; any other write succeeds.
  return method === 'GET' ? json([]) : new Response(null, { status: 204 });
}

globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const request = new Request(input, init);
  const url = new URL(request.url);

  if (url.hostname === 'connect.squareup.com' || url.hostname === 'connect.squareupsandbox.com') {
    await wait(MOCK_LATENCY_MS.squarePaymentLink);
    if (url.pathname === '/v2/online-checkout/payment-links') {
      stats.squarePaymentLinks++;
      const id = crypto.randomUUID().slice(0, 8).toUpperCase();
      return json({
        payment_link: { id, order_id: `MOCK${id}`, url: `https://mock.square.invalid/${id}` },
      });
    }
    return json({ errors: [{ code: 'NOT_FOUND', detail: 'mock', category: 'API_ERROR' }] }, 404);
  }
  if (url.hostname === 'mock-supabase.invalid') {
    return mockSupabase(request.method, url.pathname + url.search);
  }
  if (url.hostname === 'api.resend.com') {
    await wait(MOCK_LATENCY_MS.resend);
    return mockResend();
  }
  if (url.hostname === 'api.goaffpro.com') {
    await wait(MOCK_LATENCY_MS.goaffpro);
    return json({});
  }
  throw new Error(`loadtest: blocked outbound request to ${url.origin} (not mocked)`);
};

export default {
  async fetch(request: Request, env: Record<string, string>, ctx: ExecutionContext) {
    const url = new URL(request.url);
    if (env.MOCK_RESEND_DAILY_QUOTA) dailyQuota = Number(env.MOCK_RESEND_DAILY_QUOTA);
    if (url.pathname === '/__mock/stats') return json({ ...stats, resendDailyQuota: dailyQuota });
    if (url.pathname.startsWith('/__mock/supabase/')) {
      return mockSupabase(request.method, url.pathname.slice('/__mock/supabase'.length) + url.search);
    }
    return backend.fetch(request, env, ctx);
  },
};
