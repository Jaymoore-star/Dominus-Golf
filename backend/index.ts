import { Hono } from "hono"
import { cors } from "hono/cors"
import { createClient } from "@blinkdotnew/sdk"

const EBOOK_URL = "https://drive.google.com/uc?export=download&id=1Ir1DaLgMH-8eVzlQA6xrb7kKO8H_N95p"

const app = new Hono()

app.use("*", cors())

app.get("/health", (c) => c.json({ ok: true }))

// POST /api/square/checkout — Square (store cart/products)
app.post("/api/square/checkout", async (c) => {
  const env = c.env as Record<string, string>
  const accessToken = env.SQUARE_ACCESS_TOKEN
  const locationId = env.SQUARE_LOCATION_ID

  if (!accessToken || !locationId) {
    return c.json({ error: "Square not configured" }, 500)
  }

  let body: {
    items: { name: string; price: number; quantity: number; image?: string }[]
    successUrl?: string
    cancelUrl?: string
  }

  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: "Invalid request body" }, 400)
  }

  const { items, successUrl, cancelUrl } = body

  if (!items || items.length === 0) {
    return c.json({ error: "No items provided" }, 400)
  }

  // Calculate total in cents
  const totalCents = items.reduce(
    (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
    0
  )

  // Build a readable item summary for the Square note
  const itemSummary = items
    .map((item) => `${item.name} x${item.quantity}`)
    .join(", ")

  const idempotencyKey = `checkout_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`

  // Always use production Square — sandbox detection was incorrectly matching production tokens
  const squareBaseUrl = "https://connect.squareup.com"

  const squareBody = {
    idempotency_key: idempotencyKey,
    quick_pay: {
      name: `Dominus Golf Order — ${items.length} item${items.length > 1 ? "s" : ""}`,
      price_money: {
        amount: totalCents,
        currency: "USD",
      },
      location_id: locationId,
    },
    checkout_options: {
      redirect_url: successUrl || "https://www.dominusgolf.com",
      ask_for_shipping_address: true,
      enable_coupon: false,
      enable_loyalty: false,
      accepted_payment_methods: {
        card: true,
        cash_app_pay: true,
      },
    },
    pre_populated_data: {
      note: itemSummary,
    },
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const response = await fetch(`${squareBaseUrl}/v2/online-checkout/payment-links`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Square-Version": "2024-04-17",
      },
      body: JSON.stringify(squareBody),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    const data = await response.json() as {
      payment_link?: { url?: string; id?: string; order_id?: string }
      errors?: { code: string; detail: string; category: string }[]
    }

    if (!response.ok || data.errors) {
      console.error("Square error:", JSON.stringify(data.errors))
      const msg = data.errors?.[0]?.detail || "Square payment link creation failed"
      return c.json({ error: msg }, 500)
    }

    return c.json({
      url: data.payment_link?.url,
      paymentLinkId: data.payment_link?.id,
      orderId: data.payment_link?.order_id,
    })
  } catch (err: unknown) {
    clearTimeout(timeout)
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("Square checkout error:", message)
    return c.json({ error: message }, 500)
  }
})

// POST /api/grant/checkout — Square (grant application $15 fee)
// Body: { applicantName, applicantEmail, developmentPlan, trainingRegimen, competitiveVision, successUrl, cancelUrl }
// Returns: { url } — Square-hosted payment link
app.post("/api/grant/checkout", async (c) => {
  const env = c.env as Record<string, string>
  const accessToken = env.SQUARE_ACCESS_TOKEN
  const locationId = env.SQUARE_LOCATION_ID

  if (!accessToken || !locationId) {
    return c.json({ error: "Square not configured" }, 500)
  }

  let body: {
    applicantName?: string
    applicantEmail?: string
    developmentPlan?: string
    trainingRegimen?: string
    competitiveVision?: string
    successUrl?: string
    cancelUrl?: string
  }

  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: "Invalid request body" }, 400)
  }

  const {
    applicantName = "",
    applicantEmail = "",
    developmentPlan = "",
    trainingRegimen = "",
    competitiveVision = "",
    successUrl = "https://www.dominusgolf.com/grant/success",
    cancelUrl = "https://www.dominusgolf.com/grant",
  } = body

  // Store applicant info in note so we can retrieve it from the Square order
  const applicantNote = [
    `Name: ${applicantName}`,
    `Email: ${applicantEmail}`,
    `Dev Plan: ${developmentPlan.substring(0, 200)}`,
    `Training: ${trainingRegimen.substring(0, 200)}`,
    `Vision: ${competitiveVision.substring(0, 200)}`,
  ].join(" | ")

  const idempotencyKey = `grant_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  // Always use production Square
  const squareBaseUrl = "https://connect.squareup.com"

  const squareBody = {
    idempotency_key: idempotencyKey,
    quick_pay: {
      name: "Dominus Golf Development Grant — $15 Application Fee",
      price_money: {
        amount: 1500,
        currency: "USD",
      },
      location_id: locationId,
    },
    checkout_options: {
      redirect_url: successUrl,
      ask_for_shipping_address: false,
      enable_coupon: false,
      enable_loyalty: false,
      accepted_payment_methods: {
        card: true,
        cash_app_pay: true,
      },
    },
    pre_populated_data: {
      buyer_email: applicantEmail || undefined,
      note: applicantNote,
    },
  }

  try {
    const response = await fetch(`${squareBaseUrl}/v2/online-checkout/payment-links`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Square-Version": "2024-04-17",
      },
      body: JSON.stringify(squareBody),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    const data = await response.json() as {
      payment_link?: { url?: string; id?: string; order_id?: string }
      errors?: { code: string; detail: string; category: string }[]
    }

    if (!response.ok || data.errors) {
      console.error("Square error:", JSON.stringify(data.errors))
      const msg = data.errors?.[0]?.detail || "Square payment link creation failed"
      return c.json({ error: msg }, 500)
    }

    return c.json({
      url: data.payment_link?.url,
      paymentLinkId: data.payment_link?.id,
      orderId: data.payment_link?.order_id,
    })
  } catch (err: unknown) {
    clearTimeout(timeout)
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("Square checkout error:", message)
    return c.json({ error: message }, 500)
  }
})

// POST /api/grant/confirm — Send eBook delivery email after grant submission
app.post("/api/grant/confirm", async (c) => {
  const env = c.env as Record<string, string>
  const blink = createClient({
    projectId: env.BLINK_PROJECT_ID,
    secretKey: env.BLINK_SECRET_KEY,
  })

  let body: { name?: string; email?: string }
  try { body = await c.req.json() } catch { return c.json({ error: "Invalid request body" }, 400) }

  const { name = "Applicant", email = "" } = body
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return c.json({ error: "Valid email required" }, 400)
  }

  try {
    await blink.notifications.email({
      to: email,
      from: "Dominus Golf Grants",
      replyTo: "Customersupport@dominusgolf.com",
      subject: "Application Received – Dominus Golf Development Grant",
      html: `
        <div style="max-width:560px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#ffffff;border:1px solid #e5e5e5">
          <div style="background:#1a1a1a;padding:36px 28px;text-align:center">
            <h1 style="margin:0;font-family:Georgia,serif;font-size:22px;color:#C4963B;letter-spacing:2px;text-transform:uppercase">Dominus Golf</h1>
            <p style="margin:8px 0 0;font-size:12px;color:#aaaaaa;letter-spacing:1px;text-transform:uppercase">Development Grant</p>
          </div>
          <div style="padding:36px 28px">
            <p style="margin:0 0 16px;font-size:16px;color:#333333;font-weight:600">Hi ${name},</p>
            <p style="margin:0 0 12px;font-size:15px;color:#444444;line-height:1.7">
              Thank you for applying to the <strong>Dominus Golf Development Grant</strong>.
              We've received your submission and it is now in review.
            </p>
            <p style="margin:0 0 12px;font-size:15px;color:#444444;line-height:1.7">
              As promised, here is your free digital copy of
              <strong><em>The Ultimate Guide to Master the Game</em></strong> &mdash;
              packed with drills, mindset strategies, and tournament-prep frameworks to sharpen your competitive edge.
            </p>
            <div style="text-align:center;margin:28px 0 32px">
              <a href="${EBOOK_URL}"
                 style="display:inline-block;background:#C4963B;color:#ffffff;padding:14px 48px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;text-decoration:none;border-radius:2px">
                Download Your eBook
              </a>
            </div>
            <div style="border-top:1px solid #eeeeee;padding-top:20px;margin-top:8px">
              <p style="margin:0 0 8px;font-size:14px;color:#333333;font-weight:600">What happens next?</p>
              <ul style="margin:0;padding-left:18px;font-size:13px;color:#666666;line-height:1.8">
                <li>Applications are reviewed on a rolling basis.</li>
                <li>The winner will be notified on <strong>August 22, 2026</strong>.</li>
                <li>All applicants will receive an update regardless of the outcome.</li>
              </ul>
            </div>
            <p style="margin:20px 0 0;font-size:13px;color:#999999;line-height:1.6">
              Questions? Reach us at
              <a href="mailto:Customersupport@dominusgolf.com" style="color:#C4963B;text-decoration:none">Customersupport@dominusgolf.com</a>
            </p>
          </div>
          <div style="background:#f8f8f8;padding:20px 28px;text-align:center">
            <p style="margin:0 0 4px;font-size:11px;color:#bbbbbb">
              Dominus Golf LLC &middot; All rights reserved.
            </p>
            <p style="margin:0;font-size:10px;color:#cccccc">
              You received this email because you applied for the Dominus Golf Development Grant.
            </p>
          </div>
        </div>
      `,
      text: [
        `Hi ${name},`,
        ``,
        `Thank you for applying to the Dominus Golf Development Grant. We've received your submission and it is now in review.`,
        ``,
        `As promised, here is your free digital copy of The Ultimate Guide to Master the Game:`,
        `${EBOOK_URL}`,
        ``,
        `What happens next:`,
        `- Applications are reviewed on a rolling basis.`,
        `- The winner will be notified on August 22, 2026.`,
        `- All applicants will receive an update regardless of the outcome.`,
        ``,
        `Questions? Email us at Customersupport@dominusgolf.com`,
        ``,
        `— Dominus Golf`,
      ].join("\n"),
    })

    return c.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Email send failed"
    console.error("Grant email error:", message)
    return c.json({ error: message }, 500)
  }
})

export default app
