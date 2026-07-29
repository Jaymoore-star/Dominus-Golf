# Handoff — session of 28–29 July 2026

Where the project stands, what changed, and what to do next. Written to close
out a working session; update it as things move.

Baseline at session start: `cf4dfe7`. Twelve commits on top, all pushed to
`origin/main`, plus one uncommitted change (see [Uncommitted](#uncommitted)).

---

## 1. Go-live status

| Piece | State |
|---|---|
| Backend Worker | ✅ **live** — `https://dominus-golf-backend.jaymoore.workers.dev` |
| Square checkout (store + grant) | ✅ verified live, production credentials |
| Supabase auth | ✅ email/password + Google, redirect URLs configured |
| Frontend hosting | ⏳ **still on Blink** — `www.dominusgolf.com` serves an old build |
| Custom domain | ⏳ not switched |

**The single blocker is the Cloudflare Pages project.** It does not exist yet.

### Why Jay has to create it

`Jaymoore-star/tit` is a **personal** GitHub account, not an org. Cloudflare
Pages connects by installing the Cloudflare Pages GitHub App, and on a personal
account only the owner can install an app. Collaborator access — which Jeet has
and which is enough to push — does not cover it. GitHub's "request app
installation" flow is organisation-only, so there is no way to request it
either.

Longer term, moving the repo to a GitHub organisation removes this permanently
and fixes the ownership risk of a company codebase living on one person's
personal account.

### Steps for Jay

1. Cloudflare → **Workers & Pages**, in **Jaymoore@dominusgolf.com's Account**
2. **Create → Pages → Connect to Git** → `Jaymoore-star/tit`
3. Build settings: branch `main`, framework preset **None**, build command
   `npm run build`, output directory `dist`
4. **Environment variables (add before the first build):**
   - `VITE_BACKEND_URL` = `https://dominus-golf-backend.jaymoore.workers.dev`
   - `VITE_SUPABASE_URL` = `https://woobljhidgbjgtdkmouc.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = the public anon key (in the gitignored `.env`)
   - `VITE_GA4_ID`, `VITE_META_PIXEL_ID` — optional, analytics stays inert without them
5. Save and deploy, then test everything on the `*.pages.dev` URL

Step 4 matters: a build without `VITE_BACKEND_URL` falls back to the dead Blink
URL. The site builds fine and checkout fails silently.

### Then the DNS cutover

Add `www.dominusgolf.com` as a custom domain in Pages, take the CNAME target it
gives you, and change the existing `www` record at **IONOS** from
`cname.blink.new` to that value.

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

## 3. Traps found the hard way

Each of these cost real debugging time. Do not re-learn them.

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
1. **Jay connects Pages** (section 1), then the IONOS CNAME change.
2. **Paste the email templates** into Supabase → Authentication → Email
   Templates, from `docs/email-templates/`. They are not in the dashboard yet.
3. **Add a DMARC record** at IONOS. There is currently **none**, which is
   plausibly behind the earlier "Resend says Sent but it never arrived" test.
   Start in monitor mode — it changes nothing about delivery:
   ```
   _dmarc.dominusgolf.com  TXT  v=DMARC1; p=none; rua=mailto:Customersupport@dominusgolf.com
   ```
4. **Rotate the Square and Resend credentials** — both were shared in plaintext
   during setup — then re-upload the Worker secrets with `wrangler secret put`.

### High value, not blocking
5. **Prerendering.** The biggest remaining SEO gap. Facebook, WhatsApp, LinkedIn
   and iMessage do not run JavaScript, so they only ever see the static
   fallback in `index.html` — none of the per-page OG work reaches them. Google
   is fine. Best done alongside the Pages deploy since it changes the build.
6. **Email capture.** There is none anywhere on the site. Every visitor who does
   not buy is unreachable forever.
7. **Orders pipeline.** Square webhook → Supabase, keyed by user id. Until then
   `/account/orders` is an honest placeholder and buyers only get Square's
   receipt, not a branded confirmation. Note the saved address is currently
   **read by nothing** — Square collects shipping itself.
8. **Customer reviews.** Reviews are hardcoded in `src/data/products/` and only
   four products have any.

### Later
- Route-level code splitting — the JS bundle is 977 KB and Three.js loads on
  every route.
- Automated image optimisation at build time (see [Uncommitted](#uncommitted)).
- Accessibility audit.
- Product catalog is hardcoded TypeScript; every price change is a deploy.
- GA4 sets cookies — a consent banner is needed once EU/UK traffic matters.

---

## 5. Uncommitted

`public/images/IMG_20251125_140842__6f9f5d69.webp` — optimised from **975 KB to
90 KB** (1440×1920 → 450×600). It is one card image in `SystemSection` that
rendered at roughly 176×235 CSS pixels, so it was carrying about 8× more pixels
than a retina display can use. Home page image weight went from 1,368 KB to
482 KB.

Re-encoding alone was useless — quality 80 at the original size saved 7 KB. It is
a photo of a club on grass, and grass texture is worst-case for a compressor.
Five candidates were compared at true display size and were indistinguishable
down to 375×500; 450×600 was chosen to keep retina headroom.

Next largest asset is `GolfTowel2.webp` at 241 KB (1440×1920), not on the home
page. The durable fix is a build-time resize step so nobody can drop a 5 MB
phone photo into `public/images/` again.

---

## 6. Reference

- **Cloudflare account:** `d52c80b6632554c75458cf115c6d74b0` (Jaymoore@dominusgolf.com's Account)
- **Worker:** `dominus-golf-backend` — 9 secrets uploaded, `wrangler secret list` to check
- **Supabase project:** `woobljhidgbjgtdkmouc`
- **DNS:** IONOS. `www` → `cname.blink.new` (to be changed). MX → IONOS. DKIM on `send.dominusgolf.com`. No DMARC.
- **Canonical domain:** `https://www.dominusgolf.com`

```bash
npm run dev          # localhost:3000
npm run lint         # types -> js -> css, currently 0 errors / 46 warnings
npm run og:images    # regenerate share images after adding a product
npx wrangler dev --port 8787 --local --ip 127.0.0.1   # backend locally
npx wrangler deploy  # deploy the Worker
```

Working convention as of 2026-07-28: **do not commit or push without being
asked.** Once Pages is connected with auto-deploy on `main`, a push is a
production deploy.
