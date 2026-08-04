/**
 * Affiliate referral attribution.
 *
 * GoAffPro sends traffic to the site with the affiliate's code in the query string.
 * Nothing was reading it, so an affiliate could send a paying customer and never be
 * credited — the programme was live but no commission could ever be attributed.
 *
 * The code is captured on arrival and kept in localStorage, then attached to the
 * checkout request so it reaches Square as order metadata and comes back to us on
 * the webhook. localStorage rather than sessionStorage because the gap between
 * clicking an affiliate link and buying is usually days, not one session — and the
 * Square checkout is a full navigation away from the site and back.
 */

const KEY = 'affiliateRef';

/** Window GoAffPro's own default cookie uses. Beyond this the credit expires. */
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** GoAffPro links use ?ref=; the others are common aliases worth honouring. */
const PARAMS = ['ref', 'aff', 'affiliate'];

type Stored = { code: string; at: number };

/**
 * Reads a referral code out of the current URL and stores it.
 *
 * First touch wins: if a visitor already carries a live code, a later link does not
 * overwrite it. Two affiliates both claiming the same sale is worse than crediting
 * whoever introduced the customer first.
 */
export function captureReferralFromUrl(search: string = window.location.search): void {
  try {
    const params = new URLSearchParams(search);
    const code = PARAMS.map((p) => params.get(p)).find((v) => v && v.trim());
    if (!code) return;
    if (readReferral()) return;
    const entry: Stored = { code: code.trim().slice(0, 100), at: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(entry));
  } catch {
    // Private mode, or storage disabled. Attribution is best-effort; never let it
    // break the page a customer is trying to shop on.
  }
}

/** The live referral code, or null when absent or past its window. */
export function readReferral(): string | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Stored>;
    if (typeof parsed?.code !== 'string' || typeof parsed?.at !== 'number') return null;
    if (Date.now() - parsed.at > TTL_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return parsed.code;
  } catch {
    return null;
  }
}
