# CLAUDE.md

Project context for Claude Code. This file is read automatically at the start of a session.

## Project

**Dominus Golf** — a premium golf equipment e-commerce site (storefront, product pages,
a development-grant application flow, and email/Google auth).

Originally scaffolded on the **Blink AI** platform. It is being migrated OFF Blink.
See [Blink Migration](#blink-migration) below — **do not break the running app during migration.**

## Tech stack

- **Frontend:** React + TypeScript, built with **Vite 7**
- **Routing:** `@tanstack/react-router` — routes are declared in `src/App.tsx`
- **Styling:** Tailwind CSS 3 (config in `tailwind.config.cjs`), shadcn/ui components
- **State:** React context (`src/store/cartStore.tsx`), `@tanstack/react-query`
- **3D/animation:** `@react-three/fiber` + `drei`, `framer-motion`
- **Backend:** Hono app in `backend/index.ts` (Square checkout + grant email)
- **Payments:** Square (production + sandbox)
- **Reviews:** customer product reviews live in Supabase (`product_reviews`, RLS: public
  read, author-only write). Schema in `supabase/migrations/` — run it in the SQL Editor.
  The client degrades to read-only if the table is absent, so a missing migration is
  silent rather than an error. Ratings are also snapshotted into the tracked file
  `src/data/reviewSummaries.generated.ts` at build time, to emit `aggregateRating`
  in Product JSON-LD — never write that file by hand, and never emit a rating for a
  product with no real reviews.
- **Hosting:** two Cloudflare Workers — `dominus-golf-backend` (the API,
  `wrangler.backend.toml`) and `tit` (the site, assets-only, `wrangler.toml`).
  There is **no** Cloudflare Pages project; the Git connection is Workers Builds.
- **SEO:** the build prerenders one static HTML file per route with that route's
  head baked in, so non-JS crawlers see real per-page tags. See `vite.config.ts`
  → `prerenderPlugin`, `docs/HANDOFF.md` §2b, and **`docs/SEO.md`** for the full
  picture — including three fixes that can only be done in the Cloudflare and
  Search Console dashboards.

## Commands

```bash
npm install        # install dependencies
npm run dev        # start dev server → http://localhost:3000 (strict port)
npm run build      # production build (vite build) + prerenders 45 route HTML files
npm run preview    # preview the production build — see the caveat below

npm run dev:backend     # backend Worker locally on 127.0.0.1:8787 (reads .dev.vars)
npm run deploy:backend  # deploy the API  (wrangler.backend.toml)
npm run deploy:site     # deploy the site (wrangler.toml, runs the build first)

# Linting / checks
npm run lint       # types + js + css, in that order
npm run lint:types # tsc --noEmit
npm run lint:js    # eslint (flat config in eslint.config.js)
npm run lint:css   # stylelint --fix

# Assets
npm run og:images  # regenerate social share images after adding/changing a product
npm run seo:reviews # refresh the real review ratings used for star ratings in Google
                    # (runs automatically as part of `npm run build`)
npm run seo:dates   # refresh sitemap <lastmod> after editing page/product content,
                    # then COMMIT the result. Deliberately not part of the build:
                    # the Cloudflare build only has a shallow clone, where git
                    # reports every file as changed in the tip commit.
```

Lint state: `lint:types` and `lint:js` are clean. `lint:js` reports ~46 pre-existing
warnings (unused vars, `any`, react-refresh) — warnings do not fail the run.

Careful with `lint:css`: it runs with `--fix`, so it rewrites source. Several
stylelint rules are disabled in `stylelint.config.js` specifically because their
autofix caused regressions — most seriously, deleting `-webkit-appearance: none`
from the range slider, which breaks it in Safari. Read the comments there before
re-enabling anything.

## Structure

```
index.html            App entry (loads /src/main.tsx). Keep the seo:start/seo:end
                      markers — the prerenderer replaces that region per route.
wrangler.toml         Frontend Worker (static assets). Read automatically by
                      Workers Builds on every push, so a push deploys the site.
wrangler.backend.toml Backend Worker. Nothing reads it implicitly — pass -c.
backend/index.ts      Hono API: /api/square/checkout, /api/grant/checkout, /api/grant/complete
src/
  main.tsx            React bootstrap
  App.tsx             Router + all route definitions
  pages/              One component per route (HomePage, ShopPage, ProductPage, GrantPage, …)
  components/         Shared UI (home/, layout/, cart/, ui/ = shadcn)
  data/               Static product/category/pro data (product image URLs live here)
  store/              Cart context
  hooks/              e.g. useAuth
  blink/client.ts     Blink SDK client (auth) — slated for replacement
  lib/, features/, layouts/, assets/
```

## Conventions

- Components are named exports in PascalCase files (e.g. `export function ShopPage()`).
- Path alias `@/` → `src/` (configured in `vite.config.ts` and `tsconfig.json`).
- Product/category/pro images are currently remote URLs stored in `src/data/*.ts`.
- Keep the dev server running while making changes; verify http://localhost:3000 still
  responds after edits to `index.html`, routing, or the entry point.

### Mobile invariants — each of these was a real bug, do not undo them

- **Form controls must be ≥16px on phones.** Use `text-base sm:text-sm`, never a
  bare `text-sm`. Below 16px, iOS Safari magnifies the whole page on focus and
  never restores it — and in an SPA there is no reload to reset it, so one tap on
  a login field leaves every later page enlarged and clipped. `src/index.css`
  forces 16px under 640px as a backstop; do not remove it.
- **Internal links use the router `<Link>`, never `<a href="/…">`.** A plain
  anchor reloads the whole app. Same for `target="_blank"` on internal URLs.
- **`truncate` inside a flex row needs `min-w-0` on the flex item**, or it does the
  opposite of truncating: `white-space: nowrap` makes min-content the full string
  and the row grows instead.
- **Avoid horizontal entrance offsets** in Framer Motion (`initial={{ x: … }}`).
  They park an element outside the viewport until it scrolls into view. Use `y`.
- Measure mobile layout by **visual clipping**, not `scrollWidth`. `html` has
  `overflow-x: clip`, so the page can never report horizontal overflow — check
  whether elements extend past `clientWidth`, and do not skip subtrees inside an
  `overflow-hidden` ancestor, because "contained" means "cut off" to a user.

## Secrets

- Backend env vars (`.dev.vars`): `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`,
  `SQUARE_SANDBOX_ACCESS_TOKEN`, `SQUARE_SANDBOX_LOCATION_ID`, `RESEND_API_KEY`, `RESEND_FROM`.
- Frontend env vars (`.env`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (anon key only — never the service_role key).
- **Never commit these.** `.env`, `.env.*`, and `.dev.vars` are gitignored. Do not add
  real secret values to any tracked file (including this one).

## Blink Migration

Phase 1 (safe cleanup) is **done**: the Blink visual-editor script and `widget.js` were
removed from `index.html`, and `.blink-cf-build/` + `.blink-template-revision` were deleted.
The app still runs.

Phase 2 (functional dependencies still on Blink) — replace each before removing it:

| Area | Where | Blink piece | Replace with |
|------|-------|-------------|--------------|
| ✅ Auth | ~~`src/blink/client.ts`~~, `src/hooks/useAuth.ts`, `LoginPage`, `SignupPage` | `@blinkdotnew/sdk` auth | **DONE** — migrated to **Supabase** (`src/lib/supabase.ts`); email/password live, Google wired but pending Supabase provider enablement |
| ✅ Backend host | `src/lib/backend.ts`, `ProductPage.tsx`, `CartDrawer.tsx` | Blink-hosted `backend/index.ts` | **DONE** — Cloudflare Worker at `https://dominus-golf-backend.jaymoore.workers.dev` |
| ✅ Email | `backend/index.ts` `/api/grant/confirm` | ~~`blink.notifications.email`~~ | **DONE (code)** — now POSTs to **Resend** API (`RESEND_API_KEY`/`RESEND_FROM`). Goes live once backend is self-hosted + domain verified in Resend |
| ✅ UI lib | ~~`src/Shell.tsx`, `AppSidebarShell.tsx`, `layouts/shared-app-layout.tsx`~~ | `@blinkdotnew/ui` | **DONE** — dead code deleted; no `@blinkdotnew/ui` refs remain |
| ✅ Images | `src/data/*.ts`, some pages | `blink-451505.firebasestorage.app` URLs | **DONE** — 32 images downloaded to `public/images/`, all URLs rewritten to `/images/...` |
| ✅ Default URLs | `backend/index.ts` grant success/cancel | ~~`…blinkpowered.com`~~ | **DONE** — already `https://www.dominusgolf.com` |

Suggested order: ~~UI dead-code~~ → ~~images~~ → email → self-host backend + fix URLs → auth.
Payments already run on **Square**, not Blink.

### Migration progress
- ✅ UI dead code removed; ✅ images self-hosted in `public/images/`; ✅ **auth migrated to Supabase**.
- Square: current **production** token + location (`CKAXSBZT47N6P`, "Dominus Golf", USD) in gitignored `.dev.vars`. All three checkout endpoints verified working locally via `wrangler dev` (see `wrangler.toml`). NOTE: the token/location that were live on the **Blink** backend are DEAD (checkout there returns "could not be authorized") — production checkout stays broken until this backend is self-hosted.
- Buy Now no longer uses per-product `square.link` links; all products checkout dynamically via `/api/square/checkout` (the `paymentUrl` field in `src/data/*` is now unused).
- Supabase keys stored in gitignored `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`); `.env.example` tracked.
- ✅ **Email migrated to Resend (code)** — `@blinkdotnew/sdk` fully removed from the repo. Needs: Resend API key in `.dev.vars`, domain verified in Resend, and backend self-hosted before it sends live.
- ✅ **Backend deployed to Cloudflare Workers** (2026-07-28), account `d52c80b6632554c75458cf115c6d74b0`, pinned as `account_id` in `wrangler.toml` — the login sees two accounts, so deploys fail non-interactively without it. All 9 secrets uploaded via `wrangler secret put`; production Square checkout verified live.
- ✅ Google OAuth **enabled** in Supabase (verified via `GET /auth/v1/settings`). Redirect URLs configured: `https://www.dominusgolf.com/**` and `http://localhost:3000/**` — the `/**` matters, since Google OAuth redirects to an unpredictable path.
- ✅ **Blink is fully out of the code** as of 2026-07-29 — the last reference was the
  dead `45pi183s.backend.blink.new` fallback in `src/lib/backend.ts`, now the real Worker.
- ✅ **GitHub connected to Cloudflare** (2026-07-29, by Jay) — but as **Workers Builds**,
  not Pages. It first deployed a secret-less copy of the *backend* as a Worker named
  `tit`, because `wrangler.toml` described `backend/index.ts`. Fixed by splitting the
  configs; `wrangler.toml` is now the frontend and a push deploys the site.
- ✅ **DNS done 2026-07-30 — the site is LIVE at `https://dominusgolf.com`.**
  Nameservers moved to Cloudflare (`armando`/`daniella.ns.cloudflare.com`); `www` and
  the apex are both Custom Domains on the `tit` Worker. Registrar is still IONOS, which
  holds the old zone dormant as the rollback. Full runbook and record inventory in
  `docs/DNS-MIGRATION.md`. Two things to know: Cloudflare's import scan found only
  **7 of 28 records** (it missed all three IONOS outbound-DKIM CNAMEs), and Resend's
  SPF/bounce MX had been published at `send.send.dominusgolf.com` rather than `send.`.
  Both fixed during the move. Still **no DMARC record** — see `docs/HANDOFF.md` §4.
- ⚠️ **A push to `main` deploys only the SITE.** The backend Worker is deployed
  separately with `npm run deploy:backend`; Workers Builds does not touch it.
- ⚠️ Post-launch TODO: rotate the Square access token (both the old and current tokens were shared in plaintext during setup) and the Resend key.
- To run the backend locally: `npm run dev:backend` (reads `.dev.vars`). Use `127.0.0.1`, not `localhost`.
- ⚠️ Backend `wrangler` commands need `-c wrangler.backend.toml`, including `wrangler secret put`.
  Without it wrangler reads `wrangler.toml` and targets the **frontend** Worker.
- ⚠️ `vite preview` is not a valid check of route serving — its SPA fallback returns the
  root shell for every deep link, which masks prerendering and trailing-slash bugs. Use
  `npx wrangler dev` instead; it reproduces production asset resolution.
