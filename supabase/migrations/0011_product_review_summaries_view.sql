-- Per-product rating totals, for the star ratings on product cards.
--
-- Run this once against the Dominus Golf Supabase project:
--   Dashboard → SQL Editor → New query → paste → Run.
-- or: node scripts/run-migration.mjs supabase/migrations/0011_product_review_summaries_view.sql
--
-- What it replaces: fetchReviewSummaries (src/lib/reviews.ts) downloaded
-- `product_id, rating` for EVERY review to every visitor and added them up in
-- the browser. pg_stat_statements put it as the most frequent query on the
-- database (10 Oct 2026), and the response grew with each review ever written.
-- This returns one row per reviewed product however many reviews there are.
--
-- Sum and count rather than an average: the client still divides and rounds
-- (to one decimal, Math.round), so the stars show exactly what they did before.
--
-- The client falls back to the old full-table read while this view does not
-- exist, so it is safe to deploy the frontend before or after running this.
--
-- `security_invoker = on`, as in 0007: the view runs as the caller, so
-- product_reviews' RLS still applies. Its select policy is public, which is
-- what lets signed-out visitors read the totals.
--
-- To undo:
--   drop view if exists public.product_review_summaries;

create or replace view public.product_review_summaries
with (security_invoker = on) as
select
  product_id,
  sum(rating)::int as rating_sum,
  count(*)::int    as review_count
from public.product_reviews
group by product_id;

grant select on public.product_review_summaries to anon, authenticated;

comment on view public.product_review_summaries is
  'Rating sum and count per product, for the star ratings on product cards.';
