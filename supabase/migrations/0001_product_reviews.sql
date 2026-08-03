-- Customer product reviews.
--
-- Run this once against the Dominus Golf Supabase project:
--   Dashboard → SQL Editor → New query → paste → Run.
--
-- Until it has been run, the review section falls back to read-only mode: the
-- client detects the missing table and hides the write form rather than throwing.

create table if not exists public.product_reviews (
  id          uuid        primary key default gen_random_uuid(),

  -- Products live in the repo (src/data/products), not in Postgres, so this is a
  -- plain text id with no foreign key. It matches Product.id, e.g. 'tour-pure-men'.
  product_id  text        not null,

  user_id     uuid        not null references auth.users (id) on delete cascade,

  -- Denormalised on purpose. auth.users is not readable from the client under
  -- RLS, so without a stored display name every review would render anonymously.
  author_name text        not null check (char_length(author_name) between 1 and 80),

  rating      smallint    not null check (rating between 1 and 5),
  title       text        not null check (char_length(title) between 1 and 120),
  body        text        not null check (char_length(body) between 1 and 4000),

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  -- One review per person per product. A reviewer edits theirs instead of
  -- stacking duplicates, which is also what makes the client's upsert safe.
  unique (product_id, user_id)
);

create index if not exists product_reviews_product_created_idx
  on public.product_reviews (product_id, created_at desc);

alter table public.product_reviews enable row level security;

-- Reviews are public: the product page must render them to signed-out visitors
-- and to crawlers.
drop policy if exists "product_reviews_public_read" on public.product_reviews;
create policy "product_reviews_public_read"
  on public.product_reviews for select
  using (true);

-- Writes are limited to the signed-in author, so nobody can post or edit under
-- another account's id.
drop policy if exists "product_reviews_insert_own" on public.product_reviews;
create policy "product_reviews_insert_own"
  on public.product_reviews for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "product_reviews_update_own" on public.product_reviews;
create policy "product_reviews_update_own"
  on public.product_reviews for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "product_reviews_delete_own" on public.product_reviews;
create policy "product_reviews_delete_own"
  on public.product_reviews for delete to authenticated
  using (auth.uid() = user_id);

-- Keep updated_at honest on edits.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists product_reviews_set_updated_at on public.product_reviews;
create trigger product_reviews_set_updated_at
  before update on public.product_reviews
  for each row execute function public.set_updated_at();
