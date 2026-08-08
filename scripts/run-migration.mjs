/**
 * Runs one SQL migration against the live Supabase project from the terminal.
 *
 *   node scripts/run-migration.mjs supabase/migrations/0005_grant_emails.sql
 *
 * Why this exists: the migrations in supabase/migrations were all applied by hand
 * through the dashboard SQL Editor, because there is no psql here and the repo is
 * not a linked Supabase CLI project (supabase/ holds migrations and nothing else).
 * The CLI could do it, but it wants `<timestamp>_name.sql` filenames and a remote
 * migration history that matches — neither is true here, so `db push` would try to
 * replay every earlier migration against a live orders table.
 *
 * This posts to the Management API endpoint the SQL Editor itself uses, so it runs
 * exactly what you would have pasted, and nothing else.
 *
 * It is deliberately not idempotent-aware and keeps no history: it is a way to run
 * a file, not a migration framework. The files themselves are written defensively
 * (`create table if not exists`, `add column if not exists`) so a repeat is safe.
 *
 * Auth is a Supabase **personal access token** (`sbp_…`) from
 * https://supabase.com/dashboard/account/tokens — not the service-role key in
 * .dev.vars, which is a database credential and cannot run DDL through this API.
 */

import { readFileSync } from "node:fs"

const file = process.argv[2]
if (!file) {
  console.error("Usage: node scripts/run-migration.mjs <path-to-.sql>")
  process.exit(1)
}

const token = process.env.SUPABASE_ACCESS_TOKEN
if (!token) {
  console.error(
    [
      "SUPABASE_ACCESS_TOKEN is not set.",
      "",
      "Create one at https://supabase.com/dashboard/account/tokens, then:",
      "",
      "  cmd.exe      set SUPABASE_ACCESS_TOKEN=sbp_xxx",
      '  PowerShell   $env:SUPABASE_ACCESS_TOKEN="sbp_xxx"',
      "  bash         export SUPABASE_ACCESS_TOKEN=sbp_xxx",
      "",
      "It lasts for the terminal session only, which is the point — it is not written to disk.",
    ].join("\n"),
  )
  process.exit(1)
}

/* The project ref is read from .dev.vars rather than hard-coded, so this keeps
   working if the project is ever moved or restored into a new one. */
let projectRef
try {
  const devVars = readFileSync(".dev.vars", "utf8")
  const url = devVars.match(/^SUPABASE_URL=\s*"?([^"\r\n]+)"?/m)?.[1]
  projectRef = url && new URL(url).hostname.split(".")[0]
} catch {
  // Falls through to the check below with a clearer message than ENOENT.
}
if (!projectRef) {
  console.error("Could not read SUPABASE_URL from .dev.vars — run this from the project root.")
  process.exit(1)
}

const sql = readFileSync(file, "utf8")
console.log(`Running ${file} against project ${projectRef}…`)

const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ query: sql }),
})

const text = await res.text()
if (res.ok) {
  console.log(`OK (HTTP ${res.status})`)
  if (text.trim() && text.trim() !== "[]") console.log(text)
} else {
  console.error(`FAILED (HTTP ${res.status})`)
  console.error(text)
  // 401 is by far the most common failure, and the cause is almost always that
  // the service-role key was used instead of a personal access token.
  if (res.status === 401) {
    console.error("\nA 401 usually means the token is not an sbp_… personal access token.")
  }
  /* Set rather than process.exit(): killing the process while fetch's socket is
     still closing trips a libuv assertion on Windows, which buries the error
     message above under a stack trace. Node exits on its own once it drains. */
  process.exitCode = 1
}
