/**
 * k6 load test: shoppers browsing and buying on the Dominus Golf site.
 *
 * Runs ONLY against the local copies started by loadtest/run.sh: the real site
 * Worker serving the real dist/, and the real backend with Square, Supabase and
 * Resend mocked (see mock-backend.ts). It refuses a production URL.
 *
 * One iteration is one visit, built from the five things shoppers do:
 *
 *   1. Open the home page        GET /  + its JS, CSS, images
 *   2. Browse a shop category    GET /shop/<category>
 *   3. Open a product page       GET /product/<id> + /api/reviews/product/<id>
 *   4. Start checkout            POST /api/square/checkout   (CHECKOUT_RATE)
 *   5. Join the email list       POST /api/subscribe         (SIGNUP_RATE)
 *
 * Signing in is left out: the browser talks to Supabase Auth directly, so there
 * is no request of ours to load-test, only Supabase's.
 *
 * The first page of a visit is a full load (HTML, JS, CSS, images), the way a
 * visitor arriving from Google gets it. After that the app is a single-page
 * app, so moving to another page fetches only that page's images and data, not
 * HTML - and nothing already fetched in the same visit is fetched again.
 *
 *   PROFILE=standard (default)  0 -> 20 -> 50 -> 100 users, 3 min at each, ~13 min
 *   PROFILE=stress              0 -> 100 -> 200 -> 400 -> 800 users, ~13 min
 *   PROFILE=smoke               2 users for 30 s, to check the script works
 *
 * Every request is tagged with `step` (which of the five, or `assets`) and
 * `stage` (e.g. hold-050), which report.mjs uses to say where it broke first.
 *
 * FREE PLANS. Every service is on its free plan, where what runs out first is a
 * daily allowance, not speed. So each request is also tagged `billed`: `site` or
 * `backend` if it would start a Worker in production (100,000 a day for the
 * whole account), `free` if Cloudflare serves it as a static file (unlimited).
 * report.mjs turns that into visits per day before each allowance runs out.
 * The mock Resend enforces Resend Free's 100 emails a day (mock-backend.ts), so
 * a long enough run shows what shoppers see when it is used up.
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { parseHTML } from 'k6/html';
import exec from 'k6/execution';

const SITE = (__ENV.SITE_URL || 'http://127.0.0.1:8788').replace(/\/$/, '');
const API = (__ENV.API_URL || 'http://127.0.0.1:8787').replace(/\/$/, '');

/* Local by default. A staging copy can be allowed with ALLOW_STAGING=1, but
   nothing can point this at the live site or the live API. */
for (const base of [SITE, API]) {
  const host = (base.match(/^https?:\/\/([^/:]+)/) || [])[1] || '';
  if (/dominusgolf\.com$|dominus-golf-backend\..*workers\.dev$/.test(host)) {
    throw new Error(`Refusing to load-test production (${base}).`);
  }
  if (!['127.0.0.1', 'localhost'].includes(host) && __ENV.ALLOW_STAGING !== '1') {
    throw new Error(`${base} is not local. Set ALLOW_STAGING=1 if it is a staging copy.`);
  }
}

const PROFILES = {
  smoke: [{ duration: '30s', target: 2 }],
  standard: [
    { duration: '1m', target: 20 },
    { duration: '3m', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '3m', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '3m', target: 100 },
    { duration: '1m', target: 0 },
  ],
  stress: [
    { duration: '1m', target: 100 },
    { duration: '2m', target: 100 },
    { duration: '1m', target: 200 },
    { duration: '2m', target: 200 },
    { duration: '1m', target: 400 },
    { duration: '2m', target: 400 },
    { duration: '1m', target: 800 },
    { duration: '2m', target: 800 },
    { duration: '1m', target: 0 },
  ],
};
const STAGES = PROFILES[__ENV.PROFILE || 'standard'];
if (!STAGES) throw new Error(`Unknown PROFILE "${__ENV.PROFILE}" (smoke, standard, stress).`);

export const options = {
  stages: STAGES,
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    // Held to the same 1% on their own: they are a sliver of all requests, so a
    // signup that fails every time (Resend's daily cap) would hide in the total.
    'http_req_failed{step:checkout}': ['rate<0.01'],
    'http_req_failed{step:subscribe}': ['rate<0.01'],
    // One line per step in the summary, so it shows which part is slowest.
    // Empty lists are reported but cannot fail the run.
    'http_req_duration{step:home}': [],
    'http_req_duration{step:shop}': [],
    'http_req_duration{step:product}': [],
    'http_req_duration{step:reviews}': [],
    'http_req_duration{step:checkout}': [],
    'http_req_duration{step:subscribe}': [],
    'http_req_duration{step:assets}': [],
  },
  // A browser opens at most 6 connections to one host.
  batchPerHost: 6,
  summaryTrendStats: ['avg', 'med', 'p(90)', 'p(95)', 'max'],
};

const CATEGORIES = ['all', 'training-system', 'apparel', 'accessories', 'mens-gear', 'womens-gear'];
const PRODUCTS = [
  'tour-pure-men', 'tour-pure-women', 'tour-pure-jr', 'laser-path-trainer',
  'tour-pure-pro-path-bundle-men', 'tour-pure-pro-path-bundle-women', 'tour-pure-pro-path-bundle-jr',
  'feel-right-band', 'dominus-towel', 'training-manual-pdf', 'mastering-the-game-book',
  'dominus-tee-icon-white', 'dominus-tee-performance-black', 'dominus-tee-wordmark-white',
  'dominus-womens-tee-black-icon', 'dominus-womens-tee-black-performance', 'dominus-womens-tee-white-icon',
];
// Checkout carts use products with no size to choose, so every cart is valid.
const CART_PRODUCTS = ['tour-pure-men', 'tour-pure-women', 'laser-path-trainer', 'feel-right-band', 'training-manual-pdf'];

/* Shares of visits, typical for a small shop: about 4% start checkout (half of
   whom pay, see report.mjs) and 3% join the list. On free plans these drive the
   result - emails are the scarcest allowance - so set them from GA4 when you
   have real numbers. */
const CHECKOUT_RATE = Number(__ENV.CHECKOUT_RATE || 0.04);
const SIGNUP_RATE = Number(__ENV.SIGNUP_RATE || 0.03);
/** Share of visits that open a product page, from the route mix below. Only
    they can check out, so their checkout chance is scaled up to hit CHECKOUT_RATE. */
const PRODUCT_VIEW_SHARE = 0.84;

const pick = (list) => list[Math.floor(Math.random() * list.length)];
const pause = (min, max) => sleep(min + Math.random() * (max - min));

/** What each page pulls in when it is the first page of a visit. */
function pageResources(path) {
  const res = http.get(`${SITE}${path}`);
  if (res.status !== 200) throw new Error(`setup: ${path} returned ${res.status}`);
  const doc = parseHTML(res.body);
  const code = [];
  const tagsWithCode = doc.find('script[src], link[rel=stylesheet], link[rel=modulepreload]');
  for (let i = 0; i < tagsWithCode.size(); i++) {
    const url = tagsWithCode.eq(i).attr('src') || tagsWithCode.eq(i).attr('href');
    if (url && url.startsWith('/')) code.push(url);
  }
  // Images a browser would fetch on arrival; the rest load lazily on scroll.
  const images = [];
  const imgs = doc.find('img[src^="/images/"]');
  for (let i = 0; i < imgs.size() && images.length < 6; i++) {
    const src = imgs.eq(i).attr('src');
    if (!images.includes(src)) images.push(src);
  }
  return { code, images };
}

export function setup() {
  const pages = { '/': pageResources('/') };
  for (const c of CATEGORIES) pages[`/shop/${c}`] = pageResources(`/shop/${c}`);
  for (const p of PRODUCTS) pages[`/product/${p}`] = pageResources(`/product/${p}`);
  return { pages, startedAt: Date.now() };
}

const seconds = (d) => parseInt(d, 10) * (d.endsWith('m') ? 60 : 1);
const pad = (n) => String(n).padStart(3, '0');

/** e.g. "hold-050" or "ramp-020-050", from how long the stages have been running. */
function stageNow(data) {
  let t = (Date.now() - data.startedAt) / 1000;
  let from = 0;
  for (const s of STAGES) {
    const d = seconds(s.duration);
    if (t < d) return s.target === from ? `hold-${pad(s.target)}` : `ramp-${pad(from)}-${pad(s.target)}`;
    t -= d;
    from = s.target;
  }
  return 'end';
}

/** billed: `site` / `backend` = starts that Worker in production; `free` = static file. */
function tags(data, step, name, billed = 'free') {
  return { step, name, billed, stage: stageNow(data) };
}

function ok(res, label) {
  return check(res, { [`${label} is 200`]: (r) => r.status === 200 });
}

/** Fetches what this visit has not fetched yet, 6 at a time like a browser. */
function fetchAssets(data, visit, urls) {
  const fresh = urls.filter((u) => !visit.has(u));
  fresh.forEach((u) => visit.add(u));
  if (fresh.length === 0) return;
  const responses = http.batch(
    fresh.map((u) => ({
      method: 'GET',
      url: `${SITE}${u}`,
      params: {
        responseType: 'none',
        tags: tags(data, 'assets', u.startsWith('/images/') ? 'image' : 'js/css'),
      },
    })),
  );
  responses.forEach((r) => ok(r, 'asset'));
}

function reviewSummaries(data, visit) {
  // React Query keeps these for the rest of the visit.
  if (visit.has('summaries')) return;
  visit.add('summaries');
  const res = http.get(`${SITE}/api/reviews/summaries`, { tags: tags(data, 'reviews', 'summaries', 'site') });
  ok(res, 'review summaries');
}

/** step: home | shop | product. `full` = first page of the visit (HTML + code). */
function openPage(data, visit, path, step, full) {
  const page = data.pages[path];
  if (full) {
    const name = step === 'home' ? '/' : step === 'shop' ? '/shop/:category' : '/product/:id';
    const res = http.get(`${SITE}${path}`, { responseType: 'none', tags: tags(data, step, name) });
    ok(res, `${step} page`);
    fetchAssets(data, visit, page.code);
  }
  fetchAssets(data, visit, page.images);
  reviewSummaries(data, visit);
  if (step === 'product') {
    const id = path.split('/').pop();
    const res = http.get(`${SITE}/api/reviews/product/${id}`, { tags: tags(data, 'reviews', 'product reviews', 'site') });
    ok(res, 'product reviews');
  }
}

/**
 * The site and the API are on different hosts, so before a JSON POST the browser
 * asks the API for permission (a CORS preflight). Each one starts the backend
 * Worker, so on the free plan every checkout or signup costs two requests.
 */
function preflight(data, step, path) {
  const res = http.options(`${API}${path}`, null, {
    headers: {
      Origin: 'http://localhost:3000',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
    tags: tags(data, step, 'preflight', 'backend'),
  });
  check(res, { [`${step} preflight allowed`]: (r) => r.status === 204 || r.status === 200 });
}

function startCheckout(data) {
  preflight(data, 'checkout', '/api/square/checkout');
  const items = [{ id: pick(CART_PRODUCTS), quantity: 1 }];
  if (Math.random() < 0.3) items.push({ id: pick(CART_PRODUCTS), quantity: 1 });
  const res = http.post(
    `${API}/api/square/checkout`,
    JSON.stringify({ items, successUrl: 'http://localhost:3000/checkout/success' }),
    {
      headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000' },
      tags: tags(data, 'checkout', '/api/square/checkout', 'backend'),
    },
  );
  check(res, {
    'checkout is 200': (r) => r.status === 200,
    'checkout returns a payment link': (r) => r.status === 200 && !!r.json('url'),
  });
}

function joinEmailList(data) {
  preflight(data, 'subscribe', '/api/subscribe');
  const email = `loadtest+${exec.vu.idInTest}-${exec.vu.iterationInScenario}-${Date.now()}@example.com`;
  const res = http.post(`${API}/api/subscribe`, JSON.stringify({ email, source: 'footer' }), {
    headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000' },
    tags: tags(data, 'subscribe', '/api/subscribe', 'backend'),
  });
  check(res, {
    'subscribe is 200': (r) => r.status === 200,
    // 502 = the backend could not send the welcome email (Resend refused it).
    'subscribe not refused for email quota': (r) => r.status !== 502,
  });
}

export default function (data) {
  const visit = new Set(); // this visitor's browser cache

  // Where the visit starts: the home page, a category, or a product from Google.
  const r = Math.random();
  let viewedProduct = false;
  if (r < 0.5) {
    openPage(data, visit, '/', 'home', true);
  } else if (r < 0.75) {
    openPage(data, visit, `/shop/${pick(CATEGORIES)}`, 'shop', true);
  } else {
    openPage(data, visit, `/product/${pick(PRODUCTS)}`, 'product', true);
    viewedProduct = true;
  }
  pause(2, 5);

  // Then one to three more pages inside the app.
  const more = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < more; i++) {
    if (Math.random() < 0.6) {
      openPage(data, visit, `/product/${pick(PRODUCTS)}`, 'product', false);
      viewedProduct = true;
    } else {
      openPage(data, visit, `/shop/${pick(CATEGORIES)}`, 'shop', false);
    }
    pause(2, 5);
  }

  if (viewedProduct && Math.random() < CHECKOUT_RATE / PRODUCT_VIEW_SHARE) {
    startCheckout(data);
    pause(1, 3);
  }
  if (Math.random() < SIGNUP_RATE) {
    joinEmailList(data);
    pause(1, 3);
  }
}
