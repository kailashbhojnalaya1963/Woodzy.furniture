-- Woodzy database schema. Run this once in the Supabase SQL editor after
-- creating your project. Safe to re-run (idempotent where possible).

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------- tables
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  image text default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category_slug text not null references categories(slug) on update cascade,
  price int not null default 0,
  currency text not null default 'INR',
  short_desc text default '',
  long_desc text default '',
  materials text[] default '{}',
  dimensions text default '',
  finish text default '',
  images text[] default '{}',
  in_stock boolean default true,
  is_featured boolean default false,
  price_on_request boolean default false,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  address_line text not null,
  locality text not null,
  city text not null,
  state text not null,
  pincode text not null,
  items jsonb not null default '[]',
  subtotal int not null default 0,
  status text not null default 'new',
  channel text not null default 'whatsapp',
  notes text
);

-- -------------------------------------------------------------------- RLS
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;

drop policy if exists "public read categories" on categories;
create policy "public read categories" on categories for select using (true);
drop policy if exists "auth manage categories" on categories;
create policy "auth manage categories" on categories for all to authenticated using (true) with check (true);

drop policy if exists "public read products" on products;
create policy "public read products" on products for select using (true);
drop policy if exists "auth manage products" on products;
create policy "auth manage products" on products for all to authenticated using (true) with check (true);

-- orders: anyone may place one (guest checkout); only the owner reads/updates
drop policy if exists "public insert orders" on orders;
create policy "public insert orders" on orders for insert with check (true);
drop policy if exists "auth read orders" on orders;
create policy "auth read orders" on orders for select to authenticated using (true);
drop policy if exists "auth update orders" on orders;
create policy "auth update orders" on orders for update to authenticated using (true) with check (true);

-- ---------------------------------------------------------------- storage
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images" on storage.objects
  for select using (bucket_id = 'product-images');
drop policy if exists "auth write product images" on storage.objects;
create policy "auth write product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images');
drop policy if exists "auth modify product images" on storage.objects;
create policy "auth modify product images" on storage.objects
  for update to authenticated using (bucket_id = 'product-images');
drop policy if exists "auth delete product images" on storage.objects;
create policy "auth delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images');

-- -------------------------------------------------------------- seed cats
insert into categories (slug, name, sort_order) values
  ('sofas', 'Sofas', 1), ('beds', 'Beds', 2), ('dining', 'Dining', 3),
  ('tables', 'Tables', 4), ('storage', 'Storage', 5), ('decor', 'Decor', 6)
on conflict (slug) do nothing;

-- Create the owner login under Authentication → Users in the Supabase dashboard.
