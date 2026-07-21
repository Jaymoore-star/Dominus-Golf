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

- Backend env vars (Square + email): `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`,
  `SQUARE_SANDBOX_ACCESS_TOKEN`, `SQUARE_SANDBOX_LOCATION_ID`, `BLINK_PROJECT_ID`,
  `BLINK_SECRET_KEY`.
- **Never commit these.** `.env`, `.env.*`, and `.dev.vars` are gitignored. Do not add
  real secret values to any tracked file (including this one).

## Blink Migration

Phase 1 (safe cleanup) is **done**: the Blink visual-editor script and `widget.js` were
removed from `index.html`, and `.blink-cf-build/` + `.blink-template-revision` were deleted.
The app still runs.

Phase 2 (functional dependencies still on Blink) — replace each before removing it:

| Area | Where | Blink piece | Replace with |
|------|-------|-------------|--------------|
| Auth | `src/blink/client.ts`, `src/hooks/useAuth.ts`, `LoginPage`, `SignupPage` | `@blinkdotnew/sdk` auth | Supabase / Firebase / Clerk / Auth0 |
| Backend host | `GrantPage.tsx`, `ProductPage.tsx` (`BACKEND_URL = …backend.blink.new`) | Blink-hosted `backend/index.ts` | Self-host (Cloudflare Workers / Vercel / Render) |
| Email | `backend/index.ts` `blink.notifications.email` | Blink notifications | Resend / SendGrid / Postmark |
| ✅ UI lib | ~~`src/Shell.tsx`, `AppSidebarShell.tsx`, `layouts/shared-app-layout.tsx`~~ | `@blinkdotnew/ui` | **DONE** — dead code deleted; no `@blinkdotnew/ui` refs remain |
| ✅ Images | `src/data/*.ts`, some pages | `blink-451505.firebasestorage.app` URLs | **DONE** — 32 images downloaded to `public/images/`, all URLs rewritten to `/images/...` |
| Default URLs | `backend/index.ts` grant success/cancel | `…blinkpowered.com` | Real domain (`dominusgolf.com`) |

Suggested order: ~~UI dead-code~~ → ~~images~~ → email → self-host backend + fix URLs → auth.
Payments already run on **Square**, not Blink.

### Migration progress
- ✅ UI dead code removed; ✅ images self-hosted in `public/images/`.
- Square credentials collected → stored in gitignored `.dev.vars` (`SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`).
- ⏳ Waiting on 3 accounts (Supabase / Resend / Cloudflare) to do: auth, email, backend hosting.
- ⚠️ Post-launch TODO: rotate the Square access token (it was shared in plaintext during setup).
