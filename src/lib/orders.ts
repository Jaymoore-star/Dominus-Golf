import { supabase } from './supabase';
import { products } from '../data/products';

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
  /** The payment: COMPLETED, REFUNDED, and so on. Not the delivery. */
  status: string;
  totalCents: number;
  currency: string;
  items: OrderItem[];
  createdAt: string;
  /** Square's shipment state. Null on a download-only order, which never ships. */
  fulfillmentState: string | null;
  carrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  shippedAt: string | null;
};

type OrderRow = {
  id: string;
  square_order_id: string;
  status: string;
  total_cents: number;
  currency: string;
  items: OrderItem[] | null;
  created_at: string;
  fulfillment_state?: string | null;
  carrier?: string | null;
  tracking_number?: string | null;
  tracking_url?: string | null;
  shipped_at?: string | null;
};

const SELECT_BASE = 'id, square_order_id, status, total_cents, currency, items, created_at';
const SELECT_FULL =
  `${SELECT_BASE}, fulfillment_state, carrier, tracking_number, tracking_url, shipped_at`;

/**
 * Latches to the base columns once the database turns out not to have the
 * fulfilment ones.
 *
 * The site and the migrations ship separately, so between deploying this and
 * running 0004 every select would name columns that do not exist — and PostgREST
 * fails the whole query on an unknown column, which would take the order history
 * down completely rather than just hiding the timeline. Retried once, then
 * remembered, so the fallback costs one wasted round trip per page load at most.
 */
let columns = SELECT_FULL;

/**
 * supabase-js infers the row shape from the select string, which only works when
 * that string is a literal. `columns` has to be a variable so it can fall back,
 * so the shape is asserted here instead — in one place, rather than as a cast at
 * every call site.
 */
function asRows(data: unknown): OrderRow[] {
  return (data ?? []) as OrderRow[];
}
function asRow(data: unknown): OrderRow | null {
  return (data as OrderRow | null) ?? null;
}

/** PostgREST reports an undefined column as 42703. */
function isMissingColumn(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return error.code === '42703' || /column .* does not exist/i.test(error.message ?? '');
}

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    squareOrderId: row.square_order_id,
    status: row.status,
    totalCents: row.total_cents,
    currency: row.currency,
    items: row.items ?? [],
    createdAt: row.created_at,
    // Optional rather than required: the columns are absent, not null, until
    // 0004_order_fulfillment.sql has been run.
    fulfillmentState: row.fulfillment_state ?? null,
    carrier: row.carrier ?? null,
    trackingNumber: row.tracking_number ?? null,
    trackingUrl: row.tracking_url ?? null,
    shippedAt: row.shipped_at ?? null,
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
  const run = () =>
    supabase.from('orders').select(columns).order('created_at', { ascending: false });

  let { data, error } = await run();
  if (error && isMissingColumn(error)) {
    columns = SELECT_BASE;
    ({ data, error } = await run());
  }

  if (error) {
    // Treated as "not set up yet" rather than an error, so the account page can
    // explain itself instead of showing a failure to a customer.
    if (isMissingTable(error)) return { status: 'unavailable', orders: [] };
    throw new Error(error.message);
  }

  return { status: 'ok', orders: asRows(data).map(toOrder) };
}

/**
 * One order, for the detail page.
 *
 * RLS scopes this to the signed-in customer, so an id belonging to someone else
 * comes back as not-found rather than forbidden — there is nothing to leak.
 */
export async function fetchOrderById(id: string): Promise<Order | null> {
  const run = () => supabase.from('orders').select(columns).eq('id', id).maybeSingle();

  let { data, error } = await run();
  if (error && isMissingColumn(error)) {
    columns = SELECT_BASE;
    ({ data, error } = await run());
  }

  if (error) {
    if (isMissingTable(error)) return null;
    throw new Error(error.message);
  }
  const row = asRow(data);
  return row ? toOrder(row) : null;
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
      .select(columns)
      .eq('square_order_id', squareOrderId)
      .maybeSingle();

    if (!error && data) return toOrder(asRow(data)!);
    if (error && isMissingColumn(error)) {
      columns = SELECT_BASE;
      continue; // Retry immediately against the columns that do exist.
    }
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

/**
 * What was in the order, in one line for the list view.
 *
 * Names the first item and counts the rest, rather than listing everything: the
 * list is an index, and the detail page is where the full breakdown lives.
 */
export function orderItemsSummary(order: Order): string {
  if (order.items.length === 0) return 'No items recorded';
  const [first, ...rest] = order.items;
  const units = order.items.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0);
  if (rest.length === 0) {
    return units > 1 ? `${first.name} × ${units}` : first.name;
  }
  return `${first.name} + ${rest.length} more`;
}

/**
 * A product image for the order row, matched back through the catalogue.
 *
 * Orders store what Square reported — names and money, no images — so the
 * picture is looked up rather than stored. Deliberately not stored: a product
 * whose photography changes should show its current image in the history, and
 * the price is the only thing that must stay frozen at what was charged.
 *
 * Null for a product since renamed or retired, which the row renders as an icon.
 */
const imageByProductName = new Map(products.map((p) => [p.name, p.image]));

export function orderThumbnail(order: Order): string | null {
  for (const item of order.items) {
    const image = imageByProductName.get(item.name);
    if (image) return image;
  }
  return null;
}

/**
 * Where the order is, in three or four words for the list row.
 *
 * The payment status already has a chip of its own, so this is the delivery
 * half only — between them the row answers "did it go through" and "where is
 * it" without repeating the detail page.
 */
export function orderDeliverySummary(order: Order): string {
  // Square only creates a fulfilment once it has collected an address, which it
  // never does for a download. No fulfilment therefore means nothing to post.
  if (order.fulfillmentState === null) return 'Delivered by email';

  switch (order.fulfillmentState.toUpperCase()) {
    case 'COMPLETED':
      return order.carrier ? `Shipped · ${order.carrier}` : 'Shipped';
    case 'PREPARED':
    case 'RESERVED':
      return 'Preparing for dispatch';
    case 'CANCELED':
    case 'CANCELLED':
      return 'Shipment cancelled';
    default:
      return 'Order placed';
  }
}

export type TimelineStep = {
  label: string;
  /** Reached. Rendered filled, with its date. */
  done: boolean;
  /** The furthest step reached — the one worth drawing attention to. */
  current: boolean;
  at: string | null;
  detail?: string;
};

/**
 * The order's progress, as two tracks the customer actually cares about: what
 * happened to their money, and where their parcel is.
 *
 * The delivery track stops at "Shipped" on purpose. Square's shipment fulfilment
 * only reaches COMPLETED — meaning handed to the carrier — and knows nothing
 * after that. "Out for delivery" and "Delivered" are carrier events that would
 * need a tracking provider, so rather than invent them the timeline ends with a
 * link to the carrier's own tracking page.
 *
 * A download-only order has no fulfilment at all, because Square is never asked
 * for an address. That absence is the signal, and it gets an email-delivery
 * track instead of a shipping one — it is not "awaiting shipment" forever.
 */
export function orderTimeline(order: Order): {
  payment: TimelineStep[];
  delivery: TimelineStep[];
  isDigitalOnly: boolean;
} {
  const status = order.status.toUpperCase();
  const refunded = status === 'REFUNDED' || status === 'PARTIALLY_REFUNDED';
  const failed = status === 'FAILED' || status === 'CANCELED' || status === 'CANCELLED';

  const payment: TimelineStep[] = [
    { label: 'Order placed', done: true, current: false, at: order.createdAt },
    {
      label: failed ? orderStatusLabel(status) : 'Payment received',
      done: !failed,
      current: !refunded && !failed,
      at: failed ? null : order.createdAt,
    },
  ];
  if (refunded) {
    payment.push({
      label: orderStatusLabel(status),
      done: true,
      current: true,
      at: null,
      detail: 'The refund can take a few days to appear on your statement.',
    });
  }

  /* No fulfilment means nothing is being posted. Square only creates one when it
     has collected an address, which it does not do for a download-only order. */
  const isDigitalOnly = order.fulfillmentState === null;
  if (isDigitalOnly) {
    return {
      payment,
      isDigitalOnly,
      delivery: [
        {
          label: 'Delivered by email',
          done: true,
          current: true,
          at: order.createdAt,
          detail: 'Your download link is in your confirmation email.',
        },
      ],
    };
  }

  const state = (order.fulfillmentState ?? '').toUpperCase();
  const shipped = state === 'COMPLETED';
  // PREPARED is Square's "packed and waiting for the carrier".
  const preparing = shipped || state === 'PREPARED' || state === 'RESERVED';
  const cancelled = state === 'CANCELED' || state === 'CANCELLED';

  if (cancelled) {
    return {
      payment,
      isDigitalOnly,
      delivery: [{ label: 'Shipment cancelled', done: true, current: true, at: null }],
    };
  }

  return {
    payment,
    isDigitalOnly,
    delivery: [
      { label: 'Order placed', done: true, current: !preparing, at: order.createdAt },
      { label: 'Preparing for dispatch', done: preparing, current: preparing && !shipped, at: null },
      {
        label: 'Shipped',
        done: shipped,
        current: shipped,
        at: order.shippedAt,
        detail: shipped
          ? [order.carrier, order.trackingNumber].filter(Boolean).join(' · ') || undefined
          : undefined,
      },
    ],
  };
}
