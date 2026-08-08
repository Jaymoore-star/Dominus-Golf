-- One row per grant application whose eBook has been emailed.
--
-- Run this once against the Dominus Golf Supabase project:
--   Dashboard → SQL Editor → New query → paste → Run.
--
-- /api/grant/complete is unauthenticated by necessity: the buyer arrives back from
-- a Square-hosted checkout with nothing but an order id in the URL, so there is no
-- session to check. That left the endpoint replayable — the same order id could be
-- posted over and over, sending the branded eBook email again each time, on our
-- Resend quota. The success page has a sessionStorage guard, but that is a client
-- honour system and clears with the tab.
--
-- The primary key is what makes the guard work: the insert is the claim, so two
-- concurrent calls cannot both win it. This is the same reasoning as
-- orders.confirmation_emailed_at in 0003, kept in its own table because a grant is
-- a quick_pay with no cart and does not belong in order history.
--
-- Backend-only. There are no RLS policies at all, so with RLS enabled nothing
-- holding the anon key can read or write it; the Worker uses the service role key,
-- which bypasses RLS.

create table if not exists public.grant_emails (
  square_order_id text        primary key,
  -- Recorded for support ("did their eBook go, and where to?"), not read by the code.
  email           text,
  sent_at         timestamptz not null default now()
);

alter table public.grant_emails enable row level security;

comment on table public.grant_emails is
  'Send-once marker for the grant application eBook email. Written only by the backend Worker.';
