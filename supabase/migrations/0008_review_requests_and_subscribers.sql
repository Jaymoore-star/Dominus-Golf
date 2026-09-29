-- Review-request emails and the email list.
--
-- Run this once against the Dominus Golf Supabase project:
--   Dashboard → SQL Editor → New query → paste → Run.
-- or: node scripts/run-migration.mjs supabase/migrations/0008_review_requests_and_subscribers.sql
--
-- Both features fail safe without it: the review-request job finds no column to
-- claim and sends nothing, and the signup endpoint reports the list as
-- unavailable instead of accepting an address it cannot store.

-- ── Review requests ────────────────────────────────────────────────────────
--
-- The daily job in backend/reviewRequests.ts emails a buyer once their order
-- has had time to arrive, asking them to review what they bought. This is its
-- send-once marker, claimed with the same `is.null` PATCH as
-- confirmation_emailed_at (0003): the job and a manual run can overlap, and a
-- customer must never be asked twice for the same order.
--
-- There is no backfill here on purpose. Every past order starts null, so past
-- customers are asked too - but only once REVIEW_REQUESTS_ENABLED is set on the
-- Worker, which is the step that comes after checking the preview list.

alter table public.orders
  add column if not exists review_requested_at timestamptz;

comment on column public.orders.review_requested_at is
  'Set once the review-request email has been sent (or the order was judged not to need one), so it is never sent twice.';

-- ── Email list ─────────────────────────────────────────────────────────────
--
-- One row per address that signed up through the footer or the popup. Each gets
-- its own single-use 10% code, emailed on signup and checked by the checkout
-- endpoint. A shared code would be on a coupon site within the week.
--
-- Backend-only, like grant_emails: RLS on with no policies, so the anon key can
-- neither read the list nor mint codes. The Worker uses the service role key.

create table if not exists public.email_subscribers (
  id               uuid        primary key default gen_random_uuid(),
  -- Stored lower-cased, so one person is one row whatever case they typed, and
  -- a plain unique constraint (which PostgREST's on_conflict can target, unlike
  -- an index on lower(email)) is enough.
  email            text        not null unique check (email = lower(email)),
  -- 'footer', 'popup' - where the signup came from, to see which one earns its place.
  source           text,
  discount_code    text        not null unique,
  -- Set by the Square webhook once an order that used the code is paid.
  code_used_at     timestamptz,
  code_used_order  text,
  -- Set by the unsubscribe link. The row is kept so the code stays single-use
  -- and a re-signup cannot mint a second one.
  unsubscribed_at  timestamptz,
  created_at       timestamptz not null default now()
);

alter table public.email_subscribers enable row level security;

comment on table public.email_subscribers is
  'Email list and each subscriber''s single-use welcome code. Written only by the backend Worker.';
