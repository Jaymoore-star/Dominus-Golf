import { useCallback, useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Package, Loader2, ChevronRight } from 'lucide-react';
import { AccountLayout } from './AccountLayout';
import {
  fetchOrders,
  formatMoney,
  formatOrderDate,
  orderDeliverySummary,
  orderItemsSummary,
  orderStatusLabel,
  orderStatusTone,
  orderThumbnail,
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
        /* One row per order, not a full receipt each.

           Every order used to reprint its whole line-item breakdown and the raw
           Square id, so three orders filled the screen and the list was no faster
           to scan than opening them one by one. Now that each order has a detail
           page, the list only has to answer "which order is this" — when, how
           much, what state, and roughly what was in it. */
        <div className="border border-border">
          <ul className="divide-y divide-border">
            {orders.map((order) => {
              const thumbnail = orderThumbnail(order);
              const positive = orderStatusTone(order.status) === 'positive';
              /* Only the first product is pictured, so an order of several would
                 otherwise read as an order of one. The badge says how many more
                 are behind it. */
              const extraItems = order.items.length - 1;
              return (
                <li key={order.id}>
                  <Link
                    to="/account/orders/$orderId"
                    params={{ orderId: order.id }}
                    className="group flex items-center gap-4 p-4 sm:px-6 hover:bg-secondary/40 transition-colors"
                  >
                    <div className="relative shrink-0">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt=""
                          loading="lazy"
                          className="w-14 h-14 object-cover bg-muted"
                        />
                      ) : (
                        // Product renamed or retired since the order was placed.
                        <div className="w-14 h-14 bg-muted flex items-center justify-center">
                          <Package size={18} className="text-muted-foreground" strokeWidth={1.5} />
                        </div>
                      )}
                      {extraItems > 0 && (
                        /* Count only — the item line already names the first
                           product, so repeating names here would be noise. */
                        <span className="absolute -bottom-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center bg-foreground text-background font-sans text-[10px] font-semibold leading-none">
                          +{extraItems}
                        </span>
                      )}
                    </div>

                    {/* min-w-0 or truncate does the opposite of truncating in a flex row. */}
                    <div className="min-w-0 flex-1">
                      <p className="font-sans text-sm text-foreground truncate">
                        {orderItemsSummary(order)}
                      </p>
                      <p className="mt-1 font-sans text-xs text-muted-foreground truncate">
                        {formatOrderDate(order.createdAt)} · {orderDeliverySummary(order)}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-serif text-base font-bold text-foreground leading-none">
                        {formatMoney(order.totalCents, order.currency)}
                      </p>
                      {/* A refund is not good news, so it must not wear the gold. */}
                      <span
                        className={`inline-block mt-2 px-2 py-0.5 border font-sans text-[9px] font-semibold tracking-widest uppercase ${
                          positive
                            ? 'border-accent/40 text-accent'
                            : 'border-border text-muted-foreground'
                        }`}
                      >
                        {orderStatusLabel(order.status)}
                      </span>
                    </div>

                    <ChevronRight
                      size={16}
                      className="shrink-0 text-muted-foreground group-hover:text-accent transition-colors"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
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
