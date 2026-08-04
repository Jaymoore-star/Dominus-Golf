import type { Hono } from "hono"

/**
 * Order recording, driven by a Square webhook.
 *
 * Checkout happens on a Square-hosted page, and the only thing that came back was
 * a browser redirect to /?checkout=success. A redirect is not proof of payment —
 * anyone can visit that URL — so nothing on our side ever knew an order had
 * happened. That blocked two features at once: the Orders page in the account
 * area, and affiliate commissions, which need a confirmed sale to attribute.
 *
 * Square calls the endpoint here server-to-server, signed, and that is what writes
 * the order row. A row existing means Square really took the money.
 *
 * Setup, once:
 *   1. Run supabase/migrations/0002_orders.sql in the Supabase SQL editor.
 *   2. Square Dashboard → Developer → Webhooks → Subscriptions. Add a subscription
 *      pointing at https://dominus-golf-backend.jaymoore.workers.dev/api/square/webhook
 *      and subscribe to payment.created and payment.updated.
 *   3. Set the secrets listed in wrangler.backend.toml.
 */

type Env = Record<string, string>

/**
 * Square signs the concatenation of the notification URL and the raw request body.
 *
 * The URL must match the Dashboard entry character for character, which is why it
 * is configured rather than derived from the request — behind Cloudflare the
 * inbound URL can differ from what Square was given.
 */
async function verifySignature(
  signatureKey: string,
  notificationUrl: string,
  rawBody: string,
  headerSignature: string | undefined,
): Promise<boolean> {
  if (!headerSignature) return false

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(signatureKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(notificationUrl + rawBody),
  )
  const expected = btoa(String.fromCharCode(...new Uint8Array(mac)))

  // Compared without bailing on the first differing byte, which would leak how
  // much of a forged signature was correct.
  if (expected.length !== headerSignature.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ headerSignature.charCodeAt(i)
  }
  return diff === 0
}

/** Line items and totals come from Square, never re-derived from our catalogue. */
async function fetchOrder(accessToken: string, orderId: string) {
  const res = await fetch(`https://connect.squareup.com/v2/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Square-Version": "2024-04-17",
    },
  })
  if (!res.ok) {
    console.error("Square order fetch failed:", res.status, await res.text())
    return null
  }
  const data = (await res.json()) as { order?: Record<string, unknown> }
  return data.order ?? null
}

/**
 * Upsert keyed on square_order_id.
 *
 * Square retries on any non-2xx and can redeliver an event even after a success,
 * so this has to be idempotent or a customer ends up with duplicate orders.
 *
 * Uses the service role key. The orders table has no insert policy at all, so
 * nothing client-side can create or alter an order.
 */
async function saveOrder(env: Env, row: Record<string, unknown>) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/orders?on_conflict=square_order_id`, {
    method: "POST",
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(row),
  })
  if (!res.ok) {
    console.error("Supabase order upsert failed:", res.status, await res.text())
    return null
  }
  const rows = (await res.json()) as Record<string, unknown>[]
  return rows[0] ?? null
}

async function markReferralReported(env: Env, id: string) {
  await fetch(`${env.SUPABASE_URL}/rest/v1/orders?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ referral_reported_at: new Date().toISOString() }),
  })
}

/**
 * Credits the affiliate for a sale.
 *
 * GoAffPro normally hooks a Shopify or WooCommerce order webhook. Our checkout is
 * on Square, which it cannot observe, so the sale is pushed to its API instead.
 * A missing token is not an error — the order must still be recorded whether or
 * not the affiliate side has been configured yet.
 */
async function reportReferral(
  env: Env,
  order: { id: string; totalCents: number; email: string | null; referralCode: string },
): Promise<boolean> {
  if (!env.GOAFFPRO_ACCESS_TOKEN) return false

  const res = await fetch("https://api.goaffpro.com/v1/sale", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-GOAFFPRO-ACCESS-TOKEN": env.GOAFFPRO_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      id: order.id,
      number: order.id,
      ref: order.referralCode,
      total: order.totalCents / 100,
      customer_email: order.email ?? undefined,
    }),
  })
  if (!res.ok) {
    console.error("GoAffPro sale report failed:", res.status, await res.text())
    return false
  }
  return true
}

export function registerOrderRoutes(app: Hono) {
  app.post("/api/square/webhook", async (c) => {
    const env = c.env as Env

    // Read the body as text first: the signature covers the exact bytes Square
    // sent, so re-serialising parsed JSON would never match.
    const rawBody = await c.req.text()

    const signatureKey = env.SQUARE_WEBHOOK_SIGNATURE_KEY
    const notificationUrl = env.SQUARE_WEBHOOK_URL
    if (!signatureKey || !notificationUrl) {
      console.error("Webhook not configured: missing signature key or notification URL")
      return c.json({ error: "Webhook not configured" }, 500)
    }

    const verified = await verifySignature(
      signatureKey,
      notificationUrl,
      rawBody,
      c.req.header("x-square-hmacsha256-signature"),
    )
    if (!verified) {
      // 401 rather than 500: a forged or unsigned call is not worth retrying.
      console.warn("Rejected webhook with an invalid signature")
      return c.json({ error: "Invalid signature" }, 401)
    }

    let event: { type?: string; data?: { object?: { payment?: Record<string, unknown> } } }
    try {
      event = JSON.parse(rawBody)
    } catch {
      return c.json({ error: "Invalid JSON" }, 400)
    }

    const payment = event.data?.object?.payment
    // Acknowledge anything else that happens to be subscribed, so Square does not
    // retry an event we were never going to act on.
    if (!payment) return c.json({ ignored: event.type ?? "unknown" })

    const orderId = payment.order_id as string | undefined
    if (!orderId) return c.json({ ignored: "payment without order_id" })

    const paymentStatus = payment.status as string | undefined

    const order = await fetchOrder(env.SQUARE_ACCESS_TOKEN, orderId)
    // 500 so Square retries. Dropping it here would lose the order permanently.
    if (!order) return c.json({ error: "Could not load order from Square" }, 500)

    // Set when the payment link was created — the only way our own user id and the
    // referral code survive a round trip through a Square-hosted checkout.
    const metadata = (order.metadata ?? {}) as Record<string, string>
    const totals = (order.total_money ?? {}) as { amount?: number; currency?: string }

    const email =
      (payment.buyer_email_address as string | undefined) ??
      (payment.receipt_email as string | undefined) ??
      null

    const saved = await saveOrder(env, {
      square_order_id: orderId,
      square_payment_id: payment.id as string | undefined,
      user_id: metadata.user_id || null,
      email,
      status: paymentStatus ?? String(order.state ?? "UNKNOWN"),
      total_cents: totals.amount ?? 0,
      currency: totals.currency ?? "USD",
      items: order.line_items ?? [],
      referral_code: metadata.referral_code || null,
    })
    if (!saved) return c.json({ error: "Could not save order" }, 500)

    // Commission only on a completed payment, and only once. referral_reported_at
    // is what stops a redelivery paying the affiliate twice.
    if (paymentStatus === "COMPLETED" && saved.referral_code && !saved.referral_reported_at) {
      const reported = await reportReferral(env, {
        id: String(saved.id),
        totalCents: Number(saved.total_cents),
        email: (saved.email as string | null) ?? null,
        referralCode: String(saved.referral_code),
      })
      if (reported) await markReferralReported(env, String(saved.id))
    }

    return c.json({ ok: true, orderId, status: paymentStatus })
  })
}
