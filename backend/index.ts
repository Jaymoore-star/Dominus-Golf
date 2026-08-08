import { Hono } from "hono"
import { cors } from "hono/cors"
import { registerOrderRoutes } from "./orders"
import { resolveCart, type IncomingItem } from "./pricing"

const EBOOK_URL = "https://drive.google.com/uc?export=download&id=1Ir1DaLgMH-8eVzlQA6xrb7kKO8H_N95p"

/**
 * The only origins this API answers to, and the only places Square may send a
 * buyer after paying. Both lists are the same set, so they are one constant.
 *
 * localhost is here for `npm run dev` against `npm run dev:backend`; it grants an
 * attacker nothing, since they would have to be running code on the victim's own
 * machine on that port already.
 */
const ALLOWED_ORIGINS = [
  "https://www.dominusgolf.com",
  "https://dominusgolf.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]

/**
 * Keeps Square's post-payment redirect pointed at our own site.
 *
 * `successUrl` arrives in the request body and went straight through to Square, so
 * anyone could mint a *real* payment link on the Dominus merchant account that
 * dropped the buyer on a page of their choosing once the money had gone through —
 * a genuine charge from us followed by someone else's "your card was declined,
 * please re-enter it". Prices were never reachable (see pricing.ts); the redirect
 * was the way in.
 *
 * Anything unparseable or off-origin falls back rather than erroring: a stale
 * frontend sending an old URL should still be able to check out.
 */
function safeRedirect(candidate: string | undefined, fallback: string): string {
  if (!candidate) return fallback
  try {
    const url = new URL(candidate)
    return ALLOWED_ORIGINS.includes(url.origin) ? url.toString() : fallback
  } catch {
    return fallback
  }
}

const app = new Hono()

/* Browsers only — a CORS header stops a page on another origin reading our
   responses, and does nothing at all about a server-side POST. It is the
   redirect allowlist above, not this, that closes the payment-link abuse.
   Square's webhook sends no Origin header and is unaffected. */
app.use("*", cors({ origin: ALLOWED_ORIGINS }))

// Order recording + affiliate reporting. See backend/orders.ts.
registerOrderRoutes(app)

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
    /** Which products and how many. Priced from the catalogue — see resolveCart. */
    items: IncomingItem[]
    successUrl?: string
    cancelUrl?: string
    /** Signed-in buyer, so the webhook can attach the order to their account. */
    userId?: string
    /** GoAffPro code captured from ?ref= on the landing page. */
    referralCode?: string
  }

  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: "Invalid request body" }, 400)
  }

  const { items, successUrl, cancelUrl, userId, referralCode } = body

  if (!items || items.length === 0) {
    return c.json({ error: "No items provided" }, 400)
  }

  /**
   * One Square line item per cart line, priced from the catalogue.
   *
   * This used to be a `quick_pay`, which by design is a single ad-hoc charge with
   * one name and one amount — so every order reached Square as "Dominus Golf
   * Order - N items" with no product names and no sizes. The item detail was
   * being passed as `pre_populated_data.note`, but PrePopulatedData only accepts
   * buyer_email / buyer_phone_number / buyer_address, so Square dropped it: none
   * of it survived the request.
   *
   * An `order` carries real line items instead, so the buyer sees what they are
   * paying for and the Seller Dashboard shows what has to be picked and shipped.
   */
  const resolved = resolveCart(items)
  if (!resolved.ok) {
    // 400 with a message the cart drawer can show the shopper as-is.
    return c.json({ error: resolved.error }, 400)
  }
  const { lineItems, shippingCents, hasPhysicalItems, summary: itemSummary } = resolved.cart

  const idempotencyKey = `checkout_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`

  // Always use production Square — sandbox detection was incorrectly matching production tokens
  const squareBaseUrl = "https://connect.squareup.com"

  const squareBody = {
    idempotency_key: idempotencyKey,
    order: {
      location_id: locationId,
      line_items: lineItems,
      /* The only channel that survives a Square-hosted checkout. Square knows
         nothing about our user ids or affiliate codes, so they ride along here
         and the webhook reads them back off the order. Values are trimmed to
         Square's 255-character limit. */
      metadata: {
        ...(userId ? { user_id: String(userId).slice(0, 255) } : {}),
        ...(referralCode ? { referral_code: String(referralCode).slice(0, 255) } : {}),
      },
    },
    checkout_options: {
      redirect_url: safeRedirect(successUrl, "https://www.dominusgolf.com"),
      /* Nothing to post on a download-only order, so do not make the buyer type
         an address to receive an email. */
      ask_for_shipping_address: hasPhysicalItems,
      /* Sent explicitly rather than left to Square, which otherwise applies the
         flat rate set in the Dashboard to every payment link regardless of cart
         value — that is what contradicted the free shipping over $150 the site
         promises. Keep the Dashboard rate at $0 or the two stack.

         Only ever sent alongside a shipping address: Square rejects the whole
         request with "AskForShippingAddress cannot be set to 'false' if
         ShippingFee is present", which broke digital checkout outright. A
         download-only order sends no fee at all, and the Dashboard's $0 rate
         cannot appear either because Square costs shipping only when it is
         collecting an address. */
      ...(hasPhysicalItems
        ? {
            shipping_fee: {
              /* One constant name at both prices. Square renders a zero charge as
                 "Free" by itself, so calling the method "Free Shipping" too gave
                 the buyer "Free Shipping — Free". Naming the method and letting
                 Square price it reads correctly either way: "Standard Shipping —
                 Free" above the threshold, "Standard Shipping — $6.99" below.

                 Still sent rather than omitted above the threshold: leaving it out
                 lets Square fall back to the Dashboard profile's own $0 rate, and
                 that line rendered as a bare "$0.00". */
              name: "Standard Shipping",
              charge: { amount: shippingCents, currency: "USD" },
            },
          }
        : {}),
      enable_coupon: false,
      enable_loyalty: false,
      accepted_payment_methods: {
        card: true,
        cash_app_pay: true,
      },
    },
    payment_note: itemSummary.slice(0, 500),
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

  /* The applicant's answers used to be packed into a note string here and handed
     to Square, which threw it away every time. They now go to grant_applications
     below, in full — see saveGrantApplication. */

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
    /**
     * A full order rather than a quick_pay.
     *
     * quick_pay cannot carry metadata, and without a tag the order webhook has no
     * way to tell an application fee from a shop purchase — every Square payment
     * reaches it the same way. That is how an applicant ended up being sent an
     * "Order Confirmed — here is what you bought" email, with a shipping line, for
     * a $15 form submission.
     */
    order: {
      location_id: locationId,
      line_items: [
        {
          name: paymentName,
          quantity: "1",
          base_price_money: { amount: 1500, currency: "USD" },
        },
      ],
      metadata: { type: "grant" },
      /* No note. The applicant's answers used to be smuggled through Square as a
         truncated note string and were silently discarded — verified twice: an
         order created with `pre_populated_data.note` and one created with
         `order.note` both come back with `note: undefined`. They are written to
         grant_applications instead, in full and unabridged. */
    },
    checkout_options: {
      redirect_url: safeRedirect(successUrl, "https://www.dominusgolf.com/grant/success"),
      ask_for_shipping_address: false,
      enable_coupon: false,
      enable_loyalty: false,
      accepted_payment_methods: {
        card: true,
        cash_app_pay: true,
      },
    },
    /* buyer_email only. `note` used to be passed here too and was discarded every
       time; it now goes on the order above, where Square keeps it. */
    pre_populated_data: {
      buyer_email: applicantEmail || undefined,
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

    /* Stored here, keyed on the Square order, because this is the last point at
       which we still hold the applicant's answers — after this the browser leaves
       for Square and never sends them again. Awaited so a paid application is
       never missing its answers, but it cannot fail the checkout. */
    const grantOrderId = data.payment_link?.order_id
    if (grantOrderId) {
      await saveGrantApplication(env, {
        square_order_id: grantOrderId,
        applicant_name: applicantName || null,
        applicant_email: applicantEmail || null,
        development_plan: developmentPlan || null,
        training_regimen: trainingRegimen || null,
        competitive_vision: competitiveVision || null,
      })
    } else {
      console.error("Grant application NOT stored: Square returned no order_id")
    }

    return c.json({
      url: data.payment_link?.url,
      paymentLinkId: data.payment_link?.id,
      orderId: grantOrderId,
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

/** Escape user-supplied text before it goes anywhere near the HTML template. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/**
 * Enquiry notification, styled to match the grant email and the site: cream
 * ground, gold rule, Georgia headings. Read internally rather than by a customer,
 * so the message body is the focus and Reply is one tap.
 */
function buildContactEmailHtml(name: string, email: string, message: string): string {
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  // Preserve the paragraph breaks the sender typed.
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br/>")

  return `<div style="background:#f4f1ea;margin:0;padding:32px 0;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #e6e0d4;">
        <tr><td style="height:4px;background:#C4963B;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td align="center" style="padding:34px 40px 6px;">
          <div style="font-family:Georgia,serif;font-size:22px;letter-spacing:4px;color:#1a1a1a;font-weight:bold;text-transform:uppercase;">Dominus Golf</div>
          <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;color:#C4963B;text-transform:uppercase;margin-top:6px;">Website Enquiry</div>
        </td></tr>

        <tr><td style="padding:24px 40px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f4;border:1px solid #e6e0d4;">
            <tr>
              <td style="padding:14px 18px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a8375;width:74px;">From</td>
              <td style="padding:14px 18px 14px 0;font-family:Georgia,serif;font-size:16px;color:#1a1a1a;">${safeName}</td>
            </tr>
            <tr><td colspan="2" style="padding:0 18px;"><div style="border-top:1px solid #e6e0d4;"></div></td></tr>
            <tr>
              <td style="padding:14px 18px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a8375;">Email</td>
              <td style="padding:14px 18px 14px 0;font-family:Arial,sans-serif;font-size:14px;">
                <a href="mailto:${safeEmail}" style="color:#C4963B;text-decoration:none;">${safeEmail}</a>
              </td>
            </tr>
          </table>
        </td></tr>

        <tr><td style="padding:26px 40px 6px;">
          <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a8375;">Message</p>
          <div style="font-family:Georgia,serif;font-size:16px;line-height:1.7;color:#1a1a1a;border-left:3px solid #C4963B;padding:2px 0 2px 16px;">${safeMessage}</div>
        </td></tr>

        <tr><td align="center" style="padding:26px 40px 30px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="background:#C4963B;">
              <a href="mailto:${safeEmail}" style="display:inline-block;padding:14px 34px;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#ffffff;text-decoration:none;">Reply to ${safeName}</a>
            </td>
          </tr></table>
        </td></tr>

        <tr><td style="padding:20px 40px 32px;background:#faf8f4;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#8a8375;">
          Sent from the contact form on dominusgolf.com. Replying to this email goes straight back to the sender.
          <div style="margin-top:12px;color:#b3ab9a;">&copy; Dominus Golf - Excellence Recognized. Development Funded.</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</div>`
}

function buildContactEmailText(name: string, email: string, message: string): string {
  return [
    `New website enquiry`,
    ``,
    `From:  ${name}`,
    `Email: ${email}`,
    ``,
    `Message:`,
    message,
    ``,
    `Sent from the contact form on dominusgolf.com. Reply to this email to answer the sender.`,
  ].join("\n")
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

// POST /api/contact — deliver a website enquiry to customer support.
// Body: { firstName, lastName, email, message }
//
// The contact form previously had no handler at all: submitting it did a native
// form post, so the page reloaded and the message was discarded. Nothing was ever
// received from it.
//
// Sends to SUPPORT_INBOX with reply_to set to the enquirer, so hitting Reply in
// the inbox goes straight back to them.
app.post("/api/contact", async (c) => {
  const env = c.env as Record<string, string>
  const body = (await c.req.json().catch(() => ({}))) as {
    firstName?: string
    lastName?: string
    email?: string
    message?: string
  }

  const firstName = (body.firstName || "").trim()
  const lastName = (body.lastName || "").trim()
  const email = (body.email || "").trim()
  const message = (body.message || "").trim()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return c.json({ error: "A valid email address is required." }, 400)
  }
  if (!message) {
    return c.json({ error: "Please include a message." }, 400)
  }
  // Generous ceilings; enough to stop someone posting a novel through the form.
  if (message.length > 5000 || firstName.length > 100 || lastName.length > 100) {
    return c.json({ error: "That message is too long. Please shorten it and try again." }, 400)
  }

  const resendApiKey = env.RESEND_API_KEY
  if (!resendApiKey) {
    console.error("Contact form: RESEND_API_KEY missing")
    return c.json({ error: "Messaging is temporarily unavailable. Please email us directly." }, 503)
  }

  const fromAddress = env.RESEND_FROM || "Dominus Golf <Customersupport@send.dominusgolf.com>"
  const supportInbox = env.SUPPORT_INBOX || "Customersupport@dominusgolf.com"
  const name = [firstName, lastName].filter(Boolean).join(" ") || "Website visitor"

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: fromAddress,
      to: supportInbox,
      reply_to: email,
      subject: `Website enquiry from ${name}`,
      text: buildContactEmailText(name, email, message),
      html: buildContactEmailHtml(name, email, message),
    }),
  })

  const data = (await response.json().catch(() => ({}))) as { id?: string; message?: string; name?: string }
  if (!response.ok) {
    console.error("Contact form Resend error:", JSON.stringify(data))
    return c.json({ error: "Could not send your message. Please email us directly." }, 502)
  }

  return c.json({ ok: true, id: data.id })
})

/**
 * Records an application against its Square order.
 *
 * Called once the payment link exists but before the applicant has paid, so the
 * answers survive an abandoned checkout — `paid` is what marks a real entry.
 *
 * Never fails the checkout: the applicant is mid-payment, and a storage problem
 * on our side must not stop them paying. It logs loudly instead, because a silent
 * failure here is exactly how the answers came to be lost in the first place.
 */
async function saveGrantApplication(
  env: Record<string, string>,
  row: Record<string, unknown>,
): Promise<void> {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Grant application NOT stored: Supabase env missing")
    return
  }
  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/grant_applications?on_conflict=square_order_id`,
    {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify(row),
    },
  )
  if (!res.ok) {
    console.error(
      "Grant application NOT stored (run supabase/migrations/0006_grant_applications.sql?):",
      res.status,
      await res.text(),
    )
  }
}

/** Marks an application as paid once Square has confirmed the fee. */
async function markGrantApplicationPaid(env: Record<string, string>, squareOrderId: string) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return
  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/grant_applications?square_order_id=eq.${encodeURIComponent(squareOrderId)}`,
    {
      method: "PATCH",
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paid: true, paid_at: new Date().toISOString() }),
    },
  )
  if (!res.ok) console.error("Grant application paid-mark failed:", res.status, await res.text())
}

/**
 * Claims the one send of the grant eBook for an order.
 *
 * The insert *is* the claim: square_order_id is the primary key, so of two
 * concurrent calls exactly one gets a row back and the other sees a conflict.
 *
 * "untracked" means the marker could not be consulted — the migration has not been
 * run, or Supabase is unreachable. That degrades to the old behaviour of sending
 * every time, which is the right way round: a paying applicant not receiving their
 * eBook is a worse failure than receiving it twice.
 */
async function claimGrantEmail(
  env: Record<string, string>,
  squareOrderId: string,
  email: string,
): Promise<"claimed" | "already-sent" | "untracked"> {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return "untracked"

  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/grant_emails?on_conflict=square_order_id`, {
    method: "POST",
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates,return=representation",
    },
    body: JSON.stringify({ square_order_id: squareOrderId, email }),
  })
  if (!res.ok) {
    console.error(
      "Grant email claim failed (run supabase/migrations/0005_grant_emails.sql?):",
      res.status,
      await res.text(),
    )
    return "untracked"
  }
  const rows = (await res.json()) as unknown[]
  return rows.length > 0 ? "claimed" : "already-sent"
}

/** Gives the claim back when the send then failed, so a retry can take it. */
async function releaseGrantEmail(env: Record<string, string>, squareOrderId: string) {
  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/grant_emails?square_order_id=eq.${encodeURIComponent(squareOrderId)}`,
    {
      method: "DELETE",
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    },
  )
  if (!res.ok) console.error("Grant email claim release failed:", res.status, await res.text())
}

// POST /api/grant/complete — verify the Square payment, THEN send the eBook email.
// Body: { orderId?, paymentId?, sandbox?, email?, name? }
//
// Unauthenticated by necessity: the applicant comes back from a Square-hosted page
// with only a reference in the URL, so there is no session to check. Two things
// stand in for that — the recipient is taken from Square rather than the request
// (see below), and grant_emails makes the send once-only.
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
  /** The buyer's address as Square recorded it. Authoritative over the request. */
  let squareEmail = ""

  try {
    /* `transactionId` in the success URL is NOT a payment id. Square puts the
       *order* id in both query parameters, so /v2/payments/{transactionId} always
       404s — which is why looking the buyer up by it silently found nothing and
       fell through to whatever the caller supplied. Treat it as an order id. */
    if (!orderId && body.paymentId) orderId = body.paymentId

    if (!orderId) {
      return c.json({ error: "Missing order reference; cannot verify payment." }, 400)
    }

    const oRes = await fetch(`${squareBaseUrl}/v2/orders/${orderId}`, { headers: sqHeaders })
    const oData = await oRes.json() as {
      order?: {
        state?: string
        note?: string
        net_amount_due_money?: { amount?: number }
        tenders?: { payment_id?: string }[]
      }
      errors?: unknown
    }
    if (!oRes.ok || !oData.order) {
      console.error("Square order lookup failed:", JSON.stringify(oData.errors))
      return c.json({ error: "Could not verify payment with Square." }, 502)
    }
    note = oData.order.note || ""
    if (oData.order.state === "COMPLETED" || oData.order.net_amount_due_money?.amount === 0) paid = true

    /* The real payment id lives on the order's tender, and the payment is the
       only place Square records the buyer's email. That email is what binds this
       send to an actual purchase instead of to whatever the request asked for. */
    const paymentId = oData.order.tenders?.[0]?.payment_id
    if (paymentId) {
      const pRes = await fetch(`${squareBaseUrl}/v2/payments/${paymentId}`, { headers: sqHeaders })
      const pData = await pRes.json() as {
        payment?: { status?: string; buyer_email_address?: string; receipt_email?: string }
      }
      const p = pData.payment
      if (p) {
        if (p.status === "COMPLETED" || p.status === "APPROVED") paid = true
        squareEmail = (p.buyer_email_address || p.receipt_email || "").trim()
      }
    }
  } catch (err: unknown) {
    console.error("Grant completion verify error:", err instanceof Error ? err.message : String(err))
    return c.json({ error: "Payment verification failed." }, 502)
  }

  if (!paid) {
    return c.json({ success: false, paid: false, error: "Payment not completed." }, 402)
  }

  /* Square has confirmed the fee, so this application is a real entry rather than
     an abandoned checkout. Marked before the email, which can fail independently:
     a judgeable application matters more than the eBook going out. */
  await markGrantApplicationPaid(env, orderId)

  /**
   * Recipient, in order of how much it can be trusted.
   *
   * Square first. `body.email` is read straight off the `?e=` in the success URL,
   * so preferring it — which is what this did — turned an unauthenticated endpoint
   * into a way to have Dominus-branded mail delivered to any address at all, given
   * one order id. Square's own record of the buyer cannot be steered that way.
   *
   * The note is the second source, though Square drops `pre_populated_data.note`
   * (see the checkout handler above), so in practice it is empty. The request is
   * last, kept only so a payment that somehow carries no email still reaches the
   * applicant rather than failing outright.
   */
  let email = squareEmail
  if (!email) {
    const m = note.match(/Email:\s*([^\s|]+)/)
    if (m) email = m[1]
  }
  if (!email) email = (body.email || "").trim()

  // Cosmetic only — it appears in the greeting, and buildGrantEmailHtml strips
  // angle brackets — so the form's value is fine here.
  let name = (body.name || "").trim()
  if (!name) {
    const m = note.match(/Name:\s*(.*?)\s*\|/)
    if (m) name = m[1]
  }
  if (!name) name = "Applicant"

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return c.json({ success: false, paid: true, error: "Payment verified but no valid email found." }, 400)
  }

  const claim = await claimGrantEmail(env, orderId, email)
  if (claim === "already-sent") {
    /* Reported as success, not as an error: the applicant's eBook did go, and a
       refresh of the success page must not tell them something went wrong. */
    return c.json({ success: true, paid: true, emailed: false, alreadySent: true, email })
  }

  const result = await sendGrantEmail(env, name, email)
  if (!result.ok) {
    // Nothing was delivered, so the claim must not stand or nothing ever will be.
    if (claim === "claimed") await releaseGrantEmail(env, orderId)
    return c.json({ success: false, paid: true, emailed: false, error: result.error }, 500)
  }
  return c.json({ success: true, paid: true, emailed: true, id: result.id, email })
})


export default app