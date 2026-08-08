-- Development Grant applications.
--
-- Run this once against the Dominus Golf Supabase project:
--   Dashboard → SQL Editor → New query → paste → Run.
--
-- Why this exists: nothing stored an application. /api/grant/checkout packed the
-- applicant's answers into `pre_populated_data.note` on the Square payment link,
-- and Square discards that field — PrePopulatedData accepts only buyer_email,
-- buyer_phone_number and buyer_address. Verified against a real paid application:
-- the Square order came back with `note: undefined`. So every development plan,
-- training regimen and competitive vision ever submitted was thrown away at the
-- moment of submission, and the only trace of an applicant was a $15 payment with
-- an email address on it. There was no way to review applicants or pick a winner.
--
-- Rows are written when the payment link is created, not when payment completes,
-- so an application survives the applicant abandoning checkout or closing the tab
-- before the success page loads. `paid` is what separates a real entry from an
-- abandoned one — filter on it when judging.
--
-- Backend-only, like grant_emails: RLS is on with no policies, so nothing holding
-- the anon key can read applicants' answers. The Worker uses the service role key,
-- which bypasses RLS. Read them in Dashboard → Table Editor → grant_applications,
-- which also exports CSV.

create table if not exists public.grant_applications (
  id                 uuid        primary key default gen_random_uuid(),

  -- Links the application to its Square payment. Unique so a retry of the same
  -- checkout updates the row rather than duplicating the applicant.
  square_order_id    text        not null unique,

  applicant_name     text,
  applicant_email    text,

  -- Stored in full. The Square note was truncated to 200 characters per answer,
  -- which would have cut off most of what is actually being judged.
  development_plan   text,
  training_regimen   text,
  competitive_vision text,

  -- Set by /api/grant/complete once Square confirms the $15 fee was taken.
  paid               boolean     not null default false,
  paid_at            timestamptz,

  created_at         timestamptz not null default now()
);

create index if not exists grant_applications_paid_created_idx
  on public.grant_applications (paid, created_at desc);

alter table public.grant_applications enable row level security;

comment on table public.grant_applications is
  'Development Grant applications. Written by the backend Worker only. Filter on paid = true when judging.';
