/**
 * Snapshots the real product review ratings from Supabase into a generated
 * TypeScript module, so the build can put genuine star ratings into Google.
 *
 *   npm run seo:reviews
 *
 * Why a generated file rather than a live fetch at prerender time:
 *
 * The rating has to appear in **two** places and they must agree. The prerender
 * plugin bakes JSON-LD into the static HTML, and the router re-emits the same
 * JSON-LD once React mounts (useStaticHeadCleanup removes the static copy). If
 * only the build knew the rating, hydration would silently strip aggregateRating
 * out of the rendered DOM — and the rendered DOM is what Google reads for rich
 * results. A module both sides import keeps them identical by construction.
 *
 * The trade-off is that ratings are as fresh as the last build. That is fine:
 * they are a search-results signal, not the on-page review list, which the
 * product page still fetches live from Supabase on every visit.
 *
 * Only the anon key is needed — product_reviews is public-read under RLS
 * (supabase/migrations/0001_product_reviews.sql), which is the same policy that
 * lets a signed-out shopper see reviews at all.
 *
 * Failure is deliberately non-fatal. This runs as part of `npm run build`, and
 * a build must not break because Supabase blipped or because CI has no keys —
 * it just keeps the committed snapshot. That is why the generated file is
 * tracked in git rather than ignored.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const OUT = path.join(root, "src", "data", "reviewSummaries.generated.ts")

/**
 * Reads VITE_* keys from .env, falling back to the real environment.
 *
 * Vite loads .env itself, but this script runs as a plain node process before
 * vite starts, so nothing has parsed it yet. In CI there is no .env file and the
 * values arrive as environment variables instead.
 */
function readEnv(name) {
  if (process.env[name]) return process.env[name]

  const envFile = path.join(root, ".env")
  if (!existsSync(envFile)) return undefined

  const match = readFileSync(envFile, "utf8").match(
    new RegExp(`^${name}\\s*=\\s*(.*)$`, "m"),
  )
  return match ? match[1].trim().replace(/^["']|["']$/g, "") : undefined
}

/** Bail out without touching the snapshot, and without failing the build. */
function skip(reason) {
  console.log(`  \x1b[33m-\x1b[0m review ratings: ${reason}`)
  if (!existsSync(OUT)) writeFile(new Map())
  process.exit(0)
}

function writeFile(summaries) {
  const entries = [...summaries.entries()].sort(([a], [b]) => a.localeCompare(b))

  const body = entries
    .map(
      ([id, { average, count }]) =>
        `  ${JSON.stringify(id)}: { average: ${average}, count: ${count} },`,
    )
    .join("\n")

  const contents = `/**
 * GENERATED FILE - do not edit by hand.
 *
 * Written by scripts/fetch-review-summaries.mjs, which runs as part of
 * \`npm run build\`. Regenerate with \`npm run seo:reviews\`.
 *
 * A snapshot of the real ratings in the Supabase product_reviews table, used to
 * emit aggregateRating in Product JSON-LD. Both the prerenderer and the router
 * read this so the static HTML and the hydrated DOM carry the same rating.
 *
 * Products with no reviews are absent rather than zero: schema.org has no way to
 * say "rated zero out of five", and inventing a rating is the exact thing Google
 * penalises.
 */

export type ReviewSummarySnapshot = { average: number; count: number };

export const REVIEW_SUMMARIES: Record<string, ReviewSummarySnapshot> = {
${body}
};
`

  // Only touch the file when the ratings actually changed.
  //
  // `wrangler dev` runs `npm run build` as its custom build and watches src/, so
  // an unconditional write means: build -> file changes -> rebuild -> forever.
  // Writing identical bytes is also a spurious git diff on every build.
  if (existsSync(OUT) && readFileSync(OUT, "utf8") === contents) {
    console.log(
      `  \x1b[32m/\x1b[0m review ratings: unchanged (${entries.length} product(s) with real reviews)`,
    )
    return
  }

  writeFileSync(OUT, contents, "utf8")
  console.log(
    `  \x1b[32m/\x1b[0m review ratings: ${entries.length} product(s) with real reviews`,
  )
}

const url = readEnv("VITE_SUPABASE_URL")
const key = readEnv("VITE_SUPABASE_ANON_KEY")

if (!url || !key) skip("no Supabase keys, keeping the existing snapshot")

let rows
try {
  const response = await fetch(
    `${url}/rest/v1/product_reviews?select=product_id,rating`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } },
  )

  // A missing table means the migration has not been run yet. That is the same
  // "reviews are unavailable" state the client degrades to, not an error.
  if (!response.ok) skip(`Supabase returned ${response.status}, keeping the existing snapshot`)

  rows = await response.json()
  if (!Array.isArray(rows)) skip("unexpected response shape, keeping the existing snapshot")
} catch (error) {
  skip(`${error.message}, keeping the existing snapshot`)
}

const totals = new Map()
for (const row of rows) {
  const entry = totals.get(row.product_id) ?? { sum: 0, count: 0 }
  entry.sum += row.rating
  entry.count += 1
  totals.set(row.product_id, entry)
}

const summaries = new Map()
for (const [productId, { sum, count }] of totals) {
  // One decimal place, matching summariseReviews() in src/lib/reviews.ts so the
  // number in the search result is the number shown on the page.
  summaries.set(productId, {
    average: Math.round((sum / count) * 10) / 10,
    count,
  })
}

writeFile(summaries)
