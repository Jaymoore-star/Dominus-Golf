-- Query performance check. READ-ONLY: nothing here changes data or schema.
--
-- Dashboard → SQL Editor → paste this file. The editor shows only the result of
-- the last statement it ran, so select one numbered block at a time and Run it.
--
-- Typical use, around an index migration:
--   1. Run blocks 1-4 and save the output: that is "before".
--   2. Run the migration (one CREATE INDEX CONCURRENTLY per run).
--   3. Run block 5 to confirm the new index built cleanly, then block 4 again:
--      that is "after".
--
-- The EXPLAIN ANALYZE in block 4 runs only SELECTs, mirroring what the app sends
-- through PostgREST. It runs as the postgres role, which bypasses RLS, so where a
-- policy would add `user_id = auth.uid()` the query spells that filter out.


-- ── 1. Table sizes and how they are being read ─────────────────────────────
-- seq_scan = full-table reads since stats were last reset; idx_scan = index reads.

select s.relname                                      as table_name,
       s.n_live_tup                                   as rows,
       pg_size_pretty(pg_total_relation_size(s.relid)) as total_size,
       pg_size_pretty(pg_indexes_size(s.relid))        as index_size,
       s.seq_scan,
       s.seq_tup_read                                 as rows_read_by_seq_scans,
       s.idx_scan,
       s.n_tup_ins + s.n_tup_upd + s.n_tup_del        as writes
from pg_stat_user_tables s
where s.schemaname = 'public'
order by pg_total_relation_size(s.relid) desc;


-- ── 2a. Most frequent queries (pg_stat_statements) ─────────────────────────
-- Supabase enables pg_stat_statements by default. If this errors with
-- "relation does not exist", enable it under Database → Extensions.

select calls,
       round(mean_exec_time::numeric, 2)  as mean_ms,
       round(max_exec_time::numeric, 2)   as max_ms,
       round(total_exec_time::numeric, 1) as total_ms,
       rows,
       left(regexp_replace(query, '\s+', ' ', 'g'), 400) as query
from pg_stat_statements
where query ~* '\m(orders|product_reviews|email_subscribers|grant_applications|grant_emails)\M'
order by calls desc
limit 25;


-- ── 2b. Slowest queries on average ─────────────────────────────────────────

select calls,
       round(mean_exec_time::numeric, 2)  as mean_ms,
       round(max_exec_time::numeric, 2)   as max_ms,
       round(total_exec_time::numeric, 1) as total_ms,
       rows,
       left(regexp_replace(query, '\s+', ' ', 'g'), 400) as query
from pg_stat_statements
where query ~* '\m(orders|product_reviews|email_subscribers|grant_applications|grant_emails)\M'
order by mean_exec_time desc
limit 25;


-- ── 3. Index usage: which indexes are never read ───────────────────────────
-- times_used counts since stats_since. 0 on a non-unique, non-primary index means
-- it costs every write and has served no read in that window. Unique and primary
-- indexes enforce constraints, so they earn their keep even at 0.

select s.relname                                   as table_name,
       s.indexrelname                              as index_name,
       s.idx_scan                                  as times_used,
       pg_size_pretty(pg_relation_size(s.indexrelid)) as size,
       i.indisunique                               as is_unique,
       i.indisprimary                              as is_primary,
       (select stats_reset from pg_stat_database where datname = current_database())
                                                   as stats_since
from pg_stat_user_indexes s
join pg_index i on i.indexrelid = s.indexrelid
where s.schemaname = 'public'
order by s.idx_scan, pg_relation_size(s.indexrelid) desc;


-- ── 4. EXPLAIN ANALYZE of every read query the app runs ────────────────────
-- Select from here down to the final `select * from pg_temp.query_plans(...)`
-- and run it as one piece. The function lives in pg_temp, so it disappears with
-- the session and leaves nothing behind.
--
-- Look for "Seq Scan on <table>": that is a whole-table read. "Index Scan" or
-- "Index Only Scan using <index>" is a direct lookup. "Execution Time" at the
-- bottom of each plan is the time.
--
-- On a small table Postgres reads the whole thing even when an index exists,
-- because a few pages are cheaper to read than an index. So with only a handful
-- of rows, Seq Scan is the right plan, not a problem. To see whether an index
-- WOULD be used once the table is big, call query_plans(true) instead: it
-- discourages full scans for this one run. Its times are not representative;
-- read only the scan types from it.

create or replace function pg_temp.query_plans(force_index boolean default false)
returns table (query_name text, plan_line text)
language plpgsql
as $$
declare
  v_product text;
  v_user    uuid;
  v_order   uuid;
  v_square  text;
  v_email   text;
  v_code    text;
  v_buyers  text;
  q record;
  r record;
begin
  if force_index then
    perform set_config('enable_seqscan', 'off', true);
  end if;

  -- Real sample values, so each plan is for a lookup that finds something.
  select product_id into v_product
    from public.product_reviews group by product_id order by count(*) desc limit 1;
  select user_id into v_user
    from public.orders where user_id is not null group by user_id order by count(*) desc limit 1;
  select id into v_order
    from public.orders where user_id = v_user order by created_at desc limit 1;
  select square_order_id into v_square
    from public.orders order by created_at desc limit 1;
  select email, discount_code into v_email, v_code
    from public.email_subscribers order by created_at desc limit 1;
  select coalesce(string_agg(quote_literal(user_id::text), ','), 'null') into v_buyers
    from (select distinct user_id from public.orders where user_id is not null limit 500) b;

  for q in
    select * from (values
      (1, 'Product page: reviews for one product (src/lib/reviews.ts fetchProductReviews)',
          format('select * from public.product_reviews where product_id = %L order by created_at desc', v_product)),
      (2, 'Shop grid: every rating (src/lib/reviews.ts fetchReviewSummaries)',
          'select product_id, rating from public.product_reviews'),
      (3, 'Account > Orders list (src/lib/orders.ts fetchOrders, RLS user_id filter)',
          format('select * from public.orders where user_id = %L order by created_at desc', v_user)),
      (4, 'Account > Order detail (src/lib/orders.ts fetchOrderById)',
          format('select * from public.orders where id = %L and user_id = %L', v_order, v_user)),
      (5, 'Order confirmed page (src/lib/orders.ts fetchOrderBySquareId)',
          format('select * from public.orders where square_order_id = %L', v_square)),
      (6, 'Daily job: orders awaiting a review request (backend/reviewRequests.ts pendingOrders)',
          'select id, user_id, email, status, items, fulfillment_state, shipped_at, created_at
             from public.orders
            where review_requested_at is null and status = ''COMPLETED'' and email is not null
            order by created_at asc limit 500'),
      (7, 'Daily job: products each buyer already reviewed (backend/reviewRequests.ts reviewedByUser)',
          format('select user_id, product_id from public.product_reviews where user_id in (%s)', v_buyers)),
      (8, 'Checkout: look up a welcome code (backend/subscribers.ts)',
          format('select email, discount_code, code_used_at from public.email_subscribers where discount_code = %L', v_code)),
      (9, 'Signup: is this address unsubscribed (backend/subscribers.ts)',
          format('select * from public.email_subscribers where email = %L and unsubscribed_at is not null', v_email))
    ) as t(n, name, sql)
    order by n
  loop
    for r in execute 'explain (analyze, buffers) ' || q.sql loop
      query_name := q.n || '. ' || q.name;
      plan_line  := r."QUERY PLAN";
      return next;
    end loop;
  end loop;
end
$$;

select * from pg_temp.query_plans(false);


-- ── 5. Indexes left INVALID by a failed CREATE INDEX CONCURRENTLY ──────────
-- Should return no rows. If one appears, drop it (drop index concurrently ...)
-- and run its migration again.

select t.relname as table_name, c.relname as index_name
from pg_index i
join pg_class c     on c.oid = i.indexrelid
join pg_class t     on t.oid = i.indrelid
join pg_namespace n on n.oid = t.relnamespace
where n.nspname = 'public' and not i.indisvalid;
