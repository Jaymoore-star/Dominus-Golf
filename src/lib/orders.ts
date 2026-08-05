import { supabase } from './supabase';

/**
 * Order history for the signed-in customer.
 *
 * Rows are written only by the Square webhook (backend/orders.ts) after it has
 * verified Square's signature, so anything here represents a payment Square
 * actually took. The table has no insert or update policy — reads are all the
 * client can do, and RLS limits those to the customer's own orders.
 */

/** As Square reported the line item back to us, not re-derived from the catalogue. */
export type OrderItem = {
  name: string;
  /** Chosen size or colour, e.g. "Size M". */
  variation_name?: string;
  quantity: string;
  base_price_money?: { amount?: number; currency?: string };
  total_money?: { amount?: number; currency?: string };
};

export type Order = {
  id: string;
  squareOrderId: string;
  status: string;
  totalCents: number;
  currency: string;
  items: OrderItem[];
  createdAt: string;
};

type OrderRow = {
  id: string;
  square_order_id: string;
  status: string;
  total_cents: number;
  currency: string;
  items: OrderItem[] | null;
  created_at: string;
};

const SELECT = 'id, square_order_id, status, total_cents, currency, items, created_at';

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    squareOrderId: row.square_order_id,
    status: row.status,
    totalCents: row.total_cents,
    currency: row.currency,
    items: row.items ?? [],
    createdAt: row.created_at,
  };
}

/** PostgREST reports an undefined table as 42P01 — i.e. the migration hasn't run. */
function isMissingTable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return error.code === '42P01' || /\borders\b/i.test(error.message ?? '');
}

export type OrdersResult =
  | { status: 'ok'; orders: Order[] }
  | { status: 'unavailable'; orders: [] };

export async function fetchOrders(): Promise<OrdersResult> {
  const { data, error } = await supabase
    .from('orders')
    .select(SELECT)
    .order('created_at', { ascending: false });

  if (error) {
    // Treated as "not set up yet" rather than an error, so the account page can
    // explain itself instead of showing a failure to a customer.
    if (isMissingTable(error)) return { status: 'unavailable', orders: [] };
    throw new Error(error.message);
  }

  return { status: 'ok', orders: (data as OrderRow[]).map(toOrder) };
}

/**
 * One order, for the detail page.
 *
 * RLS scopes this to the signed-in customer, so an id belonging to someone else
 * comes back as not-found rather than forbidden — there is nothing to leak.
 */
export async function fetchOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase.from('orders').select(SELECT).eq('id', id).maybeSingle();

  if (error) {
    if (isMissingTable(error)) return null;
    throw new Error(error.message);
  }
  return data ? toOrder(data as OrderRow) : null;
}

/**
 * The order matching a Square order id, once the webhook has written it.
 *
 * The buyer's browser and Square's webhook race after payment, and the browser
 * usually wins — so this retries briefly rather than concluding the order does
 * not exist. Returns null if it never lands, which callers should treat as
 * "unknown", not "failed": the payment is real either way.
 */
export async function fetchOrderBySquareId(
  squareOrderId: string,
  { attempts = 4, delayMs = 1500 } = {},
): Promise<Order | null> {
  for (let i = 0; i < attempts; i++) {
    const { data, error } = await supabase
      .from('orders')
      .select(SELECT)
      .eq('square_order_id', squareOrderId)
      .maybeSingle();

    if (!error && data) return toOrder(data as OrderRow);
    if (error && isMissingTable(error)) return null;
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs));
  }
  return null;
}

export function formatMoney(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(cents / 100);
}

export function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Square's payment statuses, in the customer's language.
 *
 * A row only exists once Square has taken a payment, so COMPLETED is the normal
 * case; the others are the states a card can genuinely end up in.
 */
export function orderStatusLabel(status: string): string {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return 'Paid';
    case 'APPROVED':
    case 'PENDING':
      return 'Processing';
    case 'REFUNDED':
      return 'Refunded';
    case 'PARTIALLY_REFUNDED':
      return 'Partially refunded';
    case 'CANCELED':
    case 'CANCELLED':
      return 'Cancelled';
    case 'FAILED':
      return 'Payment failed';
    default:
      return status;
  }
}

/**
 * Refunded orders are not a success state, so they must not wear the gold the
 * rest of the account area uses for "good news".
 */
export function orderStatusTone(status: string): 'positive' | 'muted' {
  const s = status.toUpperCase();
  return s === 'REFUNDED' || s === 'PARTIALLY_REFUNDED' || s === 'CANCELED' || s === 'CANCELLED' || s === 'FAILED'
    ? 'muted'
    : 'positive';
}

/** Goods total, before shipping — Square reports each line's own total. */
export function orderSubtotalCents(order: Order): number {
  return order.items.reduce((sum, i) => sum + (i.total_money?.amount ?? 0), 0);
}
