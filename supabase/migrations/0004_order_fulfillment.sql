-- Delivery tracking for the order timeline.
--
-- `status` on the orders table is the *payment* — COMPLETED, REFUNDED and so on.
-- It says nothing about whether the parcel has left the building, so the account
-- page could tell a customer they had paid and nothing else.
--
-- These columns mirror the shipment fulfilment Square already tracks when an
-- order is packed and shipped from the Square Dashboard. They are written by the
-- order.updated / order.fulfillment.updated webhook in backend/orders.ts, never
-- by the client — the orders table has no insert or update policy at all.
--
-- Run this in the Supabase SQL editor.

alter table public.orders
  -- Square's fulfilment state: PROPOSED, RESERVED, PREPARED, COMPLETED, CANCELED.
  -- Null means Square has no fulfilment for the order, which is the normal and
  -- permanent state of a download-only purchase.
  add column if not exists fulfillment_state text,
  -- Carrier name as Square records it, e.g. "UPS". Free text on Square's side.
  add column if not exists carrier text,
  add column if not exists tracking_number text,
  -- Square supplies the carrier's own tracking page. Nothing here polls the
  -- carrier, so "out for delivery" and "delivered" live behind this link rather
  -- than in our timeline.
  add column if not exists tracking_url text,
  -- When the fulfilment first reached COMPLETED, i.e. when it actually shipped.
  add column if not exists shipped_at timestamptz;

comment on column public.orders.fulfillment_state is
  'Square shipment fulfilment state. Null for digital-only orders, which are delivered by email.';
