-- Index the orders still waiting for a review-request email.
--
-- Run this on its own (it must be the only statement in the query):
--   Dashboard → SQL Editor → New query → paste → Run.
-- or: node scripts/run-migration.mjs supabase/migrations/0010_orders_review_request_pending_idx.sql
--
-- What it speeds up: the daily review-request job (backend/reviewRequests.ts,
-- pendingOrders):
--   select ... from orders
--   where review_requested_at is null and status = 'COMPLETED' and email is not null
--   order by created_at asc limit 500
-- No existing index matches those filters, so today Postgres reads every order
-- ever placed and sorts them, once a day, to find the handful still pending.
--
-- Partial on purpose. The WHERE below is the job's own filter, so the index holds
-- only orders that are still waiting; an order leaves it the moment the job stamps
-- review_requested_at. It stays a few rows in size however many orders pile up,
-- which also keeps the cost to every order write small.
--
-- The predicate must keep matching the query in pendingOrders. If that filter
-- changes, Postgres silently stops using this index; change both together.
--
-- CONCURRENTLY builds the index without blocking the Square webhook from writing
-- orders. It cannot run inside a transaction, which is why this file holds a
-- single statement. If the build fails part-way it leaves an INVALID index behind
-- that IF NOT EXISTS would then skip; check with the last block of
-- supabase/diagnostics/query-performance.sql, drop it, and run this again.
--
-- To undo:
--   drop index concurrently if exists public.orders_review_request_pending_idx;

create index concurrently if not exists orders_review_request_pending_idx
  on public.orders (created_at)
  where review_requested_at is null and status = 'COMPLETED' and email is not null;
