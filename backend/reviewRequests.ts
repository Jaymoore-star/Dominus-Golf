import type { Hono } from "hono"
import { products } from "../src/data/products"
import {
  SITE_URL,
  buttonHtml,
  emailShellHtml,
  escapeHtml,
  hasSupabase,
  isAdmin,
  sendEmail,
  serviceHeaders,
} from "./email"

/**
 * Review-request emails: once an order has had time to arrive, ask the buyer to
 * review what they bought.
 *
 * The site had 4 reviews in total, and reviews are what put stars on the
 * product in Google (docs/SEO.md §1) and what a first-time visitor looks for
 * before trusting a brand they have not heard of. Asking was left to memory.
 *
 * Runs from the daily cron trigger in wrangler.backend.toml. Past orders are
 * included - every order starts with review_requested_at null - so the first
 * run after enabling also asks everyone who bought before this existed.
 *
 * Two locks, both deliberate:
 *   - Nothing is sent unless REVIEW_REQUESTS_ENABLED is "true" on the Worker.
 *     The first run is the backfill, and it goes to real customers, so it
 *     waits until someone has read the preview.
 *   - The preview and the manual run are behind ADMIN_TOKEN:
 *       GET  /api/admin/review-requests       who would be emailed, what, when
 *       POST /api/admin/review-requests/run   send what is due now
 *
 * When is an order "due"? Square has no delivered state (see 0004), so:
 *   shipped (shipped_at set)          7 days after it shipped
 *   download only (no shipment)       3 days after purchase
 *   physical, never marked shipped   14 days after purchase
 *   shipment cancelled                never
 */

type Env = Record<string, string>

const DAY_MS = 24 * 60 * 60 * 1000
const AFTER_SHIPPED_DAYS = 7
const AFTER_DIGITAL_DAYS = 3
const UNSHIPPED_FALLBACK_DAYS = 14

/**
 * Per-run ceiling on emails. Each email costs a few subrequests (claims, one
 * send), and a Worker invocation has a subrequest budget. Anything past this
 * simply goes on the next day's run.
 */
const MAX_EMAILS_PER_RUN = 20

type OrderRow = {
  id: string
  user_id: string | null
  email: string | null
  status: string
  items: { name?: string }[] | null
  fulfillment_state: string | null
  shipped_at: string | null
  created_at: string
}

type ReviewProduct = { id: string; name: string; image: string }

/** A Square line item carries our product name, not our id. Same as digitalGoods.ts. */
const productByName = new Map(products.map((p) => [p.name, p]))

/** When this order becomes due, or null if it never will. */
function dueAt(order: OrderRow): Date | null {
  if (order.fulfillment_state === "CANCELED") return null
  if (order.shipped_at) return new Date(Date.parse(order.shipped_at) + AFTER_SHIPPED_DAYS * DAY_MS)
  const placed = Date.parse(order.created_at)
  if (!order.fulfillment_state) return new Date(placed + AFTER_DIGITAL_DAYS * DAY_MS)
  return new Date(placed + UNSHIPPED_FALLBACK_DAYS * DAY_MS)
}

function productsIn(order: OrderRow): ReviewProduct[] {
  const found = new Map<string, ReviewProduct>()
  for (const item of order.items ?? []) {
    const p = item.name ? productByName.get(item.name) : undefined
    if (p) found.set(p.id, { id: p.id, name: p.name, image: p.image })
  }
  return [...found.values()]
}

/**
 * Our own addresses never get asked: the team's test orders are real Square
 * orders. REVIEW_REQUEST_EXCLUDE adds more (comma-separated), for a tester who
 * used a personal address.
 */
function isExcluded(env: Env, email: string): boolean {
  if (email.endsWith("@dominusgolf.com")) return true
  const extra = (env.REVIEW_REQUEST_EXCLUDE ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  return extra.includes(email)
}

/**
 * Orders not yet handled. COMPLETED only: a refunded order's status becomes
 * REFUNDED / PARTIALLY_REFUNDED (orders.ts), and asking someone who sent the
 * product back how they like it is the wrong email.
 */
async function pendingOrders(env: Env): Promise<OrderRow[] | null> {
  const query = [
    "select=id,user_id,email,status,items,fulfillment_state,shipped_at,created_at",
    "review_requested_at=is.null",
    "status=eq.COMPLETED",
    "email=not.is.null",
    "order=created_at.asc",
    "limit=500",
  ].join("&")
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/orders?${query}`, { headers: serviceHeaders(env) })
  if (!res.ok) {
    console.error(
      "Review requests: order query failed (run supabase/migrations/0008_review_requests_and_subscribers.sql?):",
      res.status,
      await res.text(),
    )
    return null
  }
  return (await res.json()) as OrderRow[]
}

/** product ids each account has already reviewed, so nobody is asked twice. */
async function reviewedByUser(env: Env, userIds: string[]): Promise<Map<string, Set<string>>> {
  const out = new Map<string, Set<string>>()
  if (userIds.length === 0) return out
  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/product_reviews?select=user_id,product_id&user_id=in.(${userIds.map(encodeURIComponent).join(",")})`,
    { headers: serviceHeaders(env) },
  )
  if (!res.ok) {
    // Not fatal: worst case, someone is asked to review a product they reviewed.
    console.error("Review requests: review lookup failed:", res.status, await res.text())
    return out
  }
  for (const row of (await res.json()) as { user_id: string; product_id: string }[]) {
    if (!out.has(row.user_id)) out.set(row.user_id, new Set())
    out.get(row.user_id)!.add(row.product_id)
  }
  return out
}

/** Same once-only claim as claimOrderJob in orders.ts. */
async function claim(env: Env, orderId: string): Promise<boolean> {
  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}&review_requested_at=is.null`,
    {
      method: "PATCH",
      headers: { ...serviceHeaders(env), Prefer: "return=representation" },
      body: JSON.stringify({ review_requested_at: new Date().toISOString() }),
    },
  )
  if (!res.ok) {
    console.error("Review request claim failed:", res.status, await res.text())
    return false
  }
  return ((await res.json()) as unknown[]).length > 0
}

async function release(env: Env, orderId: string) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`, {
    method: "PATCH",
    headers: serviceHeaders(env),
    body: JSON.stringify({ review_requested_at: null }),
  })
  if (!res.ok) console.error("Review request release failed:", res.status, await res.text())
}

// ── Email ──────────────────────────────────────────────────────────────────

function reviewUrl(productId: string): string {
  return `${SITE_URL}/product/${encodeURIComponent(productId)}?review=1&utm_source=email&utm_medium=review_request&utm_campaign=review_request#reviews-section`
}

function absoluteImage(image: string): string {
  return image.startsWith("http") ? image : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`
}

/** Exported so the email can be rendered for a preview. */
export function reviewEmailHtml(email: string, items: ReviewProduct[]): string {
  const rows = items
    .map(
      (p) => `<tr><td style="padding:14px 40px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e6e0d4;">
            <tr>
              <td width="96" style="padding:12px;"><img src="${escapeHtml(absoluteImage(p.image))}" width="72" height="72" alt="" style="display:block;width:72px;height:72px;object-fit:cover;border:0;"></td>
              <td style="padding:12px 12px 12px 0;font-family:Georgia,serif;font-size:15px;color:#1a1a1a;">${escapeHtml(p.name)}</td>
              <td align="right" style="padding:12px;">${buttonHtml("Review", reviewUrl(p.id))}</td>
            </tr>
          </table>
        </td></tr>`,
    )
    .join("")

  return emailShellHtml({
    eyebrow: "How did we do?",
    body: `
        <tr><td style="padding:22px 40px 4px;font-family:Georgia,serif;color:#1a1a1a;font-size:16px;line-height:1.7;">
          <p style="margin:0 0 16px;">Thank you for your order.</p>
          <p style="margin:0 0 16px;">By now you have had some time with your gear, and we would love to hear how it is going. A short review helps other golfers choose, and it helps a small brand like ours more than you might think.</p>
        </td></tr>
        ${rows}
        <tr><td style="padding:22px 40px 30px;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#8a8375;">
          Reviews are posted from your Dominus Golf account. Sign in with ${escapeHtml(email)} and the review form opens for you.
        </td></tr>`,
    footer: `You are getting this once, because you ordered from dominusgolf.com. Questions or a problem with your order? Reply to this email.`,
  })
}

function reviewEmailText(email: string, items: ReviewProduct[]): string {
  return [
    `Thank you for your order.`,
    ``,
    `By now you have had some time with your gear, and we would love to hear how it is going. A short review helps other golfers choose, and it helps a small brand like ours more than you might think.`,
    ``,
    ...items.map((p) => `${p.name}: ${reviewUrl(p.id)}`),
    ``,
    `Reviews are posted from your Dominus Golf account. Sign in with ${email} and the review form opens for you.`,
    ``,
    `Questions or a problem with your order? Reply to this email.`,
    ``,
    `Dominus Golf - Excellence Recognized. Development Funded.`,
  ].join("\n")
}

function subjectFor(items: ReviewProduct[]): string {
  return items.length === 1 ? `How is your ${items[0].name}?` : "How is your Dominus Golf gear?"
}

// ── The run ────────────────────────────────────────────────────────────────

/** One email: a customer, and every product across their due orders. */
type Batch = { email: string; orderIds: string[]; products: ReviewProduct[]; dueAt: string }

export type ReviewRunReport = {
  enabled: boolean
  dryRun: boolean
  /** Would be (or were) emailed now. */
  due: Batch[]
  /** Not yet - with the date each becomes due. */
  notYetDue: { email: string; orderId: string; dueAt: string }[]
  /** Skipped for good, and why. */
  skipped: { email: string; orderId: string; reason: string }[]
  sent: number
  failed: number
  /** Due, but left for the next run by MAX_EMAILS_PER_RUN. */
  deferred: number
}

export async function runReviewRequests(env: Env, opts: { dryRun: boolean }): Promise<ReviewRunReport> {
  const enabled = env.REVIEW_REQUESTS_ENABLED === "true"
  const dryRun = opts.dryRun || !enabled
  const report: ReviewRunReport = { enabled, dryRun, due: [], notYetDue: [], skipped: [], sent: 0, failed: 0, deferred: 0 }

  if (!hasSupabase(env)) {
    console.error("Review requests: Supabase env missing")
    return report
  }
  const orders = await pendingOrders(env)
  if (!orders) return report

  const now = Date.now()
  const reviewed = await reviewedByUser(env, [...new Set(orders.map((o) => o.user_id).filter((u): u is string => !!u))])

  /* Grouped by address, so someone with two orders due gets one email that
     lists both, rather than two in the same minute. */
  const batches = new Map<string, Batch>()
  /** Orders that will never need an email - marked done so they stop being re-read. */
  const settle: string[] = []

  for (const order of orders) {
    const email = String(order.email).trim().toLowerCase()
    if (isExcluded(env, email)) {
      report.skipped.push({ email, orderId: order.id, reason: "internal or excluded address" })
      continue
    }
    const due = dueAt(order)
    if (!due) {
      report.skipped.push({ email, orderId: order.id, reason: "shipment cancelled" })
      continue
    }
    if (due.getTime() > now) {
      report.notYetDue.push({ email, orderId: order.id, dueAt: due.toISOString() })
      continue
    }
    const already = order.user_id ? reviewed.get(order.user_id) : undefined
    const items = productsIn(order).filter((p) => !already?.has(p.id))
    if (items.length === 0) {
      report.skipped.push({ email, orderId: order.id, reason: "nothing left to review" })
      settle.push(order.id)
      continue
    }

    const batch = batches.get(email) ?? { email, orderIds: [], products: [], dueAt: due.toISOString() }
    batch.orderIds.push(order.id)
    for (const p of items) if (!batch.products.some((q) => q.id === p.id)) batch.products.push(p)
    batches.set(email, batch)
  }

  report.due = [...batches.values()]
  if (dryRun) return report

  for (const orderId of settle) await claim(env, orderId)

  for (const [index, batch] of report.due.entries()) {
    if (index >= MAX_EMAILS_PER_RUN) {
      report.deferred = report.due.length - index
      break
    }
    /* Claim before sending, so an overlapping run cannot send the same email.
       Only orders this run actually won are included. */
    const won: string[] = []
    for (const id of batch.orderIds) if (await claim(env, id)) won.push(id)
    if (won.length === 0) continue

    const ok = await sendEmail(env, {
      to: batch.email,
      subject: subjectFor(batch.products),
      html: reviewEmailHtml(batch.email, batch.products),
      text: reviewEmailText(batch.email, batch.products),
      tag: "Review request",
    })
    if (ok) {
      report.sent++
    } else {
      report.failed++
      // Nothing reached them, so let tomorrow's run try again.
      for (const id of won) await release(env, id)
    }
  }

  console.log(`Review requests: sent ${report.sent}, failed ${report.failed}, deferred ${report.deferred}`)
  return report
}

export function registerReviewRequestRoutes(app: Hono) {
  // GET /api/admin/review-requests — preview only; never sends.
  app.get("/api/admin/review-requests", async (c) => {
    const env = c.env as Env
    if (!isAdmin(env, c.req.header("authorization"))) return c.json({ error: "Unauthorized" }, 401)
    return c.json(await runReviewRequests(env, { dryRun: true }))
  })

  // POST /api/admin/review-requests/run — send what is due now, instead of
  // waiting for the daily cron. Still sends nothing unless REVIEW_REQUESTS_ENABLED.
  app.post("/api/admin/review-requests/run", async (c) => {
    const env = c.env as Env
    if (!isAdmin(env, c.req.header("authorization"))) return c.json({ error: "Unauthorized" }, 401)
    return c.json(await runReviewRequests(env, { dryRun: false }))
  })
}
