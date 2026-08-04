-- Customer orders.
--
-- Run this once against the Dominus Golf Supabase project:
--   Dashboard → SQL Editor → New query → paste → Run.
--
-- Why this table exists: checkout hands off to a Square-hosted page, and the only
-- thing that came back was a browser redirect to /?checkout=success. A redirect is
-- not proof of payment — anyone can visit that URL — so nothing on our side ever
-- knew an order had happened. That blocked two features at once: the Orders page
-- in the account area, and affiliate commissions, which need a confirmed sale to
-- attribute. Rows here are written only by the Square webhook, which verifies a
-- signature first, so a row existing means Square really took the money.

create table if not exists public.orders (
  id                uuid        primary key default gen_random_uuid(),

  -- Square's ids. square_order_id is unique so a webhook redelivery updates the
  -- existing row instead of creating a duplicate — Square retries on any non-2xx,
  -- and can deliver the same event more than once even on success.
  square_order_id   text        not null unique,
  square_payment_id text,

  -- Null for a guest checkout. The webhook fills it from the order metadata we set
  -- when creating the payment link, so a signed-in buyer's order reaches their
  -- account even though Square itself knows nothing about our user ids.
  user_id           uuid        references auth.users (id) on delete set null,

  -- Always captured, from Square's buyer details. This is how a guest order can
  -- still be found later, and how support matches an order to a person.
  email             text,

  status            text        not null default 'PENDING',
  total_cents       integer     not null check (total_cents >= 0),
  currency          text        not null default 'USD',

  -- Line items as Square reported them back, so what we show a customer is what
  -- they were actually charged rather than a re-derivation from the local catalogue
  -- (prices and names change; a past order must not).
  items             jsonb       not null default '[]'::jsonb,

  -- GoAffPro referral code, when the visit came through an affiliate link.
  referral_code     text,
  -- Set once the sale has been reported to GoAffPro, so a webhook retry cannot
  -- pay a commission twice.
  referral_reported_at timestamptz,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists orders_user_created_idx
  on public.orders (user_id, created_at desc);

create index if not exists orders_email_idx
  on public.orders (lower(email));

alter table public.orders enable row level security;

-- A customer sees their own orders and nothing else. There is deliberately no
-- insert, update or delete policy: writes come from the webhook using the service
-- role key, which bypasses RLS. Nothing client-side can create or alter an order.
drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own"
  on public.orders for select to authenticated
  using (auth.uid() = user_id);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();
