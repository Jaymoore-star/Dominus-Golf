# SEO

What is already built, what still has to be done by hand in a dashboard, and
what actually moves rankings for this site.

Written 10 August 2026. Re-audited against the live site 16 September 2026 —
that pass added §2.2a (an edge block on two AI crawlers that §2.2 thought it had
lifted), §2.5 (nothing is measuring the site), §3a (the titles carry none of the
target keywords) and §3b (the prerendered HTML has no body), and reordered the
effort list in §3.

---

## 1. What the code does

Nothing here needs doing again — it is background for the sections below.

| Piece | Where |
|---|---|
| Per-route title, description, canonical, Open Graph, Twitter | `src/lib/pageSeo.ts` (copy) + `src/lib/seo.ts` (assembly) |
| 48 prerendered HTML files, one per route, head baked in | `prerenderPlugin` in `vite.config.ts` |
| `sitemap.xml`, 36 indexed URLs, real per-URL `lastmod` | `sitemapPlugin` in `vite.config.ts` |
| `robots.txt` | `public/robots.txt` |
| JSON-LD: Organization, WebSite, Product, AggregateRating, BreadcrumbList, ItemList | `src/lib/seo.ts` |
| Shipping cost, delivery estimate and returns in Product schema | `src/lib/seo.ts` |
| Real star ratings from Supabase reviews | `scripts/fetch-review-summaries.mjs` |
| `google-merchant.xml` product feed, 36 entries | `src/lib/merchantFeed.ts` |

### Star ratings in search results

`npm run build` runs `npm run seo:reviews` first, which snapshots the real
ratings from the Supabase `product_reviews` table into
`src/data/reviewSummaries.generated.ts`. That file is **committed on purpose**:
if Supabase is unreachable or CI has no keys, the build keeps the last good
snapshot instead of failing.

Two rules this deliberately follows:

- **A product nobody has reviewed gets no `aggregateRating` at all.** Not a
  zero. Inventing ratings is the one thing in this area Google actively
  penalises, and the site was burned by hardcoded figures once already.
- **The rating is a build-time snapshot, read by both the prerenderer and the
  router.** It has to be one shared file. If only the build knew the rating,
  hydration would strip `aggregateRating` back out of the DOM — and the
  rendered DOM is what Google reads for rich results.

Ratings are therefore as fresh as the last deploy. The review list on the
product page is still fetched live on every visit; only the search-results
number is snapshotted.

> **Current state: 4 reviews, one each on `tour-pure-men`, `tour-pure-women`,
> `dominus-tee-wordmark-white`, `dominus-tee-icon-white`, all 5.0.**
> The markup is correct but thin. Google shows stars more readily with more
> reviews, so **asking buyers for reviews is the highest-leverage SEO action
> available right now** — it needs no code.

### Shipping and returns in Product schema

Google reads `shippingDetails` and `hasMerchantReturnPolicy` for merchant
listings and shows delivery cost and timing next to a product. Every value
traces to something already published: the rate comes from `shippingFeeFor()`,
the same function checkout charges against, and the 1–3 day handling, 3–7 day
transit and 30 day return window are the shipping policy page as written.

Physical goods only. A download has no shipping, and a policy phrased around
"unopened products in original condition" does not cover a PDF.

> **No product will show a "free delivery" annotation.** Free shipping starts at
> $150 and the catalogue tops out at $59.99, so a single-unit order — which is
> what a product page offers — is always the $6.99 rate. The code already
> handles the threshold and emits `0` for anything listed above it. This is
> correct behaviour, not a bug to chase.

### Category pages — 11 August 2026

`/shop/mens-gear` and `/shop/womens-gear` **rendered an empty grid** while being
prerendered and listed in `sitemap.xml`. Neither is a value of the `Category`
union and no product carries one, so the old filter — `p.category === category`
— was never true. Two of the site's 36 indexed URLs were empty pages promising
men's and women's gear.

Both now resolve from `subcategory`, which is where the gender split is actually
recorded, and list three products each. One resolver,
`productsInShopCategory()` in `src/data/products.ts`, is shared by the grid and
by the head builder, so the schema and the page cannot disagree about what the
category contains.

> Gender pages list **that gender's apparel only**. Training systems and
> accessories are unisex; putting them on both would leave the two URLs ~70%
> identical to each other and to `/shop/all`, which is the near-duplicate
> listing thin-content demotion exists to catch. Widen this only with a reason.

Every category page also carries **`ItemList`** now — deliberately a summary
list of position and `url`, not nested `Product` objects. The full Product
schema lives on the product page, and a partial second copy here would give
Google two descriptions of the same item to reconcile. An empty category emits
no `ItemList` at all rather than one describing a collection of nothing.

Product offers now declare **`itemCondition: NewCondition`**, a recommended
merchant-listing field and unambiguous here — everything is sold new, direct.

### Soft 404s: unknown URLs served the home page — fixed 16 September 2026

Search Console's Page indexing report flagged **2 pages as Soft 404**. The cause
was not either of those pages:

```
curl -s /                 | md5sum  ->  7ceb562f946268f23ec53779789927a3
curl -s /no-such-page-xyz | md5sum  ->  7ceb562f946268f23ec53779789927a3
```

**Every unknown URL returned a byte-identical copy of the home page, under a
`200`, carrying the home page's canonical.** `not_found_handling` was
`"single-page-application"`, which serves `dist/index.html` for anything
unmatched — and `dist/index.html` *is* the prerendered home page. A visitor
still saw the right thing, because React boots and renders `NotFoundPage`, but
the HTTP status never said so and a crawler never runs that far.

**The fix has three parts:**

- `vite.config.ts` now also emits **`dist/404.html`** — the same shell with
  `notFoundHead()` instead of the home page's: `noindex`, and deliberately **no
  canonical**, since a canonical on an error page asserts the URL is a real
  destination.
- **`worker/index.ts`**, a fallback handler, and `main` in `wrangler.toml`.
- `not_found_handling` is now `"none"`, which is what routes a miss to that
  handler.

> **This did not make the site a scripted Worker.** Static assets match first and
> are served without invoking the Worker (`run_worker_first` defaults to false),
> so every real page keeps the no-JavaScript-in-the-request-path property the
> site had when it was assets-only. The handler runs only on a miss — which also
> means a bug in it cannot break a page that exists.

**Why not `not_found_handling = "404-page"`**, which would have needed no Worker
at all: it would break `/account/orders/<id>`. Order ids are unbounded, so that
route cannot be prerendered, and it is the one real page on the site that
depends on the SPA fallback. `"404-page"` would serve a customer's order page a
404. `SPA_FALLBACK_PREFIXES` in the Worker is what keeps the fallback alive
exactly where it is load-bearing — keep that list as short as it is.

Verified with `wrangler dev` (never `vite preview`, see §2 of `HANDOFF.md`):

| Request | Before | After |
|---|---|---|
| `/`, `/product/tour-pure-men`, `/shop/all`, `/robots.txt` | 200 | 200 |
| `/product/tour-pure-men/` | 307 → no slash | 307 → no slash |
| `/no-such-page-xyz`, `/product/does-not-exist`, `/shop/not-a-category` | **200 + home page** | **404 + not-found shell** |
| `/account/orders/abc123` | 200 | 200 |

### Internal linking — 11 August 2026

The guide pages are the assets aimed at winnable informational searches (§3), but
nothing connected them to the catalogue:

- `/tour-pure-guide` linked to **nothing at all** — it named the Tour Pure
  throughout and offered no way to reach it. It now ends with the Tour Pure
  products, derived from the catalogue rather than hand-listed.
- Product pages linked to **no guide**. Tour Pure and Feel Right products now
  carry a "Read the full training guide" link, keyed off the same ids that
  decide which overview block renders, so a product cannot show a guide's
  content while linking nowhere.
- `/beginners` linked to two products and the safety page, but neither guide.
  It now links to both.

> **Open decision — duplicated guide content.** `ProductPage` renders the whole
> of `TourPureOverview` and `FeelRightBandOverview` inline. The identical block
> is therefore the substance of `/tour-pure-guide` *and* of the three
> `/product/tour-pure-*` pages — four URLs, one body of content, with the same
> again across the two Feel Right URLs. It is in the rendered DOM rather than the
> prerendered HTML, but Google renders JavaScript, so it reads it.
>
> This is not a penalty; it splits relevance between the URLs and lets Google
> pick which one ranks for a how-to query. Left alone deliberately — the block
> is substantial product-page content and probably earns its place for
> conversion. The fix, if wanted, is a condensed version on the product page and
> the full method only on the guide.

### Google Merchant Center feed

`https://www.dominusgolf.com/google-merchant.xml`, built from the same `products`
array the storefront renders, so a new product is listed with no spreadsheet to
maintain.

36 entries from 12 physical products, because **apparel is one entry per size**.
Google requires `size`, `color`, `gender`, `age_group` and an `item_group_id`
tying the sizes together; a single entry listing five sizes gets disapproved.

Three deliberate choices, each because the alternative would be a data-quality
violation rather than merely worse:

- **`identifier_exists: no`.** Own-brand goods with no barcode and no
  manufacturer part number. The blank garment's model in `specs` is the
  supplier's, not this product's, so it is not an MPN. Inventing a GTIN is a
  policy breach.
- **No `google_product_category`.** Its values must match Google's taxonomy
  exactly, and a wrong string is worse than letting Google classify the item.
  `product_type` carries our own path instead, which is free text.
- **The eBook is excluded.** Merchant Center treats digital goods under
  different rules and a shipping declaration is meaningless for a download.

Sold-out items stay in the feed as `out_of_stock` rather than being removed —
pulling a listing loses its history and it starts from scratch when stock
returns.

---

## 2. Do these by hand

Three things cannot be fixed from the repo. Roughly in order of value.

### 2.1 Redirect the apex to www — Cloudflare — ✅ DONE 10 Aug 2026

Verified live: `301`, path and query preserved, a single hop, and `www` still
answers `200`. Kept below as the record of what was configured.

**The problem.** `https://dominusgolf.com/product/tour-pure-men` returned `200`
with the full page. So did the `www` version. Every URL on the site existed on
two hostnames. The canonical tag points at `www`, so Google would *probably*
have consolidated them, but "probably" is doing real work in that sentence — the
fix is to stop serving the duplicate.

**Fix.** Cloudflare dashboard → **dominusgolf.com** → **Rules** → **Redirect
Rules** → *Create rule*:

- Name: `apex to www`
- If — *Custom filter expression*, field **Hostname**, operator **equals**,
  value `dominusgolf.com`
- Then — **Dynamic**, expression:
  ```
  concat("https://www.dominusgolf.com", http.request.uri.path)
  ```
- Status code **301**, and tick **Preserve query string**.

**Check it.**
```bash
curl -sI https://dominusgolf.com/product/tour-pure-men | head -2
# want: HTTP/2 301  +  location: https://www.dominusgolf.com/product/tour-pure-men
```

Leave the apex Custom Domain on the Worker in place — the redirect rule runs
before the Worker, and removing the domain would break the redirect.

### 2.2 Unblock AI crawlers — Cloudflare — ⚠️ REOPENED 16 Sep 2026

**Partly done.** The `robots.txt` half holds: the live file is exactly
`public/robots.txt`, with no managed block and one `User-agent: *` group.

**The block moved rather than lifted.** Re-tested 16 September 2026 by
user-agent, and two crawlers are being refused at the edge:

```
ClaudeBot              403
GPTBot                 403
OAI-SearchBot          200
PerplexityBot          200
Bingbot                200
Googlebot              200
plain curl / browser   200
```

`robots.txt` is clean and a plain `curl` gets through, so this is not Bot Fight
Mode and not robots — it is a rule keyed on those two user-agents. The split is
exactly Cloudflare's own **AI training** versus **AI search** categories: the
crawlers that produce live citations are allowed, the two that feed training
corpora are not.

So the practical damage is smaller than the August note assumed. ChatGPT and
Perplexity can still read and cite the store today, via OAI-SearchBot and
PerplexityBot. What is blocked is inclusion in the next model's training data —
whether Claude and ChatGPT *know* the brand unprompted a year from now.

> **Caveat on the test above.** It spoofs each user-agent from an ordinary IP.
> Cloudflare also verifies crawlers by IP, so a real ClaudeBot from Anthropic's
> range could be treated differently from this test. The authoritative check is
> the per-crawler request and block counts in **AI Crawl Control** — read those
> before concluding anything from the table.

**Decision reaffirmed 16 Sep 2026: allow them**, consistent with the original
call below. Steps in §2.2a.

**The problem.** Cloudflare injected a *Managed* `robots.txt` above ours. The
live file blocked `GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`,
`Bytespider`, `Amazonbot`, `Applebot-Extended` and `meta-externalagent` with
`Disallow: /`, and sets `Content-Signal: ai-train=no`. Nobody in this repo asked
for that; it is a zone-level default.

Ordinary Google search is unaffected (`search=yes`, Googlebot is not blocked).
What it does block is Dominus products being cited in ChatGPT, Claude and
Perplexity shopping answers — a channel that matters more each year for a
direct-to-consumer brand.

**Decision taken: allow them,** so the store is visible to every customer
wherever they search.

**Fix.** Cloudflare dashboard → **dominusgolf.com** → **AI Crawl Control**
(older accounts: **Security** → **Bots** → *AI Scrapers and Crawlers*) → set it
to **allow**, and turn off the managed `robots.txt` / content-signals injection.

The setting has moved between menus across Cloudflare releases; if it is not
where this says, search the dashboard for "AI Crawl" or "content signals".

**Check it.**
```bash
curl -s https://www.dominusgolf.com/robots.txt | head -20
# want: no "BEGIN Cloudflare Managed content" block, no ClaudeBot/GPTBot Disallow
```

This half is confirmed good as of 16 Sep 2026 — the managed block is gone and
there is now one `User-agent: *` group, ours.

### 2.2a Lift the edge block on ClaudeBot and GPTBot — ✅ DONE 16 Sep 2026

Unblocked in the Cloudflare dashboard and verified live. All nine crawlers
tested now return `200`, and ClaudeBot and GPTBot receive the real prerendered
page — correct `<title>` and Product schema, not a challenge:

```
ClaudeBot 200   GPTBot 200   OAI-SearchBot 200   PerplexityBot 200
Googlebot 200   bingbot 200  CCBot 200  Applebot-Extended 200  Google-Extended 200
```

The original instructions are kept below in case it regresses — this setting has
silently reverted once already, which is what §2.2 records.

#### Original instructions

`robots.txt` is only advisory. These two are being refused with a `403` before
robots is ever consulted, so §2.2's fix is not finished.

**Where to look, in this order.**

1. **AI Crawl Control** (dash → `dominusgolf.com` → **AI Crawl Control**). This
   is the likeliest home of the block. It lists each crawler with its request
   count and an allow/block toggle. Set **ClaudeBot** and **GPTBot** to *Allow*.
   Read the counts while there — they are the authoritative answer to whether
   the real crawlers are being blocked, unlike the user-agent test in §2.2.
2. **Security → WAF → Custom rules.** Look for any rule matching
   `cf.verified_bot_category` or a `user_agent contains` expression naming these
   two. A rule here overrides the AI Crawl Control toggle.
3. **Security → Bots.** If *Block AI Scrapers and Crawlers* is on, it blocks the
   training category wholesale and the per-crawler toggles will not stick.

**Check it.** Run this after the change. It must print `200` on all four lines:

```bash
for ua in ClaudeBot GPTBot OAI-SearchBot PerplexityBot; do
  printf "%-16s %s\n" "$ua" \
    "$(curl -s -o /dev/null -w '%{http_code}' \
       -A "Mozilla/5.0 (compatible; $ua/1.0)" \
       https://www.dominusgolf.com/tour-pure-guide)"
done
```

Then confirm in AI Crawl Control a day or two later that the block count for
both has stopped rising.

> **If you change your mind and want them kept out:** that is a legitimate
> choice, and the current live state already implements it. Do it in
> `public/robots.txt` rather than at the WAF, so the refusal is a documented
> policy in the repo instead of a dashboard setting nobody can see from the
> code — and update §2.2 to say so.

### 2.3 Verify Google Search Console — ✅ DONE 16 Sep 2026

Domain property verified, and `sitemap.xml` submitted and **processed
successfully**: 35 discovered pages, matching the 35 URLs the live sitemap
carries, so nothing was rejected. `Shopping → Product snippets` has appeared in
the property, which means Google has detected the Product structured data.

`Discovered videos: 0` is expected — the site emits no `VideoObject` schema.
See §3c for why that is worth changing.

Two notes for whoever reads this next:

- **The left nav does not exist until the property is verified.** If Sitemaps
  cannot be found in the menu, the property is unverified — that is the cause,
  every time.
- **"Discovered" is not "indexed."** 35 discovered means Google read the
  sitemap. `Indexing → Pages` is the number that matters, and it lags by days.

**The problem this solved.** Without Search Console there was no view of
impressions, queries, click-through rate, indexing coverage or structured-data
errors. Every recommendation in §3 was guesswork.

**Status.** The verification TXT is published on the apex and resolves through
Google's own public resolver:

```
google-site-verification=h7ofB8UTkAkEfi0S05i36gNEZU1KVNPBxcZvj_Zo0l8
```

Google's Cloudflare integration adds this record for you rather than showing a
value to copy, which is confusing if you are looking for a TXT to paste by hand
— there is nothing left to add. Press **Verify** on the property.

A Domain property is the right choice here: it covers apex, `www` and both
protocols in one.

Note GA4 is **not** a usable verification route on this site. The analytics code
exists but `VITE_GA4_ID` is unset, so nothing is running on the live pages.

**Then, inside Search Console:**
1. **Sitemaps** → submit `https://www.dominusgolf.com/sitemap.xml`.
2. **URL Inspection** on a product URL → *Test live URL* → confirm the Product
   result is detected with a rating.
3. Watch **Enhancements → Merchant listings** over the following week for
   structured-data errors.

### 2.4 Connect the Merchant Center feed

The feed is generated and live, but nothing consumes it until a Merchant Center
account points at it.

1. <https://merchants.google.com> → create an account for `dominusgolf.com`.
2. Verify and claim the website. It offers the same methods as Search Console;
   the domain is already verified there, which usually makes this one click.
3. **Products → Data sources → Add product source → scheduled fetch**, with
   `https://www.dominusgolf.com/google-merchant.xml`, fetched daily.
4. Under **Growth / Manage programs**, enable **free listings**. Without it the
   feed only serves paid Shopping ads, which is not the point here.
5. Set the account-level **shipping** and **returns** policies to match
   `docs`-documented terms, or Merchant Center overrides the per-item values.

Expect disapprovals on the first fetch and read them rather than assuming the
feed is wrong — the common ones are account-level policy gaps, not item data.

**Check it.**
```bash
curl -s https://www.dominusgolf.com/google-merchant.xml | grep -c "<item>"   # 36
```

Worth doing at the same time: **Bing Webmaster Tools**
(<https://www.bing.com/webmasters>) can import directly from Search Console, and
Bing feeds ChatGPT's web results.

### 2.5 Turn on analytics — ✅ DONE 16 Sep 2026

**Live and verified.** The GA4 measurement ID is in the deployed bundle with
`gtag/js`, `dataLayer` and `send_page_view` all present. Confirmed again on
16 Sep 2026 after a push to `main`, which proves the Cloudflare variable is a
**build** variable and that a push will not silently strip analytics.

The ID itself is deliberately not written down here: it is not a secret (it
ships in the public bundle), but the repo rule is no env values in tracked
files. It lives in the Cloudflare build variables and in local
`.env.production`. To read it back:

```bash
js=$(curl -s https://www.dominusgolf.com/ | grep -o '/assets/index-[^"]*\.js' | head -1)
curl -s "https://www.dominusgolf.com$js" | grep -o 'G-[A-Z0-9]\{10\}' | head -1
```

Both places that need the variable have it: the Cloudflare build variables (for
Workers Builds, i.e. a push to `main`) and local `.env.production` (for
`npm run deploy:site`). See the note at the end of this section for why both are
required and why they are different files.

The Meta Pixel is deliberately still unset; `fbevents` is absent from the bundle
and should stay that way unless paid social is actually planned.

The history below is kept because the diagnosis is reusable.

**The problem.** Nothing was measuring the site. `VITE_GA4_ID` and
`VITE_META_PIXEL_ID` were both unset, so `initAnalytics()` injected nothing and
the live pages made no tracking request at all:

```bash
curl -s https://www.dominusgolf.com/ | grep -c googletagmanager   # 0
```

There is no code to write. `src/lib/analytics.ts` is complete and every call
site is already wired — `page_view` on each route change, `view_item`,
`add_to_cart`, `begin_checkout`, `purchase` and `sign_up`, each emitting both
the GA4 and the Meta Pixel shape. It is missing only an ID.

Until this runs there is no CTR, no conversion rate, no landing-page data and no
way to tell whether anything in §3 worked. Everything else on this page is a
guess without it.

**Fix.**

1. <https://analytics.google.com> → create a GA4 property for `dominusgolf.com`
   → **Admin → Data streams → Web**. Copy the measurement ID, `G-XXXXXXXXXX`.
2. Cloudflare dash → **Workers & Pages → `tit` → Settings → Build → Variables
   and Secrets** → add:

   ```
   VITE_GA4_ID = G-XXXXXXXXXX
   ```

   It must be a **build** variable, not a Worker secret or runtime binding. Vite
   inlines `import.meta.env.*` at build time, so a runtime binding would never
   be read — the value has to exist when Workers Builds runs `npm run build`.
3. Push to `main` (or re-run the last build from the dashboard). A rebuild is
   required; the variable does not apply to an already-built deploy.
4. Optional, same procedure: `VITE_META_PIXEL_ID` for the Meta Pixel. Only worth
   setting if paid social is actually planned — it loads a third-party script on
   every page for nothing otherwise.

**Check it — against the live bundle, never `dist/`.**

```bash
# 1. The tag is now on the page
curl -s https://www.dominusgolf.com/ | grep -c googletagmanager     # want: 1+

# 2. The ID really got inlined into the shipped JS
js=$(curl -s https://www.dominusgolf.com/ | grep -o '/assets/index-[^"]*\.js')
curl -s "https://www.dominusgolf.com$js" | grep -o 'G-[A-Z0-9]\{8,\}' | head -1
```

Then open the site and confirm GA4 **Reports → Realtime** shows the visit.

**Diagnosing from the bundle.** These two failures look identical on the page
but are different in the JS, and telling them apart saves an hour:

| What you see in the live bundle | Cause |
|---|---|
| `gtag/js` **absent entirely** | The env var was unset *at build time*. `if (GA4_ID)` became `if (undefined)` and Rollup dead-code-eliminated the whole block. |
| `gtag/js` present, wrong `G-` string | The ID itself is wrong. |

Do not grep for a bare `G-[A-Z0-9]\{8,\}` — it false-positives on the image
filename `IMG-20251211-WA0000`. Match the literal ID.

> ⚠️ **Two places, and both are needed.**
>
> - **`.env.production`** (gitignored, on the dev machine) is what a local
>   `npm run deploy:site` reads. It is deliberately *not* `.env`: `wrangler
>   deploy` injects `.env` into the build process environment and Vite ranks
>   process env above every `.env.*` file, so a value in `.env` would override
>   this one and be impossible to change per-mode. Keeping it in
>   `.env.production` also means `npm run dev` never loads it, so local
>   development makes no tracking request and never pollutes the property.
> - **The Cloudflare build variable** is what Workers Builds reads. It builds in
>   Cloudflare's CI and never sees `.env.production`.
>
> **A push to `main` rebuilds via Workers Builds.** If only the local file is
> set, that rebuild ships a bundle with no analytics and silently undoes this
> whole section — with no error anywhere. Set both.

**Then link the two properties.** GA4 **Admin → Product links → Search Console
links**. That is what puts real search queries next to landing-page behaviour;
separately, neither tells you which query produced a sale.

---

## 3. What will and will not move the rankings

The stated goal is ranking first for searches like *golf*, *golf training* and
*golf equipment*.

**Those specific head terms are not winnable, and no technical change in this
repo will make them winnable.** Page one for "golf equipment" is Callaway,
TaylorMade, PGA Superstore, Golf Galaxy and Amazon — twenty-year-old domains
with tens of thousands of referring domains and dedicated SEO teams. Ranking
there is a function of domain authority and backlinks accumulated over years,
not of markup quality. Dominus Golf's markup is, at this point, genuinely better
than most of theirs; it does not matter at that end of the spectrum.

What *is* winnable is the specific, high-intent end of the same demand, where
the competition is thin and the buyer is already close to purchase:

| Realistic target | Why it is winnable |
|---|---|
| `swing path trainer`, `swing plane training aid` | Exactly what Tour Pure is; few strong pages compete |
| `golf tempo trainer band`, `golf connection band drill` | Feel Right Band's actual job |
| `Tour Pure golf`, `Dominus Golf` | Brand terms — should be #1, verify in Search Console |
| `how to fix an over the top swing`, `golf swing path drills` | Informational; feeds the guide pages that already exist |
| `golf training aid for beginners` | `/beginners` already targets this |

The two guide pages (`/tour-pure-guide`, `/feel-right-band-guide`) and
`/beginners` are the right shape for this and are the assets worth expanding.
Long-tail informational content that answers a real swing problem, and links to
the product that solves it, is how a new store in this category actually earns
traffic.

**The honest ranking order of effort, highest return first** — revised
16 Sep 2026, after the audit that added §2.2a, §2.5 and §3a:

1. **Turn on analytics (§2.5).** Promoted to first not because it ranks
   anything, but because it is cheap and everything below is unmeasurable
   without it. Half a day, once.
2. **Put the target keywords in the titles (§3a).** The largest on-page gap on
   the site, and the cheapest of the ranking items. Proposal drafted in
   `docs/seo-copy-proposal.md`.
3. **Collect product reviews.** Directly feeds §1's star ratings, and review
   text is real content on the page. Still 4 reviews as of 16 Sep 2026.
4. **Backlinks.** Golf coaches, club newsletters, YouTube reviewers, the pros
   already on `/pros`. This is the single biggest lever on competitive terms and
   the only one that cannot be done in code.
5. **Depth on the guide pages.** Answer one swing problem per page, properly.
   ~540 and ~470 words today, which is thin for the queries they target.
6. **The dashboard fixes above.** Necessary hygiene, but hygiene.

Set expectations on timing: a new domain that does all of this well typically
sees long-tail movement in 3–6 months, not weeks.

### 3a. The titles carried none of the target keywords — fixed 16 Sep 2026

The table above has listed the winnable terms since August. Audited against the
live site on 16 September: **not one of those phrases appears in any title, H1
or meta description on any of the 35 indexed URLs.**

The live title of the flagship product is `Tour Pure Men | Dominus Golf` — a
product name and a brand, nothing a stranger would ever type. The strongest
on-page ranking signal the site has is spent on a string with no search volume.

**Fixed the same day.** Full before/after is in
**`docs/seo-copy-proposal.md`**, along with the three decisions it was waiting
on. Every one of the 36 indexed pages now has a title at or under 60 characters
and a description between 110 and 160.

The mechanism is a **`seoTitle` field on `Product`** (plus `seoDescription`),
driving the `<title>` tag and the on-page `<h1>` only. `product.name` stays
canonical and still runs the cart, the Square checkout line item and the
Merchant Center feed — so search sees "Tour Pure Swing Path Trainer - Men's"
while a receipt still says "Tour Pure Men", and renaming for search did not
trigger a Google re-review of all 36 feed entries. `SHOP_CATEGORIES` gained the
same `label` / `seoTitle` split.

That also fixed a live duplication: `ShopPage.tsx` kept its **own**
`categoryLabels` table for the visible heading, and it had already drifted from
this one — `pageSeo.ts` said "Golf Training Systems" where the page heading said
"Training Systems". ShopPage now derives both from `SHOP_CATEGORIES`. Same class
of bug `productsInShopCategory()` exists to prevent.

Two findings are worth repeating here because they were category errors rather
than wording:

- **"Tee" means the plastic peg.** Five apparel products are titled `Icon Tee`,
  `Wordmark Tee`, `Performance Tee`. In golf that word points at a $8 Amazon
  100-pack, not a shirt. These pages are aimed at the wrong query entirely.
- **The brand was spelled two ways** — `Feel Right Band` in the product data,
  the route and the components, `Feel Rite Band` in the guide title, the
  `/beginners` link and the docs. Google treats those as different strings, so
  the brand's own search volume was split in half. **Settled on "Feel Right"**
  (16 Sep 2026), which the product, the live URL and every component already
  used, so no URL had to move and no redirect was needed. The image file is
  still named `FeelRiteGolfBand__cc34ac6f.webp`: a filename is not user-facing
  copy, and renaming it would invalidate a cached asset for no gain.

### 3b. The prerendered HTML has a head but no body — 16 Sep 2026

Every prerendered file is ~6 KB of correct metadata wrapped around an empty
`<div id="root"></div>`. §1 is right that this solves the head; it does not put
any *content* in the static HTML.

Googlebot renders JavaScript, so it does read the page — just on a second pass,
which delays indexing and re-indexing after an edit. The sharper cost is that
every crawler which does not render JS sees a page about nothing, which
undercuts the whole point of the §2.2 decision to let AI crawlers in.

Not urgent, and a real piece of work rather than a setting: the prerenderer
would need to render each route's component tree to HTML, which means the data
layer has to be reachable outside the router. Worth doing after the items above.

### 3c. Schema types not yet emitted — 16 Sep 2026

§1's stack is strong: Product, Offer with shipping and returns, AggregateRating,
BreadcrumbList, ItemList, Organization and WebSite. Three types are missing that
this site has the underlying content for.

| Type | Where | Why |
|---|---|---|
| `Person` | `/leroy-bates`, `/gabe-salvanera` | Two pages about named golf professionals currently carry no entity markup at all. Cheap, and it feeds the same knowledge-graph tie as `sameAs`. |
| `VideoObject` | wherever YouTube content is embedded or linked | Search Console reports `Discovered videos: 0`. Video results are a distinct SERP surface and a strong one for training content — an instructional query often returns video above text. The channel is already listed in `SOCIAL_PROFILES`. |
| `Review` | product pages | Only the *aggregate* is emitted. Individual reviews with author and body are eligible for their own treatment, and the review text is already on the page. Gated on there being more than 4 reviews. |

Deliberately still **not** worth adding: `FAQPage` and `HowTo`. Google
deprecated both for sites like this one, and §3 is right to call them dead ends.

---

## 4. Routine upkeep

- **Adding a product** — nothing to do. `sitemap.xml`, the prerendered page and
  the Product schema all come from `src/data/products/*`. Run `npm run og:images`
  for its share image.
- **After changing route copy** in `pageSeo.ts`, keep titles under ~60
  characters and descriptions 120–155, or Google truncates them.
- **`lastmod`** comes from `src/data/fileDates.generated.ts`, a committed
  snapshot of each source file's last commit date, mapped to URLs by
  `routeSourceFiles()` in `pageSeo.ts`. A new page needs an entry in
  `PAGE_SOURCE` or it falls back to the build date.

  **Run `npm run seo:dates` and commit the result after editing page or product
  content**, or the sitemap keeps advertising the old date.

  It is deliberately *not* part of `npm run build`. Cloudflare builds from a
  shallow clone, and a shallow clone does not report "unknown" — `git log -1 --
  <file>` returns the **tip commit's** date for every file, because with no
  parent to diff against git treats the whole tree as introduced by that commit.
  Regenerating during the build therefore rewrote all 42 dates to the day of the
  deploy and shipped a uniform sitemap, which is the exact thing per-URL dates
  exist to avoid. The script now refuses to write in a shallow clone.
- **Never** add `aggregateRating` from anything but the generated snapshot.
