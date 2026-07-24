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

## Commands

```bash
npm install        # install dependencies
npm run dev        # start dev server → http://localhost:3000 (strict port)
npm run build      # production build (vite build)
npm run preview    # preview the production build

# Linting / checks
npm run lint       # types + js + css + css-var + css-class checks (uses bun)
npm run lint:types # tsc --noEmit
npm run lint:js    # eslint
npm run lint:css   # stylelint --fix
```

Note: `npm run lint` invokes `bun`. If `bun` isn't installed, run the individual
`lint:*` scripts with `npm run` instead.

## Structure

```
index.html            App entry (loads /src/main.tsx)
backend/index.ts      Hono API: /api/square/checkout, /api/grant/checkout, /api/grant/confirm
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
| Backend host | `GrantPage.tsx`, `ProductPage.tsx` (`BACKEND_URL = …backend.blink.new`) | Blink-hosted `backend/index.ts` | Self-host (Cloudflare Workers / Vercel / Render) |
| ✅ Email | `backend/index.ts` `/api/grant/confirm` | ~~`blink.notifications.email`~~ | **DONE (code)** — now POSTs to **Resend** API (`RESEND_API_KEY`/`RESEND_FROM`). Goes live once backend is self-hosted + domain verified in Resend |
| ✅ UI lib | ~~`src/Shell.tsx`, `AppSidebarShell.tsx`, `layouts/shared-app-layout.tsx`~~ | `@blinkdotnew/ui` | **DONE** — dead code deleted; no `@blinkdotnew/ui` refs remain |
| ✅ Images | `src/data/*.ts`, some pages | `blink-451505.firebasestorage.app` URLs | **DONE** — 32 images downloaded to `public/images/`, all URLs rewritten to `/images/...` |
| Default URLs | `backend/index.ts` grant success/cancel | `…blinkpowered.com` | Real domain (`dominusgolf.com`) |

Suggested order: ~~UI dead-code~~ → ~~images~~ → email → self-host backend + fix URLs → auth.
Payments already run on **Square**, not Blink.

### Migration progress
- ✅ UI dead code removed; ✅ images self-hosted in `public/images/`; ✅ **auth migrated to Supabase**.
- Square: current **production** token + location (`CKAXSBZT47N6P`, "Dominus Golf", USD) in gitignored `.dev.vars`. All three checkout endpoints verified working locally via `wrangler dev` (see `wrangler.toml`). NOTE: the token/location that were live on the **Blink** backend are DEAD (checkout there returns "could not be authorized") — production checkout stays broken until this backend is self-hosted.
- Buy Now no longer uses per-product `square.link` links; all products checkout dynamically via `/api/square/checkout` (the `paymentUrl` field in `src/data/*` is now unused).
- Supabase keys stored in gitignored `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`); `.env.example` tracked.
- ✅ **Email migrated to Resend (code)** — `@blinkdotnew/sdk` fully removed from the repo. Needs: Resend API key in `.dev.vars`, domain verified in Resend, and backend self-hosted before it sends live.
- ⏳ Still on Blink: **backend hosting** (Cloudflare) — the backend code no longer imports Blink, but it's still deployed on Blink's host. Google OAuth: code wired, provider still needs enabling in the Supabase dashboard (access pending).
- ⚠️ Post-launch TODO: rotate the Square access token (both the old and current tokens were shared in plaintext during setup) and the Resend key.
- To run the backend locally: `npx wrangler dev --port 8787 --local --ip 127.0.0.1` (reads `.dev.vars`). Use `127.0.0.1`, not `localhost`.
