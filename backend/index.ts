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
      subject: "Your Dominus Golf Development Grant eBook",
      html: `
        <div style="max-width:560px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#ffffff;border:1px solid #e5e5e5">
          <div style="background:#1a1a1a;padding:32px 28px;text-align:center">
            <h1 style="margin:0;font-family:Georgia,serif;font-size:24px;color:#C4963B;letter-spacing:1px">DOMINUS GOLF</h1>
          </div>
          <div style="padding:36px 28px">
            <p style="margin:0 0 16px;font-size:16px;color:#333333">Hi ${name},</p>
            <p style="margin:0 0 16px;font-size:15px;color:#444444;line-height:1.7">
              Thank you for submitting your application for the Dominus Golf Development Grant.
              As promised, here is your free digital copy of
              <strong>The Ultimate Guide to Master the Game</strong>.
            </p>
            <div style="text-align:center;margin:28px 0">
              <a href="${EBOOK_URL}"
                 style="display:inline-block;background:#C4963B;color:#ffffff;padding:14px 42px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;text-decoration:none">
                Download Your eBook →
              </a>
            </div>
            <p style="margin:0;font-size:13px;color:#888888;line-height:1.6">
              We'll review your application and the winner will be notified on <strong>August 22, 2026</strong>.
              If you have any questions, reply to this email.
            </p>
          </div>
          <div style="background:#f8f8f8;padding:20px 28px;text-align:center">
            <p style="margin:0;font-size:11px;color:#aaaaaa">
              © 2026 Dominus Golf LLC. All rights reserved.
            </p>
          </div>
        </div>
      `,
      text: `Hi ${name},\n\nThank you for submitting your application for the Dominus Golf Development Grant. As promised, here is your free digital copy of The Ultimate Guide to Master the Game.\n\nDownload: ${EBOOK_URL}\n\nWe'll review your application and the winner will be notified on August 22, 2026.\n\n© 2026 Dominus Golf LLC.`,
    })

    return c.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Email send failed"
    console.error("Grant email error:", message)
    return c.json({ error: message }, 500)
  }
})

export default app
