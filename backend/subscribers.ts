import type { Hono } from "hono"
import {
  SITE_URL,
  buttonHtml,
  emailShellHtml,
  escapeHtml,
  hasSupabase,
  sendEmail,
  serviceHeaders,
} from "./email"

/**
 * The email list, and the single-use 10% code each subscriber gets for joining.
 *
 * Before this the site had no way to keep a visitor who was not ready to buy on
 * their first visit - which is most of them. The footer form and the popup post
 * here, the address is stored in `email_subscribers`, and the welcome email
 * carries the code.
 *
 * Every subscriber gets their own code rather than one shared WELCOME10: a
 * shared code leaks to coupon sites and becomes a permanent 10% off for anyone
 * who searches for it.
 *
 * Table: supabase/migrations/0008_review_requests_and_subscribers.sql.
 */

type Env = Record<string, string>

/** The one number, so the email, the checkout and the cart cannot disagree. */
export const WELCOME_DISCOUNT_PERCENT = 10

/** What Square prints on the receipt and the Dashboard shows against the order. */
export const WELCOME_DISCOUNT_NAME = `Welcome ${WELCOME_DISCOUNT_PERCENT}% Off`

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** No 0/O or 1/I/L, so a code read off a phone screen can be typed back. */
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"

function newCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  let suffix = ""
  for (const b of bytes) suffix += CODE_ALPHABET[b % CODE_ALPHABET.length]
  return `WELCOME-${suffix}`
}

/** Codes are shown upper-case; accept whatever case and spacing was typed. */
export function normaliseCode(raw: unknown): string {
  return typeof raw === "string" ? raw.trim().toUpperCase().replace(/\s+/g, "") : ""
}

type SubscriberRow = {
  id: string
  email: string
  discount_code: string
  code_used_at: string | null
  unsubscribed_at: string | null
}

// ── Emails ─────────────────────────────────────────────────────────────────

/** Exported so the email can be rendered for a preview. */
export function welcomeEmailHtml(code: string, unsubscribeUrl: string): string {
  const shopUrl = `${SITE_URL}/?code=${encodeURIComponent(code)}&utm_source=email&utm_medium=welcome&utm_campaign=welcome_code`
  return emailShellHtml({
    eyebrow: "Welcome",
    body: `
        <tr><td style="padding:22px 40px 4px;font-family:Georgia,serif;color:#1a1a1a;font-size:16px;line-height:1.7;">
          <p style="margin:0 0 16px;">Thanks for joining the Dominus Golf list.</p>
          <p style="margin:0 0 16px;">Here is your ${WELCOME_DISCOUNT_PERCENT}% off code for your first order:</p>
        </td></tr>

        <tr><td style="padding:6px 40px 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f4;border:1px solid #e6e0d4;">
            <tr><td align="center" style="padding:22px 18px;font-family:Arial,sans-serif;font-size:24px;font-weight:bold;letter-spacing:3px;color:#1a1a1a;">${escapeHtml(code)}</td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:14px 40px 4px;font-family:Georgia,serif;color:#4a4a4a;font-size:15px;line-height:1.7;">
          Enter it in your bag before checkout, or use the button below and it will be applied for you. It works once, on one order.
        </td></tr>

        <tr><td align="center" style="padding:24px 40px 30px;">
          ${buttonHtml("Shop Now", shopUrl)}
        </td></tr>`,
    footer: `You are getting this because this address was signed up at dominusgolf.com. Not you, or no longer interested? <a href="${escapeHtml(unsubscribeUrl)}" style="color:#C4963B;text-decoration:none;">Unsubscribe</a>.`,
  })
}

function welcomeEmailText(code: string, unsubscribeUrl: string): string {
  return [
    `Thanks for joining the Dominus Golf list.`,
    ``,
    `Here is your ${WELCOME_DISCOUNT_PERCENT}% off code for your first order:`,
    ``,
    `    ${code}`,
    ``,
    `Enter it in your bag before checkout. It works once, on one order.`,
    ``,
    `Shop: ${SITE_URL}/?code=${encodeURIComponent(code)}`,
    ``,
    `Not you, or no longer interested? Unsubscribe: ${unsubscribeUrl}`,
    ``,
    `Dominus Golf - Excellence Recognized. Development Funded.`,
  ].join("\n")
}

/** Plain page for the unsubscribe link. Nothing here takes input. */
function unsubscribePageHtml(message: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Dominus Golf</title></head>
<body style="margin:0;background:#f4f1ea;font-family:Georgia,serif;color:#1a1a1a;">
  <div style="max-width:480px;margin:80px auto;padding:40px 24px;background:#fff;border:1px solid #e6e0d4;text-align:center;">
    <div style="font-size:20px;letter-spacing:4px;font-weight:bold;text-transform:uppercase;">Dominus Golf</div>
    <p style="font-size:16px;line-height:1.7;margin:24px 0;">${escapeHtml(message)}</p>
    <a href="${SITE_URL}" style="font-family:Arial,sans-serif;font-size:13px;color:#C4963B;text-decoration:none;">Back to dominusgolf.com</a>
  </div>
</body></html>`
}

// ── Storage ────────────────────────────────────────────────────────────────

/**
 * Inserts a new subscriber, or reports the existing row.
 *
 * `ignore-duplicates` on email makes the insert the claim: two submits of the
 * same address at once produce one row and one welcome email. A 409 means the
 * random code collided with an existing one, not the email - retried with a
 * fresh code.
 */
async function insertSubscriber(
  env: Env,
  email: string,
  source: string,
): Promise<{ created: SubscriberRow } | { existing: true } | { error: true }> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/email_subscribers?on_conflict=email`, {
      method: "POST",
      headers: { ...serviceHeaders(env), Prefer: "resolution=ignore-duplicates,return=representation" },
      body: JSON.stringify({ email, source, discount_code: newCode() }),
    })
    if (res.status === 409) continue
    if (!res.ok) {
      console.error(
        "Subscriber insert failed (run supabase/migrations/0008_review_requests_and_subscribers.sql?):",
        res.status,
        await res.text(),
      )
      return { error: true }
    }
    const rows = (await res.json()) as SubscriberRow[]
    return rows[0] ? { created: rows[0] } : { existing: true }
  }
  console.error("Subscriber insert failed: three code collisions in a row")
  return { error: true }
}

async function deleteSubscriber(env: Env, id: string) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/email_subscribers?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: serviceHeaders(env),
  })
  if (!res.ok) console.error("Subscriber rollback failed:", res.status, await res.text())
}

/** An address that unsubscribed and signs up again is simply back on the list. */
async function resubscribe(env: Env, email: string) {
  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/email_subscribers?email=eq.${encodeURIComponent(email)}&unsubscribed_at=not.is.null`,
    { method: "PATCH", headers: serviceHeaders(env), body: JSON.stringify({ unsubscribed_at: null }) },
  )
  if (!res.ok) console.error("Resubscribe failed:", res.status, await res.text())
}

export type DiscountCheck =
  | { ok: true; code: string; percent: number; name: string }
  | { ok: false; error: string }

/**
 * Whether a code can be used right now. Used by the cart (to show the saving)
 * and by checkout (to decide whether to apply it).
 *
 * "Unused" is only checked at the moment the payment link is made; the code is
 * marked used when the payment completes. So two payment links opened with the
 * same code before either is paid can both get the discount. That window is
 * minutes and the stake is 10% on one order, so it is accepted rather than
 * reserving codes for checkouts that are mostly never finished.
 */
export async function checkDiscountCode(env: Env, raw: unknown): Promise<DiscountCheck> {
  const code = normaliseCode(raw)
  if (!code) return { ok: false, error: "Enter a code." }
  if (!/^[A-Z0-9-]{4,40}$/.test(code)) return { ok: false, error: "That code isn't valid." }
  if (!hasSupabase(env)) return { ok: false, error: "Codes can't be checked right now. Please try again shortly." }

  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/email_subscribers?discount_code=eq.${encodeURIComponent(code)}&select=discount_code,code_used_at`,
    { headers: serviceHeaders(env) },
  )
  if (!res.ok) {
    console.error("Discount lookup failed:", res.status, await res.text())
    return { ok: false, error: "Codes can't be checked right now. Please try again shortly." }
  }
  const rows = (await res.json()) as { discount_code: string; code_used_at: string | null }[]
  const row = rows[0]
  if (!row) return { ok: false, error: "That code isn't valid." }
  if (row.code_used_at) return { ok: false, error: "That code has already been used." }
  return { ok: true, code, percent: WELCOME_DISCOUNT_PERCENT, name: WELCOME_DISCOUNT_NAME }
}

/**
 * Marks a code spent, from the Square webhook once the payment has completed.
 * The `is.null` filter keeps the first order that used it as the one recorded,
 * however many times Square redelivers the event.
 */
export async function markDiscountCodeUsed(env: Env, raw: string, squareOrderId: string) {
  const code = normaliseCode(raw)
  if (!code || !hasSupabase(env)) return
  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/email_subscribers?discount_code=eq.${encodeURIComponent(code)}&code_used_at=is.null`,
    {
      method: "PATCH",
      headers: serviceHeaders(env),
      body: JSON.stringify({ code_used_at: new Date().toISOString(), code_used_order: squareOrderId }),
    },
  )
  if (!res.ok) console.error("Discount code mark-used failed:", res.status, await res.text())
}

// ── Routes ─────────────────────────────────────────────────────────────────

export function registerSubscriberRoutes(app: Hono) {
  // POST /api/subscribe — join the list and get the welcome code by email.
  // Body: { email, source? }
  app.post("/api/subscribe", async (c) => {
    const env = c.env as Env
    const body = (await c.req.json().catch(() => ({}))) as { email?: string; source?: string }

    const email = (body.email || "").trim().toLowerCase()
    if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
      return c.json({ error: "Please enter a valid email address." }, 400)
    }
    const source = ["footer", "popup"].includes(body.source ?? "") ? body.source! : "other"

    if (!hasSupabase(env)) {
      console.error("Subscribe: Supabase env missing")
      return c.json({ error: "Signup is temporarily unavailable. Please try again later." }, 503)
    }

    const result = await insertSubscriber(env, email, source)
    if ("error" in result) {
      return c.json({ error: "Signup is temporarily unavailable. Please try again later." }, 503)
    }

    /* Already on the list: no second code, and no second email - otherwise the
       form becomes a way to send our email to any address, as often as someone
       likes to submit it. */
    if ("existing" in result) {
      await resubscribe(env, email)
      return c.json({ ok: true, already: true })
    }

    const row = result.created
    const unsubscribeUrl = `${new URL(c.req.url).origin}/api/unsubscribe?id=${encodeURIComponent(row.id)}`
    const sent = await sendEmail(env, {
      to: email,
      subject: `Your ${WELCOME_DISCOUNT_PERCENT}% off code - Dominus Golf`,
      html: welcomeEmailHtml(row.discount_code, unsubscribeUrl),
      text: welcomeEmailText(row.discount_code, unsubscribeUrl),
      tag: "Welcome email",
    })

    /* The code only exists to be emailed. If the email did not go, drop the row
       so the same address can try again, instead of being told forever that it
       is already subscribed to a code it never received. */
    if (!sent) {
      await deleteSubscriber(env, row.id)
      return c.json({ error: "We couldn't send your code. Please try again in a moment." }, 502)
    }

    return c.json({ ok: true })
  })

  // POST /api/discount/validate — can this code be used? For the cart's preview.
  // Body: { code }
  app.post("/api/discount/validate", async (c) => {
    const env = c.env as Env
    const body = (await c.req.json().catch(() => ({}))) as { code?: string }
    const result = await checkDiscountCode(env, body.code)
    return c.json(result, result.ok ? 200 : 400)
  })

  // GET /api/unsubscribe?id=<subscriber id> — the link in every list email.
  // The id is a random UUID only ever sent to that inbox, so it is the token.
  app.get("/api/unsubscribe", async (c) => {
    const env = c.env as Env
    const id = c.req.query("id") ?? ""
    if (!/^[0-9a-f-]{36}$/i.test(id) || !hasSupabase(env)) {
      return c.html(unsubscribePageHtml("That unsubscribe link isn't valid. Email Customersupport@dominusgolf.com and we'll remove you by hand."), 400)
    }
    const res = await fetch(
      `${env.SUPABASE_URL}/rest/v1/email_subscribers?id=eq.${encodeURIComponent(id)}&unsubscribed_at=is.null`,
      {
        method: "PATCH",
        headers: serviceHeaders(env),
        body: JSON.stringify({ unsubscribed_at: new Date().toISOString() }),
      },
    )
    if (!res.ok) {
      console.error("Unsubscribe failed:", res.status, await res.text())
      return c.html(unsubscribePageHtml("Something went wrong. Email Customersupport@dominusgolf.com and we'll remove you by hand."), 500)
    }
    return c.html(unsubscribePageHtml("You're unsubscribed. You won't get any more list emails from us."))
  })
}
