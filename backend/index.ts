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
// Body: { applicantName, applicantEmail, developmentPlan, trainingRegimen, competitiveVision, successUrl, cancelUrl, sandbox? }
// sandbox=true uses sandbox credentials (no real charge)
// Returns: { url } — Square-hosted payment link
app.post("/api/grant/checkout", async (c) => {
  const env = c.env as Record<string, string>

  let body: {
    applicantName?: string
    applicantEmail?: string
    developmentPlan?: string
    trainingRegimen?: string
    competitiveVision?: string
    successUrl?: string
    cancelUrl?: string
    sandbox?: boolean
  }

  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: "Invalid request body" }, 400)
  }

  const useSandbox = body.sandbox === true

  const accessToken = useSandbox ? env.SQUARE_SANDBOX_ACCESS_TOKEN : env.SQUARE_ACCESS_TOKEN
  const locationId = useSandbox ? env.SQUARE_SANDBOX_LOCATION_ID : env.SQUARE_LOCATION_ID

  if (!accessToken || !locationId) {
    const mode = useSandbox ? "sandbox" : "production"
    return c.json({ error: `Square ${mode} not configured. Missing token or location ID.` }, 500)
  }

  const {
    applicantName = "",
    applicantEmail = "",
    developmentPlan = "",
    trainingRegimen = "",
    competitiveVision = "",
    successUrl = "https://titleist-shopify-store-45pi183s.blinkpowered.com/grant/success",
    cancelUrl = "https://titleist-shopify-store-45pi183s.blinkpowered.com/grant",
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

  const squareBaseUrl = useSandbox
    ? "https://connect.squareupsandbox.com"
    : "https://connect.squareup.com"

  const paymentName = useSandbox
    ? "[TEST] Dominus Golf Development Grant — $15 Application Fee"
    : "Dominus Golf Development Grant — $15 Application Fee"

  const squareBody = {
    idempotency_key: idempotencyKey,
    quick_pay: {
      name: paymentName,
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
      replyTo: "Customersupport@dominusgolf.com",
      subject: "Your Dominus Golf Grant Application",
      html: [
        '<div style="max-width:520px;margin:0 auto;font-family:Georgia,serif;color:#1a1a1a;line-height:1.7">',
        `<p>Hi ${name},</p>`,
        '<p>Thanks for applying to the Dominus Golf Development Grant. Your application and payment have been received.</p>',
        '<p>As promised, your free eBook <em>The Ultimate Guide to Master the Game</em> is ready:</p>',
        `<p><a href="${EBOOK_URL}" style="color:#C4963B">${EBOOK_URL}</a></p>`,
        '<p style="margin-top:24px"><strong>Timeline:</strong></p>',
        '<ul style="padding-left:20px">',
        '<li>Applications reviewed on a rolling basis</li>',
        '<li><strong>Winner notified August 22, 2026</strong></li>',
        '<li>All applicants will hear back</li>',
        '</ul>',
        '<p style="margin-top:24px;font-size:13px;color:#777">',
        'Questions? Reply to this email or reach us at Customersupport@dominusgolf.com',
        '</p>',
        '<p style="font-size:13px;color:#777">Dominus Golf</p>',
        '</div>',
      ].join("\n"),
      text: [
        `Hi ${name},`,
        ``,
        `Thanks for applying to the Dominus Golf Development Grant. Your application and payment have been received.`,
        ``,
        `Your free eBook — The Ultimate Guide to Master the Game:`,
        `${EBOOK_URL}`,
        ``,
        `Timeline:`,
        `- Applications reviewed on a rolling basis`,
        `- Winner notified August 22, 2026`,
        `- All applicants will hear back`,
        ``,
        `Questions? Email Customersupport@dominusgolf.com`,
        ``,
        `Dominus Golf`,
      ].join("\n"),
    })

    return c.json({ success: true })
  } catch (err: unknown) {
    const raw = JSON.stringify(err, Object.getOwnPropertyNames(err))
    console.error("Grant email error (raw):", raw)
    console.error("Grant email error (message):", err instanceof Error ? err.message : String(err))
    const message = err instanceof Error ? err.message : "Email send failed"
    return c.json({ error: message }, 500)
  }
})

export default app