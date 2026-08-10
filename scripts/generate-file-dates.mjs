/**
 * Snapshots the last-commit date of every file that dates a sitemap URL.
 *
 *   npm run seo:dates
 *
 * Why this is not just `git log` at build time, which is what it used to be:
 *
 * Cloudflare Workers Builds clones shallowly. `git log -1 -- <file>` returns
 * nothing there, so every URL fell back to the build date and sitemap.xml went
 * out with all 36 entries stamped the same day - the exact uniform-timestamp
 * problem the per-URL dates were added to fix, failing silently because the
 * fallback is deliberately quiet.
 *
 * So the dates are resolved here, where the full history exists, and committed.
 * The build then reads the snapshot instead of asking git.
 *
 * Keyed by repo-relative file path rather than by route: this script needs no
 * knowledge of routing, and routeSourceFiles() in src/lib/pageSeo.ts stays the
 * single place that maps a URL to the files behind it.
 *
 * Like the review snapshot, a git failure keeps the committed values rather
 * than overwriting good dates with worse ones - which is what would otherwise
 * happen the first time this ran in CI.
 */

import { execFileSync } from "node:child_process"
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const OUT = path.join(root, "src", "data", "fileDates.generated.ts")

/** Directories holding files that decide when a page last changed. */
const TRACKED = ["src/pages", "src/data"]

function walk(dir) {
  const abs = path.join(root, dir)
  if (!existsSync(abs)) return []

  return readdirSync(abs).flatMap((entry) => {
    const rel = `${dir}/${entry}`
    if (statSync(path.join(root, rel)).isDirectory()) return walk(rel)
    // Generated files date themselves on every regeneration, which says nothing
    // about when the page's content changed.
    const isSource = entry.endsWith(".ts") || entry.endsWith(".tsx")
    return isSource && !entry.includes(".generated.") ? [rel] : []
  })
}

function lastCommitDate(file) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim()
    return out ? out.slice(0, 10) : null
  } catch {
    return null
  }
}

/** Whatever is already committed, so a failed lookup keeps its old answer. */
function readExisting() {
  if (!existsSync(OUT)) return {}

  const existing = {}
  for (const [, file, date] of readFileSync(OUT, "utf8").matchAll(
    /"([^"]+)":\s*"(\d{4}-\d{2}-\d{2})"/g,
  )) {
    existing[file] = date
  }
  return existing
}

const dates = readExisting()
let resolved = 0

for (const file of TRACKED.flatMap(walk)) {
  const date = lastCommitDate(file)
  if (date) {
    dates[file] = date
    resolved += 1
  }
}

if (!resolved) {
  console.log("  \x1b[33m-\x1b[0m file dates: git returned nothing, keeping the committed snapshot")
  process.exit(0)
}

const body = Object.entries(dates)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([file, date]) => `  ${JSON.stringify(file)}: ${JSON.stringify(date)},`)
  .join("\n")

const contents = `/**
 * GENERATED FILE - do not edit by hand.
 *
 * Written by scripts/generate-file-dates.mjs, which runs as part of
 * \`npm run build\`. Regenerate with \`npm run seo:dates\`.
 *
 * Last-commit date per source file, used for sitemap.xml <lastmod>. Committed
 * because Cloudflare Workers Builds clones shallowly and cannot work these out
 * for itself - see the script for the full reasoning.
 */

export const FILE_DATES: Record<string, string> = {
${body}
};
`

// Only touch the file when something changed: \`wrangler dev\` runs the build and
// watches src/, so an unconditional write loops the rebuild forever.
if (existsSync(OUT) && readFileSync(OUT, "utf8") === contents) {
  console.log(`  \x1b[32m/\x1b[0m file dates: unchanged (${resolved} files)`)
} else {
  writeFileSync(OUT, contents, "utf8")
  console.log(`  \x1b[32m/\x1b[0m file dates: ${resolved} files dated from git`)
}
