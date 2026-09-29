/**
 * Shared send and livery for the marketing-side emails: the review request and
 * the email-list welcome.
 *
 * Same look as the order confirmation in orderEmail.ts (cream ground, gold rule,
 * Georgia headings), so every email from the shop reads as one brand. That file
 * keeps its own copy of the shell rather than being refactored onto this one: it
 * is the email every paying customer gets, and it works.
 */

type Env = Record<string, string>

export const SITE_URL = "https://www.dominusgolf.com"
export const SUPPORT_EMAIL = "Customersupport@dominusgolf.com"

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/** A gold call-to-action button, table-built so Outlook renders it. */
export function buttonHtml(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td style="background:#C4963B;">
                <a href="${escapeHtml(url)}" style="display:inline-block;padding:14px 34px;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#ffffff;text-decoration:none;">${escapeHtml(label)}</a>
              </td>
            </tr></table>`
}

/**
 * The branded frame. `body` is trusted HTML - callers escape anything that came
 * from a customer or from Square before putting it in.
 */
export function emailShellHtml(p: { eyebrow: string; body: string; footer?: string; head?: string }): string {
  const frame = shellFrameHtml(p)
  /* Gmail reads annotation markup from the document <head> only, so an email
     that carries some is sent as a whole document rather than a bare fragment. */
  return p.head
    ? `<!doctype html><html><head><meta charset="utf-8">${p.head}</head><body style="margin:0;">${frame}</body></html>`
    : frame
}

function shellFrameHtml(p: { eyebrow: string; body: string; footer?: string }): string {
  return `<div style="background:#f4f1ea;margin:0;padding:32px 0;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #e6e0d4;">
        <tr><td style="height:4px;background:#C4963B;font-size:0;line-height:0;">&nbsp;</td></tr>

        <tr><td align="center" style="padding:34px 40px 6px;">
          <div style="font-family:Georgia,serif;font-size:22px;letter-spacing:4px;color:#1a1a1a;font-weight:bold;text-transform:uppercase;">Dominus Golf</div>
          <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;color:#C4963B;text-transform:uppercase;margin-top:6px;">${escapeHtml(p.eyebrow)}</div>
        </td></tr>

        ${p.body}

        <tr><td style="padding:20px 40px 32px;background:#faf8f4;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#8a8375;">
          ${p.footer ?? `Questions? Reply to this email or reach us at <a href="mailto:${SUPPORT_EMAIL}" style="color:#C4963B;text-decoration:none;">${SUPPORT_EMAIL}</a>.`}
          <div style="margin-top:12px;color:#b3ab9a;">&copy; Dominus Golf - Excellence Recognized. Development Funded.</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</div>`
}

/**
 * One email through Resend. False on any failure, never a throw: every caller
 * is doing this as a side effect of something that has already succeeded.
 */
export async function sendEmail(
  env: Env,
  p: { to: string; subject: string; html: string; text: string; tag: string },
): Promise<boolean> {
  if (!env.RESEND_API_KEY) {
    console.error(`${p.tag} not sent: RESEND_API_KEY missing`)
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
        to: p.to,
        reply_to: SUPPORT_EMAIL,
        subject: p.subject,
        html: p.html,
        text: p.text,
      }),
    })
    if (!res.ok) {
      console.error(`${p.tag} Resend error:`, res.status, await res.text())
      return false
    }
    return true
  } catch (err) {
    console.error(`${p.tag} send failed:`, err instanceof Error ? err.message : String(err))
    return false
  }
}

/** Service-role auth for PostgREST. Bypasses RLS, so it never leaves the Worker. */
export function serviceHeaders(env: Env): Record<string, string> {
  return {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
  }
}

export function hasSupabase(env: Env): boolean {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY)
}

/**
 * Constant-time check of an `Authorization: Bearer …` header against
 * ADMIN_TOKEN. With no ADMIN_TOKEN configured every request is refused, so an
 * admin route is closed until someone deliberately opens it.
 */
export function isAdmin(env: Env, header: string | undefined): boolean {
  const expected = env.ADMIN_TOKEN
  if (!expected || !header?.startsWith("Bearer ")) return false
  const given = header.slice("Bearer ".length)
  if (given.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ given.charCodeAt(i)
  return diff === 0
}
