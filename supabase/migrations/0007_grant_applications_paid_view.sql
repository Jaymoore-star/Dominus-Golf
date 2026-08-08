-- Paid grant applications only.
--
-- Run this once against the Dominus Golf Supabase project:
--   Dashboard → SQL Editor → New query → paste → Run.
--
-- grant_applications holds a row from the moment the payment link is created, so
-- the applicant's answers survive them closing the tab before the success page
-- loads. The cost is that abandoned checkouts sit in the same table as real
-- entries, and there are usually far more of those. This is the judging list:
-- open Table Editor → grant_applications_paid instead, and the CSV export gives
-- you only people who actually paid the $15.
--
-- `security_invoker = on` is load-bearing, not boilerplate. A Postgres view runs
-- as its OWNER by default, so a view over an RLS-protected table hands out
-- everything the owner can see — and since PostgREST publishes every view in the
-- public schema, this one would have let anybody holding the anon key read every
-- applicant's name, email and essay answers. With security_invoker the view is
-- evaluated as the caller, so grant_applications' RLS still applies: no policies
-- exist on it, so only the Worker's service-role key gets rows.

create or replace view public.grant_applications_paid
with (security_invoker = on) as
select
  id,
  square_order_id,
  applicant_name,
  applicant_email,
  development_plan,
  training_regimen,
  competitive_vision,
  paid_at,
  created_at
from public.grant_applications
where paid
order by created_at desc;

comment on view public.grant_applications_paid is
  'Grant applications whose $15 fee Square confirmed. The list to judge from.';
