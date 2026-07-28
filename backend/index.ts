import { Hono } from "hono"
import { cors } from "hono/cors"

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
      name: `Dominus Golf Order - ${items.length} item${items.length > 1 ? "s" : ""}`,
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

  const squareBaseUrl = useSandbox
    ? "https://connect.squareupsandbox.com"
    : "https://connect.squareup.com"

  const paymentName = useSandbox
    ? "[TEST] Dominus Golf Development Grant - $15 Application Fee"
    : "Dominus Golf Development Grant - $15 Application Fee"

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

// ── Grant eBook email (themed to match the site) ──────────────────────────
function buildGrantEmailHtml(rawName: string): string {
  const name = rawName.replace(/[<>]/g, "").trim() || "Applicant"
  return `<div style="background:#f4f1ea;margin:0;padding:32px 0;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #e6e0d4;">
        <tr><td style="height:4px;background:#C4963B;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td align="center" style="padding:34px 40px 6px;">
          <div style="font-family:Georgia,serif;font-size:22px;letter-spacing:4px;color:#1a1a1a;font-weight:bold;text-transform:uppercase;">Dominus Golf</div>
          <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;color:#C4963B;text-transform:uppercase;margin-top:6px;">Development Grant</div>
        </td></tr>
        <tr><td style="padding:22px 40px 4px;font-family:Georgia,serif;color:#1a1a1a;font-size:16px;line-height:1.7;">
          <p style="margin:0 0 16px;">Hi ${name},</p>
          <p style="margin:0 0 16px;">Thank you for applying to the <strong>Dominus Golf Development Grant</strong>. Your application and $15 application fee have been received.</p>
          <p style="margin:0 0 6px;">As promised, your complimentary eBook <em>The Ultimate Guide to Master the Game</em> is ready to download:</p>
        </td></tr>
        <tr><td align="center" style="padding:14px 40px 26px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="background:#C4963B;">
              <a href="${EBOOK_URL}" style="display:inline-block;padding:14px 34px;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#ffffff;text-decoration:none;">Download Your eBook</a>
            </td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:0 40px;"><div style="border-top:1px solid #e6e0d4;"></div></td></tr>
        <tr><td style="padding:22px 40px;font-family:Georgia,serif;color:#1a1a1a;line-height:1.7;">
          <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a8375;">What happens next</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#4a4a4a;">
            <tr><td style="padding:4px 0;">&bull;&nbsp; Applications are reviewed on a rolling basis.</td></tr>
            <tr><td style="padding:4px 0;">&bull;&nbsp; The winner is notified on <strong style="color:#1a1a1a;">August 22, 2026</strong>.</td></tr>
            <tr><td style="padding:4px 0;">&bull;&nbsp; All applicants will hear back from our team.</td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:20px 40px 32px;background:#faf8f4;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#8a8375;">
          Questions? Reply to this email or reach us at <a href="mailto:Customersupport@dominusgolf.com" style="color:#C4963B;text-decoration:none;">Customersupport@dominusgolf.com</a>.
          <div style="margin-top:12px;color:#b3ab9a;">&copy; Dominus Golf - Excellence Recognized. Development Funded.</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</div>`
}

function buildGrantEmailText(rawName: string): string {
  const name = rawName.replace(/[<>]/g, "").trim() || "Applicant"
  return [
    `Hi ${name},`,
    ``,
    `Thank you for applying to the Dominus Golf Development Grant. Your application and $15 application fee have been received.`,
    ``,
    `Your complimentary eBook - The Ultimate Guide to Master the Game:`,
    `${EBOOK_URL}`,
    ``,
    `What happens next:`,
    `- Applications are reviewed on a rolling basis.`,
    `- The winner is notified on August 22, 2026.`,
    `- All applicants will hear back from our team.`,
    ``,
    `Questions? Email Customersupport@dominusgolf.com`,
    ``,
    `Dominus Golf - Excellence Recognized. Development Funded.`,
  ].join("\n")
}

async function sendGrantEmail(
  env: Record<string, string>,
  name: string,
  email: string,
): Promise<{ ok: true; id?: string } | { ok: false; error: string }> {
  const resendApiKey = env.RESEND_API_KEY
  const fromAddress = env.RESEND_FROM || "Dominus Golf <Customersupport@send.dominusgolf.com>"
  if (!resendApiKey) return { ok: false, error: "Email not configured (missing RESEND_API_KEY)" }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: fromAddress,
      to: email,
      reply_to: "Customersupport@dominusgolf.com",
      subject: "Your Dominus Golf Grant Application & Free eBook",
      html: buildGrantEmailHtml(name),
      text: buildGrantEmailText(name),
    }),
  })
  const data = (await response.json().catch(() => ({}))) as { id?: string; message?: string; name?: string }
  if (!response.ok) {
    console.error("Resend error:", JSON.stringify(data))
    return { ok: false, error: data.message || data.name || "Email send failed" }
  }
  return { ok: true, id: data.id }
}

// POST /api/grant/complete — verify the Square payment, THEN send the eBook email.
// Body: { orderId?, paymentId?, sandbox?, email?, name? }
app.post("/api/grant/complete", async (c) => {
  const env = c.env as Record<string, string>
  let body: { orderId?: string; paymentId?: string; sandbox?: boolean; email?: string; name?: string }
  try { body = await c.req.json() } catch { return c.json({ error: "Invalid request body" }, 400) }

  const useSandbox = body.sandbox === true
  const accessToken = useSandbox ? env.SQUARE_SANDBOX_ACCESS_TOKEN : env.SQUARE_ACCESS_TOKEN
  if (!accessToken) {
    return c.json({ error: `Square ${useSandbox ? "sandbox" : "production"} not configured.` }, 500)
  }
  const squareBaseUrl = useSandbox ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com"
  const sqHeaders = {
    Authorization: `Bearer ${accessToken}`,
    "Square-Version": "2024-04-17",
    "Content-Type": "application/json",
  }

  let orderId = body.orderId
  let paid = false
  let note = ""

  try {
    // If only a payment id is known, resolve the order id + status from it.
    if (!orderId && body.paymentId) {
      const pRes = await fetch(`${squareBaseUrl}/v2/payments/${body.paymentId}`, { headers: sqHeaders })
      const pData = await pRes.json() as { payment?: { order_id?: string; status?: string } }
      orderId = pData.payment?.order_id
      if (pData.payment?.status === "COMPLETED" || pData.payment?.status === "APPROVED") paid = true
    }

    if (!orderId) {
      return c.json({ error: "Missing order reference; cannot verify payment." }, 400)
    }

    const oRes = await fetch(`${squareBaseUrl}/v2/orders/${orderId}`, { headers: sqHeaders })
    const oData = await oRes.json() as {
      order?: { state?: string; note?: string; net_amount_due_money?: { amount?: number } }
      errors?: unknown
    }
    if (!oRes.ok || !oData.order) {
      console.error("Square order lookup failed:", JSON.stringify(oData.errors))
      return c.json({ error: "Could not verify payment with Square." }, 502)
    }
    note = oData.order.note || ""
    if (oData.order.state === "COMPLETED" || oData.order.net_amount_due_money?.amount === 0) paid = true
  } catch (err: unknown) {
    console.error("Grant completion verify error:", err instanceof Error ? err.message : String(err))
    return c.json({ error: "Payment verification failed." }, 502)
  }

  if (!paid) {
    return c.json({ success: false, paid: false, error: "Payment not completed." }, 402)
  }

  // Recipient: prefer values passed from the checkout form; fall back to the order note.
  let name = (body.name || "").trim()
  let email = (body.email || "").trim()
  if (!email) {
    const m = note.match(/Email:\s*([^\s|]+)/)
    if (m) email = m[1]
  }
  if (!name) {
    const m = note.match(/Name:\s*(.*?)\s*\|/)
    if (m) name = m[1]
  }
  if (!name) name = "Applicant"

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return c.json({ success: false, paid: true, error: "Payment verified but no valid email found." }, 400)
  }

  const result = await sendGrantEmail(env, name, email)
  if (!result.ok) return c.json({ success: false, paid: true, emailed: false, error: result.error }, 500)
  return c.json({ success: true, paid: true, emailed: true, id: result.id, email })
})

export default app