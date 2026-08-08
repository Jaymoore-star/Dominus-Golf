/**
 * Branded order confirmation.
 *
 * Square sends its own receipt from messaging.squareup.com and there is no way to
 * restyle it — it is Square's template, not ours. This is a second email in the
 * site's own livery (cream ground, gold rule, Georgia headings), matching the
 * grant confirmation in backend/index.ts, so the first thing a customer sees
 * after paying looks like the shop they bought from.
 *
 * Sent from the webhook rather than the success page: customers close the tab,
 * and a browser redirect is not proof of payment anyway.
 */

const ORDERS_URL = "https://www.dominusgolf.com/account/orders"
const SUPPORT_EMAIL = "Customersupport@dominusgolf.com"

export type OrderEmailLine = {
  name?: string
  quantity?: string
  variation_name?: string
  total_money?: { amount?: number }
}

export type OrderEmailParams = {
  email: string
  reference: string
  currency: string
  totalCents: number
  lines: OrderEmailLine[]
  /** Shipping charged, in cents. Omitted or 0 renders as "Free". */
  shippingCents?: number
  taxCents?: number
  /** Download links for any digital goods bought. This IS the delivery. */
  downloads?: { label: string; url: string }[]
  /** False for a download-only order: no shipping row, no delivery promise. */
  hasPhysicalItems?: boolean
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function money(cents: number, currency = "USD"): string {
  const symbol = currency === "USD" ? "$" : `${currency} `
  return `${symbol}${(cents / 100).toFixed(2)}`
}

/** Goods only. Square reports each line's own total, so this needs no re-pricing. */
function subtotalOf(lines: OrderEmailLine[]): number {
  return lines.reduce((sum, l) => sum + (l.total_money?.amount ?? 0), 0)
}

function lineRowsHtml(lines: OrderEmailLine[], currency: string): string {
  return lines
    .map((l) => {
      const name = escapeHtml(l.name ?? "Item")
      const variant = l.variation_name ? escapeHtml(l.variation_name) : ""
      const qty = escapeHtml(String(l.quantity ?? "1"))
      const amount = money(l.total_money?.amount ?? 0, currency)
      return `<tr>
            <td style="padding:12px 0;border-bottom:1px solid #f0ece2;font-family:Georgia,serif;font-size:15px;color:#1a1a1a;">
              ${name}${variant ? `<span style="color:#8a8375;"> &middot; ${variant}</span>` : ""}
              <span style="color:#8a8375;"> &times; ${qty}</span>
            </td>
            <td align="right" style="padding:12px 0;border-bottom:1px solid #f0ece2;font-family:Arial,sans-serif;font-size:14px;color:#1a1a1a;white-space:nowrap;">${amount}</td>
          </tr>`
    })
    .join("")
}

function totalRowHtml(label: string, value: string, bold = false): string {
  const weight = bold ? "bold" : "normal"
  const color = bold ? "#1a1a1a" : "#4a4a4a"
  return `<tr>
            <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:${color};font-weight:${weight};">${label}</td>
            <td align="right" style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:${color};font-weight:${weight};white-space:nowrap;">${value}</td>
          </tr>`
}

/** The delivery itself for a digital order, so it leads rather than trails. */
function downloadsHtml(downloads: { label: string; url: string }[]): string {
  if (downloads.length === 0) return ""
  const buttons = downloads
    .map(
      (d) => `<tr><td align="center" style="padding:6px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                <td style="background:#C4963B;">
                  <a href="${d.url}" style="display:inline-block;padding:14px 34px;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#ffffff;text-decoration:none;">Download ${escapeHtml(d.label)}</a>
                </td>
              </tr></table>
            </td></tr>`,
    )
    .join("")

  return `<tr><td style="padding:18px 40px 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f4;border:1px solid #e6e0d4;">
            <tr><td align="center" style="padding:20px 18px 8px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a8375;">Your Download</td></tr>
            ${buttons}
            <tr><td align="center" style="padding:8px 18px 20px;font-family:Arial,sans-serif;font-size:11px;color:#8a8375;">This link stays in your inbox - keep this email to download again later.</td></tr>
          </table>
        </td></tr>`
}

export function buildOrderEmailHtml(p: OrderEmailParams): string {
  const subtotal = subtotalOf(p.lines)
  const shipping = p.shippingCents ?? 0
  const tax = p.taxCents ?? 0
  const downloads = p.downloads ?? []
  const physical = p.hasPhysicalItems !== false

  const totals = [
    totalRowHtml("Subtotal", money(subtotal, p.currency)),
    // A download-only order has no shipping row at all; showing "Free" would
    // still imply something is being posted.
    physical ? totalRowHtml("Shipping", shipping > 0 ? money(shipping, p.currency) : "Free") : "",
    tax > 0 ? totalRowHtml("Tax", money(tax, p.currency)) : "",
    totalRowHtml("Total", money(p.totalCents, p.currency), true),
  ].join("")

  return `<div style="background:#f4f1ea;margin:0;padding:32px 0;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #e6e0d4;">
        <tr><td style="height:4px;background:#C4963B;font-size:0;line-height:0;">&nbsp;</td></tr>

        <tr><td align="center" style="padding:34px 40px 6px;">
          <div style="font-family:Georgia,serif;font-size:22px;letter-spacing:4px;color:#1a1a1a;font-weight:bold;text-transform:uppercase;">Dominus Golf</div>
          <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;color:#C4963B;text-transform:uppercase;margin-top:6px;">Order Confirmed</div>
        </td></tr>

        <tr><td style="padding:22px 40px 4px;font-family:Georgia,serif;color:#1a1a1a;font-size:16px;line-height:1.7;">
          <p style="margin:0 0 16px;">Thank you for your order.</p>
          <p style="margin:0 0 16px;">Your payment has been received and your order is confirmed. Here is what you bought:</p>
        </td></tr>

        ${downloadsHtml(downloads)}

        <tr><td style="padding:8px 40px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${lineRowsHtml(p.lines, p.currency)}
          </table>
        </td></tr>

        <tr><td style="padding:14px 40px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${totals}
          </table>
        </td></tr>

        <tr><td align="center" style="padding:28px 40px 6px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="background:#C4963B;">
              <a href="${ORDERS_URL}" style="display:inline-block;padding:14px 34px;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#ffffff;text-decoration:none;">View Your Orders</a>
            </td>
          </tr></table>
        </td></tr>

        <tr><td align="center" style="padding:14px 40px 26px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;color:#8a8375;">
          Order reference<br/>
          <span style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:0;color:#4a4a4a;word-break:break-all;">${escapeHtml(p.reference)}</span>
        </td></tr>

        <tr><td style="padding:20px 40px 32px;background:#faf8f4;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#8a8375;">
          Questions about this order? Reply to this email or reach us at <a href="mailto:${SUPPORT_EMAIL}" style="color:#C4963B;text-decoration:none;">${SUPPORT_EMAIL}</a>.
          <div style="margin-top:12px;color:#b3ab9a;">&copy; Dominus Golf - Excellence Recognized. Development Funded.</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</div>`
}

export function buildOrderEmailText(p: OrderEmailParams): string {
  const subtotal = subtotalOf(p.lines)
  const shipping = p.shippingCents ?? 0
  const tax = p.taxCents ?? 0
  const downloads = p.downloads ?? []
  const physical = p.hasPhysicalItems !== false

  const lines = p.lines.map((l) => {
    const variant = l.variation_name ? ` (${l.variation_name})` : ""
    return `- ${l.name ?? "Item"}${variant} x${l.quantity ?? "1"}  ${money(l.total_money?.amount ?? 0, p.currency)}`
  })

  const downloadLines = downloads.length
    ? ["", "YOUR DOWNLOAD", ...downloads.map((d) => `${d.label}: ${d.url}`), "Keep this email to download again later."]
    : []

  return [
    `Thank you for your order.`,
    ``,
    `Your payment has been received and your order is confirmed.`,
    ...downloadLines,
    ``,
    ...lines,
    ``,
    `Subtotal: ${money(subtotal, p.currency)}`,
    ...(physical ? [`Shipping: ${shipping > 0 ? money(shipping, p.currency) : "Free"}`] : []),
    ...(tax > 0 ? [`Tax: ${money(tax, p.currency)}`] : []),
    `Total: ${money(p.totalCents, p.currency)}`,
    ``,
    `View your orders: ${ORDERS_URL}`,
    `Order reference: ${p.reference}`,
    ``,
    `Questions? Email ${SUPPORT_EMAIL}`,
    ``,
    `Dominus Golf - Excellence Recognized. Development Funded.`,
  ].join("\n")
}

/**
 * A failure here must never fail the webhook: the order is already recorded and
 * the money already taken, so returning non-2xx would make Square retry a
 * delivery whose only outstanding work is a courtesy email.
 */
export async function sendOrderConfirmationEmail(
  env: Record<string, string>,
  p: OrderEmailParams,
): Promise<boolean> {
  if (!env.RESEND_API_KEY) {
    console.error("Order confirmation not sent: RESEND_API_KEY missing")
    return false
  }
  const from = env.RESEND_FROM || "Dominus Golf <Customersupport@send.dominusgolf.com>"

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: p.email,
        reply_to: SUPPORT_EMAIL,
        subject: "Your Dominus Golf order is confirmed",
        html: buildOrderEmailHtml(p),
        text: buildOrderEmailText(p),
      }),
    })
    if (!res.ok) {
      console.error("Order confirmation Resend error:", res.status, await res.text())
      return false
    }
    return true
  } catch (err) {
    console.error("Order confirmation send failed:", err instanceof Error ? err.message : String(err))
    return false
  }
}
