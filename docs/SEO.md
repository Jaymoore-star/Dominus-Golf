# SEO

What is already built, what still has to be done by hand in a dashboard, and
what actually moves rankings for this site.

Written 10 August 2026.

---

## 1. What the code does

Nothing here needs doing again — it is background for the sections below.

| Piece | Where |
|---|---|
| Per-route title, description, canonical, Open Graph, Twitter | `src/lib/pageSeo.ts` (copy) + `src/lib/seo.ts` (assembly) |
| 48 prerendered HTML files, one per route, head baked in | `prerenderPlugin` in `vite.config.ts` |
| `sitemap.xml`, 36 indexed URLs, real per-URL `lastmod` | `sitemapPlugin` in `vite.config.ts` |
| `robots.txt` | `public/robots.txt` |
| JSON-LD: Organization, WebSite, Product, AggregateRating, BreadcrumbList | `src/lib/seo.ts` |
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

### 2.2 Unblock AI crawlers — Cloudflare — ✅ DONE 10 Aug 2026

Verified live: `robots.txt` is now exactly `public/robots.txt` with no managed
block and one `User-agent: *` group. Checked past the advisory layer too —
GPTBot, ClaudeBot, PerplexityBot and Googlebot each get `200` **and the real
prerendered page** (title, Product schema, price, canonical), so nothing is
being served a challenge instead.

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

Note there are currently **two `User-agent: *` groups** in the live file — the
managed one and ours. Crawlers merge same-agent groups, so our `Disallow` rules
still apply, but removing the managed block also removes that oddity.

### 2.3 Verify Google Search Console — DNS done, verification to confirm

**The problem.** Without Search Console there is no view of impressions,
queries, click-through rate, indexing coverage or structured-data errors. Every
recommendation in §3 is guesswork until this exists.

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
| `golf tempo trainer band`, `golf connection band drill` | Feel Rite Band's actual job |
| `Tour Pure golf`, `Dominus Golf` | Brand terms — should be #1, verify in Search Console |
| `how to fix an over the top swing`, `golf swing path drills` | Informational; feeds the guide pages that already exist |
| `golf training aid for beginners` | `/beginners` already targets this |

The two guide pages (`/tour-pure-guide`, `/feel-right-band-guide`) and
`/beginners` are the right shape for this and are the assets worth expanding.
Long-tail informational content that answers a real swing problem, and links to
the product that solves it, is how a new store in this category actually earns
traffic.

**The honest ranking order of effort, highest return first:**

1. **Collect product reviews.** Directly feeds §1's star ratings, and review
   text is real content on the page. Nothing else here is as cheap.
2. **Backlinks.** Golf coaches, club newsletters, YouTube reviewers, the pros
   already on `/pros`. This is the single biggest lever on competitive terms and
   the only one that cannot be done in code.
3. **Depth on the guide pages.** Answer one swing problem per page, properly.
4. **The three dashboard fixes above.** Necessary hygiene, but hygiene.

Set expectations on timing: a new domain that does all of this well typically
sees long-tail movement in 3–6 months, not weeks.

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
