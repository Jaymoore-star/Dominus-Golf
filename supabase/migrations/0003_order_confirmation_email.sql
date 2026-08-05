-- Track the branded order confirmation email.
--
-- Run this once against the Dominus Golf Supabase project:
--   Dashboard → SQL Editor → New query → paste → Run.
--
-- Square sends its own plain receipt from messaging.squareup.com, which we cannot
-- restyle. This column supports a second, branded confirmation sent from our own
-- backend via Resend, themed to match the site.
--
-- It exists for the same reason as referral_reported_at: Square retries on any
-- non-2xx and redelivers events even after a success — one real payment produced
-- a payment.created plus four payment.updated deliveries in testing. Without a
-- marker, that is five identical emails to the customer.

alter table public.orders
  add column if not exists confirmation_emailed_at timestamptz;

comment on column public.orders.confirmation_emailed_at is
  'Set once the branded confirmation email has been sent, so a webhook redelivery cannot email the customer twice.';
