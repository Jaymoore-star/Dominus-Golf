import { Hono } from "hono"
import { cors } from "hono/cors"

const app = new Hono()

app.use("*", cors())

app.get("/health", (c) => c.json({ ok: true }))

// POST /api/checkout
// Body: { items: [{ name, price, quantity, image? }], successUrl, cancelUrl }
// Returns: { url } — Stripe-hosted checkout session URL
app.post("/api/checkout", async (c) => {
  const stripeKey = (c.env as Record<string, string>).STRIPE_SECRET_KEY
  if (!stripeKey) {
    return c.json({ error: "Stripe not configured" }, 500)
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

  const lineItems = items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        ...(item.image ? { images: [item.image] } : {}),
      },
      unit_amount: Math.round(item.price * 100), // cents
    },
    quantity: item.quantity,
  }))

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const params = new URLSearchParams()
    params.append("mode", "payment")
    params.append("success_url", successUrl || "https://www.dominusgolf.com")
    params.append("cancel_url", cancelUrl || "https://www.dominusgolf.com")

    lineItems.forEach((item, i) => {
      params.append(`line_items[${i}][price_data][currency]`, item.price_data.currency)
      params.append(`line_items[${i}][price_data][product_data][name]`, item.price_data.product_data.name)
      if (item.price_data.product_data.images?.[0]) {
        params.append(`line_items[${i}][price_data][product_data][images][0]`, item.price_data.product_data.images[0])
      }
      params.append(`line_items[${i}][price_data][unit_amount]`, String(item.price_data.unit_amount))
      params.append(`line_items[${i}][quantity]`, String(item.quantity))
    })

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    const session = await response.json() as { url?: string; error?: { message: string } }

    if (!response.ok) {
      console.error("Stripe error:", session)
      return c.json({ error: session.error?.message || "Stripe error" }, 500)
    }

    return c.json({ url: session.url })
  } catch (err: unknown) {
    clearTimeout(timeout)
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("Checkout error:", message)
    return c.json({ error: message }, 500)
  }
})

export default app
