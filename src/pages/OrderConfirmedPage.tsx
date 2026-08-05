import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { CheckCircle2, Package, Mail } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useCart } from '../store/cartStore';
import { fetchOrderBySquareId, orderSubtotalCents } from '../lib/orders';
import { trackPurchase } from '../lib/analytics';

/**
 * Where Square sends the buyer after a completed checkout.
 *
 * Checkout used to redirect to `/?checkout=success`, and nothing anywhere read
 * that parameter — so paying dropped the customer on the home page with no
 * acknowledgement that anything had happened.
 *
 * This page is deliberately not a receipt. The order is recorded by a signed
 * Square webhook (backend/orders.ts) which may not have landed by the time the
 * browser gets here, so claiming details we haven't confirmed would risk showing
 * a customer something wrong. It confirms the payment, names where the detail
 * will appear, and gets out of the way.
 */
export function OrderConfirmedPage() {
  const { clearCart } = useCart();
  const [reference, setReference] = useState<string | null>(null);
  const clearedRef = useRef(false);

  useEffect(() => {
    // StrictMode invokes effects twice in development.
    if (clearedRef.current) return;
    clearedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId') || params.get('order_id');
    const transactionId = params.get('transactionId') || params.get('payment_id');
    const ref = orderId || transactionId;
    setReference(ref);

    /* Only empty the bag when Square actually sent them here. Someone who lands
       on this URL directly — a bookmark, a shared link — has not bought anything,
       and silently binning their cart would be worse than showing a bare page. */
    if (ref) clearCart();

    /* Report the conversion, once. Keyed in sessionStorage so a refresh cannot
       double-count revenue, the same guard the grant success page uses.
       Deliberately reads the figures back from the order row rather than from
       the cart: Buy Now never touches the cart, and we have just emptied it. */
    if (!orderId) return;
    const countedKey = `purchase-tracked-${orderId}`;
    if (sessionStorage.getItem(countedKey)) return;

    void (async () => {
      try {
        const order = await fetchOrderBySquareId(orderId);
        // No row yet, or a guest whose RLS scope excludes it. A missing analytics
        // event is much cheaper than a wrong one, so send nothing.
        if (!order) return;
        sessionStorage.setItem(countedKey, '1');
        const subtotal = orderSubtotalCents(order);
        trackPurchase({
          transactionId: order.squareOrderId,
          valueCents: order.totalCents,
          currency: order.currency,
          shippingCents: Math.max(0, order.totalCents - subtotal),
          items: order.items.map((i) => ({
            name: i.name,
            quantity: Number(i.quantity) || 1,
            priceCents: i.base_price_money?.amount ?? i.total_money?.amount ?? 0,
          })),
        });
      } catch {
        // Analytics must never break the page a paying customer just landed on.
      }
    })();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="py-20 sm:py-28 lg:py-32 px-5 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <div className="flex justify-center">
            <CheckCircle2 className="w-14 h-14 text-accent" strokeWidth={1.5} />
          </div>

          <h1 className="mt-6 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Your Order Is Placed
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed font-sans">
            Thank you for your order. Your payment has been received and a confirmation email
            with your receipt is on its way to your inbox.
          </p>

          {reference && (
            <p className="mt-6 font-sans text-[11px] tracking-widest uppercase text-muted-foreground">
              Order reference
              <span className="block mt-1 normal-case tracking-normal text-xs text-foreground break-all">
                {reference}
              </span>
            </p>
          )}

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/account/orders"
              className="inline-flex items-center justify-center gap-2 btn-primary-black px-8 py-4 text-sm font-sans font-semibold tracking-wider uppercase transition-all duration-200 active:scale-[0.98]"
            >
              <Package className="w-4 h-4" />
              View Your Orders
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-8 py-4 text-sm font-sans font-semibold tracking-wider uppercase hover:bg-secondary transition-colors"
            >
              Back to Home
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-sans">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              No email after a few minutes? Check your spam folder, or contact{' '}
              <a
                href="mailto:Customersupport@dominusgolf.com"
                className="text-accent hover:underline"
              >
                Customersupport@dominusgolf.com
              </a>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
