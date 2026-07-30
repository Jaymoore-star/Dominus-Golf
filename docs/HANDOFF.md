# Handoff — session of 28–29 July 2026

Where the project stands, what changed, and what to do next. Written to close
out a working session; update it as things move.

Baseline at session start: `cf4dfe7`. Twelve commits on top, all pushed to
`origin/main`, plus one uncommitted change (see [Uncommitted](#uncommitted)).

---

## 1. Go-live status

Updated 29 July, ~19:30 UTC, after Jay connected GitHub.

| Piece | State |
|---|---|
| Backend Worker | ✅ **live** — `https://dominus-golf-backend.jaymoore.workers.dev`, 9 secrets |
| Square checkout (store + grant) | ✅ verified live, production credentials |
| Supabase auth | ✅ email/password + Google, redirect URLs configured |
| GitHub → Cloudflare connection | ✅ **done** — Workers Builds on `Jaymoore-star/tit` |
| Frontend build config | ✅ repo now deploys the site (see below) |
| Frontend deployed | ✅ **live** — `https://tit.jaymoore.workers.dev`, prerendering + code splitting + immutable caching all verified in the served bundle |
| Store checkout from the live site | ✅ verified reaching Square (after the `.env` fix in §3) |
| **DNS** | 🔴 **points at Weebly and 404s — customers still cannot reach the site** |

### 🔴 The domain currently serves a 404

`www.dominusgolf.com` is a CNAME to `dominusgolf.com`, which is an A record to
`199.34.228.186`. That address reverse-resolves to **`cms27.weebly.com`** — Square
Online. It serves a bare "404 - Page Not Found" page, and the apex 301s to `www`,
so both hostnames dead-end.

This is a change from the previous state: DNS used to point at `cname.blink.new`
and served the old Blink build. Nobody on this side made that change. **Find out
who repointed it at Weebly/Square Online before changing it again** — if someone
is mid-way through setting up a Square Online store on the domain, a competing
DNS edit will just produce a fight. The fix is at **IONOS**, pointing `www` at the
frontend Worker instead.

### There is no Pages project — it is a Worker

Worth being precise, because the two are configured completely differently.
Cloudflare has two ways to connect a Git repo, and what exists is the newer one:
**Workers Builds**, not Pages. `wrangler pages project list` returns zero
projects in both accounts, confirmed against the API.

The connection Jay made produced a Worker named **`tit`** (after the repo). Its
first four deployments were a secret-less duplicate of the **backend API** — not
the website — because Workers Builds reads `wrangler.toml`, and that file used to
describe `backend/index.ts`. The build did exactly what the repo told it to.

That is fixed in the repo now, not in the dashboard:

- **`wrangler.toml`** describes the **frontend**: an assets-only Worker serving
  `dist/`, with `[build] command = "npm run build"` so the build is defined in the
  repo rather than dashboard settings, and `html_handling`/`not_found_handling`
  set for a prerendered SPA.
- **`wrangler.backend.toml`** describes the **backend**, and nothing reads it
  automatically. A push can no longer touch the live API.

Consequence: **the next push to `main` deploys the website** over the `tit`
Worker, replacing the stray backend copy. That is the intent, but it means a push
is now a production deploy.

Build variables (`VITE_BACKEND_URL`, `VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY`) are set by Jay in the Worker's build settings. They are
mandatory, not optional: `src/lib/supabase.ts` throws at module load if the two
Supabase vars are missing, which takes the whole app down to a blank white page
rather than merely breaking auth. `VITE_BACKEND_URL` is now the only one with a
safe default — its fallback was the dead Blink host and is now the real Worker.

Deploying by hand, if a push is not wanted: `npm run deploy:site` (frontend) and
`npm run deploy:backend` (API). Never bare `npx wrangler deploy` for the backend —
that reads `wrangler.toml` and would push the API over the website.

### Then the DNS cutover

Attach `www.dominusgolf.com` as a custom domain on the `tit` Worker, then change
the `www` record at **IONOS** to the target it gives you (currently pointing at
Weebly, see above).

> **Do not move the nameservers to Cloudflare.** DNS is at IONOS and the MX
> records point at IONOS mail. Moving nameservers without recreating every
> record takes down `Customersupport@dominusgolf.com` and the Resend DKIM key on
> `send.dominusgolf.com`. Changing the one `www` CNAME is all that is needed;
> rollback is switching it back.

The apex already redirects to `www` via IONOS and is unaffected.

---

## 2. What changed this session

Twelve commits, `cf4dfe7..6d50b4a`.

### Backend and deployment
- **`40757f0`** Deleted `/api/grant/confirm` — it sent the eBook email with no
  payment check at all. Once deployed, anyone knowing the URL could send mail
  from the domain and burn the Resend quota. `/api/grant/complete` verifies the
  Square order first, so nothing was lost. Also replaced the last
  `blinkpowered.com` default URLs.
- **`8a4463f`** Pinned `account_id` in `wrangler.toml`. The login can see two
  Cloudflare accounts, so deploys prompt interactively and fail in CI without it.
- **`c1b729d`** Moved 48 images (2.72 MB) out of **Git LFS**. Cloudflare Pages'
  Git integration does not support LFS — it clones LFS files as ~130-byte
  pointer text, so a Git-connected build would have deployed with **every image
  broken**. History untouched; no rewrite, no force-push.

### SEO
- **`ab9c812`** Per-page titles, descriptions, canonicals, Open Graph and
  Twitter tags via the router's native `head()` — no new dependencies.
  JSON-LD: Organization, WebSite, Product, BreadcrumbList. `sitemap.xml`
  generated from the live catalog at build time (35 URLs), plus `robots.txt`.
  Share images are JPEG (`npm run og:images`), because Facebook's crawler does
  not reliably render the `.webp` catalog images.

  Two non-obvious details are load-bearing:
  - Only the deepest route match may emit a canonical. The router dedupes
    `<link>` tags by exact equality, **not by `rel`**, so a canonical from the
    root and one from the page would both render — every page with two
    canonicals, one pointing at the homepage.
  - `AggregateRating` is emitted only where a real rating exists. Google
    penalises invented review markup.

### Analytics
- **`5064a74`** GA4 + Meta Pixel, gated on `VITE_GA4_ID` / `VITE_META_PIXEL_ID`.
  With no ID set nothing is injected and no request fires. Events: `page_view`,
  `view_item`, `add_to_cart`, `begin_checkout`, grant `purchase`. Page views are
  sent manually because GA4's automatic one fires only once in an SPA. The grant
  purchase event fires only after Square verifies payment.

### Auth
- **`904a2e7`** Fixed the whole post-signup journey: scroll position on the
  success screen, a new `/auth/confirmed` page, and post-login landing.
- **`46dfc36`** New `/auth/reset-password`. Password reset previously pointed at
  `/login`, which has no set-password form — the email arrived and dead-ended.
  Also locked the address country to United States.
- **`4dcc060`, `fc455c6`** Branded email templates and docs.

### Copy
- **`d27a22c`, `6d50b4a`** Removed every em dash and en dash from rendered text
  and the email templates. Code comments deliberately left alone — they never
  reach the browser.

### Tooling
- **`b047804`** The lint pipeline never worked. `bun` was not installed, ESLint
  was never installed and had no config, stylelint had no config, and both
  `check:css-*` scripts pointed at files that have never existed in this repo.
  `npm run lint` now runs types → js → css and exits 0.

---

## 2b. Prerendering (added 29 July)

The build now writes **45 static HTML files** — one per route — each with that
route's real title, description, canonical, Open Graph, Twitter and JSON-LD tags
baked into `<head>`. Previously all of that only appeared after JavaScript ran, so
Facebook, WhatsApp, LinkedIn and iMessage — none of which execute JS — showed the
same generic sitewide card for every link on the site, including every product.

`prerenderPlugin` in `vite.config.ts` does it in `closeBundle`, by copying the
finished `dist/index.html` and substituting the region between the
`<!-- seo:start -->` / `<!-- seo:end -->` markers. Copying the built shell rather
than reconstructing it means each page inherits the real hashed asset tags.

**This is not SSR.** Only `<head>` is generated; `<body>` stays the empty `#root`
div and the app boots exactly as before. That was deliberate — real SSR would mean
auditing Three.js, framer-motion and the localStorage-backed cart for
server-safety, for no gain, since unfurlers only ever read the head.

Two structural points:

- Route metadata lives in `src/lib/pageSeo.ts`, including `productHead()` and
  `shopCategoryHead()` which used to be inline in `App.tsx`. They had to move: a
  build plugin cannot import `App.tsx` (it pulls in every page component), so
  anything reachable only from there would have been silently absent from the
  prerendered HTML. `App.tsx` now calls the same functions the build does.
- Every prerendered tag carries `data-static-seo`, and `useStaticHeadCleanup()` in
  `App.tsx` removes them on mount. That hook is now load-bearing — without it a
  client-side navigation would leave the previous page's `og:*` and canonical tags
  next to the new page's.

If the markers are ever removed from `index.html`, the build **fails loudly**
rather than shipping 45 copies of the homepage's card, which is a bug no test
would catch without a crawler.

## 3. Traps found the hard way

Each of these cost real debugging time. Do not re-learn them.

**`wrangler deploy` injects `.env` into the build and Vite lets it win.** This
shipped a broken production site on 29 July: checkout returned "Failed to fetch"
because the deployed bundle called `http://127.0.0.1:8787`.

The chain: `wrangler deploy` runs the `[build]` command with the values from `.env`
exported into its process environment. Vite ranks **process env above every
`.env.*` file**, and `--mode` does not affect that ranking. So `.env`'s local
`VITE_BACKEND_URL` beat both `.env.production.local` and `vite build --mode
production`. Proven by pointing a throwaway `[build]` command at `node -e` and
printing the variable: wrangler handed it `"http://127.0.0.1:8787"`.

What makes it dangerous is the asymmetry — `npm run build` produced a *correct*
bundle, and `npm run deploy:site` rebuilt it *incorrectly* on the way out. Verifying
`dist/` before deploying proves nothing, because wrangler rebuilds it.

Fixes applied: `VITE_BACKEND_URL` is commented out in `.env`, the fallback in
`src/lib/backend.ts` is the production Worker, and `.env.production.local` was
deleted rather than kept (wrangler never reads it, so it only created false
confidence). **After any deploy, check the live bundle, not `dist/`:**
```bash
curl -s https://tit.jaymoore.workers.dev/ | grep -oE '/assets/index-[^"]+\.js'
curl -s https://tit.jaymoore.workers.dev/assets/index-XXXX.js | grep -c '127.0.0.1'
```

**Three files each defined their own `BACKEND_URL`.** `CartDrawer.tsx` and
`ProductPage.tsx` had private copies with the dead `45pi183s.backend.blink.new`
fallback, so fixing `src/lib/backend.ts` silently missed both store-checkout paths
and only helped the grant pages. All three now import the one constant.

**A catch-all `_redirects` silently defeats prerendering.** `public/_redirects`
held `/* /index.html 200`. Cloudflare's docs are explicit that "redirects are
always followed, regardless of whether or not an asset matches the incoming
request" — so that one line would have shadowed all 45 prerendered files and
served the homepage's head for every URL, with nothing failing. The file is
deleted; the SPA fallback is now `not_found_handling` in `wrangler.toml`, which
applies only after asset matching.

**Workers' default `html_handling` fights our canonical URLs.** The default,
`auto-trailing-slash`, answers `/product/tour-pure-men` with
`307 Location: /product/tour-pure-men/`. Every canonical, `og:url` and sitemap
entry this site emits omits the trailing slash, so each one redirected before
serving — telling crawlers the canonical URL is not the one serving the page.
`html_handling = "drop-trailing-slash"` inverts it correctly. Verified with
`wrangler dev`, which reproduces production asset resolution exactly — **`vite
preview` does not**: its `sirv single:true` fallback serves the root shell for
every deep link, so it will happily show you a working site while hiding this.

**`lint:css` runs with `--fix` and will damage the source.** Enabling it deleted
`-webkit-appearance: none` from the range slider, which **breaks it in Safari**,
and rewrote `rgba()` as four-argument `rgb()`, which older browsers reject. The
offending rules are disabled in `stylelint.config.js` with the reasoning inline.
Read those comments before re-enabling anything. Diff after every `lint:css` run.

**Supabase session detection races the page.** `useAuth` clears `isLoading` as
soon as `getSession()` resolves, which can beat the client finishing with the
token in the URL — and supabase-js **strips the hash while processing it**, so
the URL cannot be inspected to tell "no session" from "session still arriving".
Deciding immediately flashed *"This Link Has Expired"* at users holding valid
links. Both auth landing pages now wait ~1.5s for `onAuthStateChange`. An
explicit error param is still treated as definitive straight away.

**Supabase redirect URLs need the `/**` suffix.** A bare origin matches only the
root. Google OAuth redirects to `origin + peekPostLoginRedirect()`, an
unpredictable path, so a bare entry rejects every real redirect.

**The post-login destination used to be sticky.** It lived in `sessionStorage`
with no expiry, so visiting an account page while signed out would hijack a
sign-in an hour later. Entries now carry a timestamp and expire after ten
minutes; auth pages are never stashed.

**`/` on the Worker returns 404 and that is correct.** Only `/health` and
`/api/*` are routed. A fresh `workers.dev` subdomain also fails TLS for a minute
or two after first deploy while the certificate provisions.

---

## 4. Outstanding

### Blocking launch
1. 🔴 **DNS points at Weebly and the site 404s** (section 1) — now the ONLY thing
   between a working site and real customers. Establish who repointed it, attach
   `www.dominusgolf.com` as a custom domain on the `tit` Worker, then update the
   `www` record at IONOS. Needs IONOS access, which the dev side does not have.
2. **Real production payment test** — one real $15 grant checkout with a real
   card, confirm `/grant/success` verifies it and the eBook email arrives, then
   refund in Square. Store checkout is confirmed reaching Square, but the grant
   flow's payment → email → redirect chain has still never run end to end in
   production; sandbox links are preview-only and cannot be paid.
3. **Paste the email templates** into Supabase → Authentication → Email
   Templates, from `docs/email-templates/`. They are not in the dashboard yet.
4. **Add a DMARC record** at IONOS. There is currently **none**, which is
   plausibly behind the earlier "Resend says Sent but it never arrived" test.
   Start in monitor mode — it changes nothing about delivery:
   ```
   _dmarc.dominusgolf.com  TXT  v=DMARC1; p=none; rua=mailto:Customersupport@dominusgolf.com
   ```
5. **Rotate the Square and Resend credentials** — both were shared in plaintext
   during setup — then re-upload with
   `npx wrangler secret put NAME -c wrangler.backend.toml`.

### High value, not blocking
6. ~~Prerendering~~ — **done**, see section 2b.
7. **Verify the unfurl for real.** Prerendering is verified locally, but the only
   proof that matters is Facebook's Sharing Debugger and a WhatsApp/iMessage paste
   against the live domain, once DNS resolves. Test a product URL, not the
   homepage — the homepage looked correct even when every other page was broken.
8. **Email capture.** There is none anywhere on the site. Every visitor who does
   not buy is unreachable forever.
9. **Orders pipeline.** Square webhook → Supabase, keyed by user id. Until then
   `/account/orders` is an honest placeholder and buyers only get Square's
   receipt, not a branded confirmation. Note the saved address is currently
   **read by nothing** — Square collects shipping itself.
10. **Customer reviews.** Reviews are hardcoded in `src/data/products/` and only
    four products have any.
11. **Product meta descriptions are very short.** They come from the first
    `\n\n`-delimited paragraph of `product.description`, which for several
    products is a single short sentence — `/product/tour-pure-men` yields 70
    characters where Google will show ~155. Not wrong, just leaving room on the
    table. This is copy, so it wants a human, not a code change.

## 4b. Performance (29 July)

Measured on the live Worker before any of this: HTML arrived in **0.22s**, but the
single JS bundle was **988 KB raw / 279 KB Brotli and took 3.15s**. `<body>` is an
empty `#root`, so nothing rendered until it landed. That was the entire perceived
load delay — the server was never the problem.

Two changes:

**Route-level code splitting** (`src/App.tsx`). All 28 pages were statically
imported into one chunk, so a visitor reading one product page also downloaded the
grant form, every legal page and the whole account section. Pages now use the
router's `lazyRouteComponent`, giving 43 chunks:

| | Before | After |
|---|---|---|
| Initial chunk, raw | 988 KB | 749 KB |
| Initial chunk, gzip | ~287 KB | **224 KB** |
| Chunks | 1 | 43 |

`HomePage` and `NotFoundPage` stay eager deliberately — home is the most common
landing page and making it lazy would add a sequential request before first paint,
and `NotFoundPage` is the router's synchronous fallback.

**Immutable caching** (`public/_headers`). Workers Static Assets defaults every
asset to `public, max-age=0, must-revalidate`, so returning visitors revalidated
the whole bundle every visit. `/assets/*` filenames are content-hashed, so those
now get a year of `immutable`. Note `/images/*` deliberately get only one day, not
`immutable`: those filenames merely *look* hashed, and one was replaced in-place
under the same name in `2ab1b1d`, so `immutable` would pin a stale image in every
returning browser for a year. HTML is intentionally absent from the file — it must
keep revalidating or deploys would never reach anyone.

### Still on the table

- **Preload the route chunk.** A product-page visitor now waits for the main chunk
  to parse before the browser discovers it needs `ProductPage-*.js` — one extra
  sequential round trip. Since `prerenderPlugin` already writes per-route HTML, it
  could inject `<link rel="modulepreload">` for that route's chunk and make the
  split free. Needs a route→chunk map from Rollup's `generateBundle`.
- **`@tanstack/react-query` is dead weight.** `QueryClientProvider` is mounted in
  `main.tsx` but there is not a single `useQuery`/`useMutation`/`useQueryClient`
  anywhere in `src/`. It sits in the initial chunk for nothing.
- **`sonner` and `BundlesPage` are dead code.** `sonner` is imported only by
  `BundlesPage.tsx`, which is not registered as a route, and by a shadcn wrapper
  (`components/ui/sonner.tsx`) that is never mounted. The real toasts use
  `react-hot-toast`, correctly mounted in `main.tsx` — that path works.
- **14 unused dependencies**: `three`, `@react-three/*`, `recharts`, `embla-carousel-react`,
  `cmdk`, `vaul`, `react-hook-form`, `zod`, `date-fns`, `@dnd-kit/core`,
  `react-day-picker`, `react-responsive`, `input-otp`, `react-resizable-panels`.
  **Correcting an earlier note in this file: Three.js does NOT load on every
  route — it is not in the bundle at all.** None of these reach the bundle, so
  removing them shrinks `node_modules`, install time and audit surface but will
  **not** make the site faster. Don't start there expecting a speedup.
- **8 npm vulnerabilities** (2 moderate, 6 high) reported at install. Pre-existing
  and untouched; `npm audit fix --force` can break things, so it wants a
  deliberate pass.

### Later
- Automated image optimisation at build time (see [Uncommitted](#uncommitted)).
- Accessibility audit.
- Product catalog is hardcoded TypeScript; every price change is a deploy.
- GA4 sets cookies — a consent banner is needed once EU/UK traffic matters.

---

## 5. Uncommitted

The image optimisation previously listed here was committed as `2ab1b1d`. The
durable follow-up is still open: a build-time resize step, so nobody can drop a
5 MB phone photo into `public/images/` again. Next largest asset is
`GolfTowel2.webp` at 241 KB (1440×1920), not on the home page.

Currently uncommitted — the prerendering and deploy-config work from 29 July:

| File | Change |
|---|---|
| `vite.config.ts` | `prerenderPlugin()` — writes 45 per-route HTML files |
| `src/lib/headHtml.ts` | **new** — serialises head output to HTML, with escaping |
| `src/lib/pageSeo.ts` | `productHead()`, `shopCategoryHead()`, `prerenderRoutes()` |
| `src/App.tsx` | dynamic routes now call the shared builders; stale imports dropped |
| `index.html` | `seo:start` / `seo:end` markers |
| `wrangler.toml` | **rewritten** — now the frontend assets Worker |
| `wrangler.backend.toml` | **new** — the backend, moved out of the auto-read slot |
| `package.json` | `dev:backend`, `deploy:backend`, `deploy:site`; **`wrangler` added as a devDependency** — it was never installed, so every previous command relied on `npx` fetching it, and a bare `wrangler` in an npm script failed with "not recognized". Pinning it via the lockfile also means Cloudflare's build uses the same version instead of whatever is latest that day |
| `src/lib/backend.ts` | fallback URL: dead Blink host → real Worker |
| `public/_redirects` | **deleted** — would have shadowed every prerendered file |
| `public/_headers` | **new** — immutable caching for `/assets/*`, 1 day for images |
| `src/App.tsx` | pages code-split via `lazyRouteComponent` (see §4b) |
| `.env.production.local` | **new, gitignored** — stops a hand-deploy baking `localhost` into the bundle |

Verified: `npm run build` (45 routes), `npx wrangler deploy --dry-run` (150 assets
read), `npm run lint` (0 errors / 46 pre-existing warnings), and `wrangler dev`
route-by-route — every canonical URL returns 200 with its own title, trailing
slashes redirect toward the canonical form, unknown URLs fall back to the shell,
and `og-default.jpg` / `sitemap.xml` still serve.

Not committed, per the working convention below. Note that committing and pushing
this **is** a production deploy of the website.

---

## 6. Reference

- **Cloudflare account:** `d52c80b6632554c75458cf115c6d74b0` (Jaymoore@dominusgolf.com's Account).
  A second account exists on the login (`31eb6235c2e73103c1b98c4026a13e07`,
  Jeetpatel) and is **empty** — everything lives in the Jaymoore one.
- **Backend Worker:** `dominus-golf-backend` — 9 secrets, config `wrangler.backend.toml`
- **Frontend Worker:** `tit` — assets-only, config `wrangler.toml`, Git-connected
  to `Jaymoore-star/tit` via Workers Builds. Build variables set in the dashboard.
- **Pages:** none. Zero projects in either account; the Git connection is Workers
  Builds, not Pages.
- **Supabase project:** `woobljhidgbjgtdkmouc`
- **DNS:** IONOS. `www` → CNAME `dominusgolf.com` → A `199.34.228.186`
  (`cms27.weebly.com`, Square Online) — **currently 404s, must be repointed**.
  MX → IONOS. DKIM on `send.dominusgolf.com`. No DMARC.
- **Canonical domain:** `https://www.dominusgolf.com` (no trailing slashes)

```bash
npm run dev            # localhost:3000
npm run lint           # types -> js -> css, currently 0 errors / 46 warnings
npm run og:images      # regenerate share images after adding a product
npm run dev:backend    # backend locally on 127.0.0.1:8787 (reads .dev.vars)
npm run deploy:backend # deploy the API   (wrangler.backend.toml)
npm run deploy:site    # deploy the site  (wrangler.toml, builds first)

# Check asset routing the way production actually does it. Do NOT trust
# `vite preview` for this — its SPA fallback hides trailing-slash problems.
npx wrangler dev --port 4323 --ip 127.0.0.1
```

Working convention as of 2026-07-28: **do not commit or push without being
asked.** This is now literal, not precautionary — Workers Builds is connected to
`main`, so a push deploys the website to production.
