import { products } from "../src/data/products"
import type { Product } from "../src/data/types"
import { variantDescriptor } from "../src/lib/productVariants"
import { shippingFeeFor } from "../src/lib/shipping"

/**
 * Turns a checkout request into Square line items, priced from the catalogue.
 *
 * The endpoint used to bill whatever `price` the browser put in the request
 * body. Square only ever sees the amount we hand it, so a hand-written POST
 * could buy a $299 driver for a cent, and the resulting order looked completely
 * legitimate in the Seller Dashboard. Nothing about the request is trusted for
 * money any more: the browser says *which* product and *how many*, and every
 * figure that reaches Square is looked up here.
 *
 * The catalogue is imported straight from the frontend's data files rather than
 * duplicated, so a price change cannot land on the site and miss checkout.
 */

/** What the browser is allowed to ask for. Everything else is derived. */
export type IncomingItem = {
  id?: string
  /** Fallback match, and what error messages name. See resolveProduct. */
  name?: string
  quantity?: number
  variant?: string
  /** Accepted and ignored — the catalogue is the only source of price. */
  price?: number
  image?: string
}

export type SquareLineItem = {
  name: string
  quantity: string
  variation_name?: string
  base_price_money: { amount: number; currency: "USD" }
}

export type ResolvedCart = {
  lineItems: SquareLineItem[]
  /** Goods only, before shipping. */
  subtotalCents: number
  /** 0 when the order qualifies for free shipping, or has nothing to ship. */
  shippingCents: number
  /** False for a download-only order, which needs no address and no carrier. */
  hasPhysicalItems: boolean
  /** Human-readable summary for the Square payment note. */
  summary: string
}

const byId = new Map(products.map((p) => [p.id, p]))
const byName = new Map(products.map((p) => [p.name, p]))

/**
 * Id first, name second.
 *
 * The name fallback exists because the site and the API deploy separately — a
 * push to main ships the site, the backend goes out by hand — so for a while
 * one side is always older than the other. Matching on name keeps checkout
 * working in that window whichever half is newer; both paths still take the
 * price from the catalogue, so neither is a way in.
 */
function resolveProduct(item: IncomingItem) {
  if (item.id) {
    const byIdMatch = byId.get(item.id)
    if (byIdMatch) return byIdMatch
  }
  if (item.name) return byName.get(item.name)
  return undefined
}

/**
 * The chosen option, validated against the catalogue.
 *
 * Mirrors resolveCardVariant on the frontend: nothing to pick, one valid answer,
 * or a real choice the buyer has to have made. Accepts both the bare option
 * ("M") and the composed descriptor ("Size M") the older frontend sent.
 */
function resolveVariant(
  product: Product,
  requested: string | undefined,
): { ok: true; variant?: string } | { ok: false } {
  const options = product.variants?.[0]?.options ?? []
  if (options.length === 0) return { ok: true }
  if (options.length === 1) return { ok: true, variant: options[0] }

  const raw = (requested ?? "").trim()
  if (!raw) return { ok: false }
  const match = options.find((o) => o === raw || variantDescriptor(product, o) === raw)
  return match ? { ok: true, variant: match } : { ok: false }
}

export function resolveCart(
  items: IncomingItem[],
): { ok: true; cart: ResolvedCart } | { ok: false; error: string } {
  const lineItems: SquareLineItem[] = []
  const summaryParts: string[] = []
  let subtotalCents = 0
  let hasPhysicalItems = false

  for (const item of items) {
    const product = resolveProduct(item)
    if (!product) {
      // Reachable honestly: the cart lives in localStorage, so a product retired
      // since it was added still arrives here.
      const label = item.name || item.id || "An item"
      return { ok: false, error: `${label} is no longer available. Please remove it from your bag.` }
    }

    const variant = resolveVariant(product, item.variant)
    if (!variant.ok) {
      const label = product.variants?.[0]?.label?.toLowerCase() ?? "option"
      return { ok: false, error: `Please choose a ${label} for ${product.name}.` }
    }

    const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1))
    const unitCents = Math.round(product.price * 100)
    subtotalCents += unitCents * quantity
    if (!product.digital) hasPhysicalItems = true

    const descriptor = variantDescriptor(product, variant.variant)
    lineItems.push({
      name: product.name,
      quantity: String(quantity),
      ...(descriptor ? { variation_name: descriptor } : {}),
      base_price_money: { amount: unitCents, currency: "USD" },
    })
    summaryParts.push(`${product.name}${descriptor ? ` (${descriptor})` : ""} x${quantity}`)
  }

  return {
    ok: true,
    cart: {
      lineItems,
      subtotalCents,
      shippingCents: Math.round(shippingFeeFor(subtotalCents / 100, hasPhysicalItems) * 100),
      hasPhysicalItems,
      summary: summaryParts.join(", "),
    },
  }
}
