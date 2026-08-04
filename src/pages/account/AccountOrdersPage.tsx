import { useCallback, useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Package, Loader2 } from 'lucide-react';
import { AccountLayout } from './AccountLayout';
import {
  fetchOrders,
  formatMoney,
  formatOrderDate,
  orderStatusLabel,
  type Order,
} from '../../lib/orders';

/**
 * Real order history.
 *
 * This page used to be a placeholder, because checkout handed off to a
 * Square-hosted payment link and nothing on our side recorded the result — the
 * only thing that came back was a browser redirect, which is not proof of payment.
 * Orders are now written by a signed Square webhook (backend/orders.ts), so this
 * reads them back.
 *
 * Three distinct empty states, because they mean different things to a customer:
 * the table is missing (migration not run), the customer genuinely has no orders,
 * and the fetch failed. The old placeholder deliberately avoided claiming "no
 * orders" since it could not tell them apart; now it can.
 */
export function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const result = await fetchOrders();
      setUnavailable(result.status === 'unavailable');
      setOrders(result.orders);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <AccountLayout
      active="orders"
      title="Orders"
      description="Your purchase history with Dominus Golf."
    >
      {loading ? (
        <div className="border border-border p-16 text-center">
          <Loader2 size={22} className="animate-spin mx-auto text-muted-foreground" />
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <article key={order.id} className="border border-border p-6 sm:p-8">
              <header className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-border">
                <div>
                  <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
                    {formatOrderDate(order.createdAt)}
                  </p>
                  <h3 className="font-serif text-lg font-bold text-foreground mt-1">
                    {formatMoney(order.totalCents, order.currency)}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="font-sans text-[10px] font-semibold tracking-widest uppercase text-accent">
                    {orderStatusLabel(order.status)}
                  </span>
                  {/* Square's id, not ours — it is what support and the Square
                      dashboard can both look up. */}
                  <p className="font-sans text-[10px] text-muted-foreground mt-1 break-all">
                    {order.squareOrderId}
                  </p>
                </div>
              </header>

              <ul className="mt-5 space-y-3">
                {order.items.map((item, i) => (
                  <li key={i} className="flex items-baseline justify-between gap-4">
                    <span className="font-sans text-sm text-foreground min-w-0">
                      {item.name}
                      {item.variation_name && (
                        <span className="text-muted-foreground"> · {item.variation_name}</span>
                      )}
                      <span className="text-muted-foreground"> × {item.quantity}</span>
                    </span>
                    {item.total_money?.amount !== undefined && (
                      <span className="font-sans text-sm text-foreground shrink-0">
                        {formatMoney(item.total_money.amount, order.currency)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      ) : (
        <div className="border border-border p-10 sm:p-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
            <Package size={26} className="text-muted-foreground" />
          </div>

          <h2 className="font-serif text-2xl font-bold text-foreground tracking-tight">
            {unavailable || failed ? 'Order history is on its way' : 'No orders yet'}
          </h2>

          <p className="mt-3 font-sans text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            {unavailable || failed
              ? // Same wording as before in this case, and for the same reason: we
                // cannot see the customer's orders, so claiming they have none
                // would be a lie to anyone who has actually bought something.
                "We can't load your order history right now. Your emailed receipt is your record in the meantime - and if you need anything at all, our team can look it up for you."
              : 'Once you place an order it will appear here, with everything you bought and what you paid.'}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/shop/$category"
              params={{ category: 'all' }}
              className="w-full sm:w-auto sm:px-10 btn-primary-black py-3.5 font-sans text-xs font-semibold tracking-widest uppercase transition-colors duration-200"
            >
              Continue Shopping
            </Link>
            <Link
              to="/about/contact"
              className="w-full sm:w-auto sm:px-10 btn-outline-dark py-3.5 font-sans text-xs font-semibold tracking-widest uppercase transition-colors duration-200"
            >
              Contact Support
            </Link>
          </div>
        </div>
      )}
    </AccountLayout>
  );
}
