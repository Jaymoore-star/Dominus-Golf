import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { ArrowLeft, Loader2, Package } from 'lucide-react';
import { AccountLayout } from './AccountLayout';
import {
  fetchOrderById,
  formatMoney,
  formatOrderDate,
  orderStatusLabel,
  orderStatusTone,
  orderSubtotalCents,
  type Order,
} from '../../lib/orders';

/**
 * A single order.
 *
 * The list used to be the whole feature — a customer could see that an order
 * existed but not open it, which is the one thing anyone wants from an order
 * history. Everything shown here is what Square reported back at the time of
 * payment, so a later catalogue price change cannot rewrite what someone paid.
 *
 * Shipping is derived rather than stored: Square's shipping fee arrives as a
 * service charge on the order total, so total minus the line items is what was
 * charged to deliver it.
 */
export function AccountOrderDetailPage() {
  const { orderId } = useParams({ from: '/account/orders/$orderId' });
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      setOrder(await fetchOrderById(orderId));
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void load();
  }, [load]);

  const subtotal = order ? orderSubtotalCents(order) : 0;
  const shipping = order ? Math.max(0, order.totalCents - subtotal) : 0;

  return (
    <AccountLayout active="orders" title="Order" description="The detail of a single order.">
      <Link
        to="/account/orders"
        className="inline-flex items-center gap-2 font-sans text-[11px] font-semibold tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={14} /> All orders
      </Link>

      {loading ? (
        <div className="mt-6 border border-border p-16 text-center">
          <Loader2 size={22} className="animate-spin mx-auto text-muted-foreground" />
        </div>
      ) : failed ? (
        <div className="mt-6 border border-border p-10 sm:p-16 text-center">
          <p className="font-sans text-sm text-muted-foreground">
            We couldn&apos;t load this order.
          </p>
          <button
            onClick={() => void load()}
            className="mt-5 border border-border px-6 py-3 font-sans text-xs font-semibold tracking-widest uppercase hover:bg-secondary transition-colors"
          >
            Try again
          </button>
        </div>
      ) : !order ? (
        <div className="mt-6 border border-border p-10 sm:p-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
            <Package size={26} className="text-muted-foreground" strokeWidth={1.5} />
          </div>
          <h3 className="font-serif text-xl text-foreground">Order not found</h3>
          <p className="mt-2 font-sans text-sm text-muted-foreground">
            This order doesn&apos;t exist, or it belongs to another account.
          </p>
        </div>
      ) : (
        <article className="mt-6 border border-border p-6 sm:p-8">
          <header className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-border">
            <div>
              <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
                {formatOrderDate(order.createdAt)}
              </p>
              <h3 className="font-serif text-2xl font-bold text-foreground mt-1">
                {formatMoney(order.totalCents, order.currency)}
              </h3>
            </div>
            <span
              className={`font-sans text-[10px] font-semibold tracking-widest uppercase ${
                orderStatusTone(order.status) === 'positive' ? 'text-accent' : 'text-muted-foreground'
              }`}
            >
              {orderStatusLabel(order.status)}
            </span>
          </header>

          <ul className="mt-6 space-y-3">
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

          <dl className="mt-6 pt-5 border-t border-border space-y-2 font-sans text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="text-foreground">{formatMoney(subtotal, order.currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="text-foreground">
                {shipping > 0 ? formatMoney(shipping, order.currency) : 'Free'}
              </dd>
            </div>
            <div className="flex justify-between pt-2 border-t border-border font-semibold">
              <dt className="text-foreground">Total</dt>
              <dd className="text-foreground">{formatMoney(order.totalCents, order.currency)}</dd>
            </div>
          </dl>

          <div className="mt-6 pt-5 border-t border-border">
            <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
              Order reference
            </p>
            {/* Square's id, not ours — support and the Square dashboard can both
                look this up. */}
            <p className="mt-1 font-sans text-xs text-muted-foreground break-all">
              {order.squareOrderId}
            </p>
          </div>

          <p className="mt-6 font-sans text-[11px] text-muted-foreground">
            Questions about this order? Email{' '}
            <a
              href="mailto:Customersupport@dominusgolf.com"
              className="text-accent hover:underline"
            >
              Customersupport@dominusgolf.com
            </a>
          </p>
        </article>
      )}
    </AccountLayout>
  );
}
