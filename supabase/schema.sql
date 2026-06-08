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

-- @SEED@ — catalog seed (categories + products) below is generated from
-- src/data/seed by `node scripts/gen-seed-sql.mjs`. Safe to re-run (upserts).

-- ============================ categories ============================
insert into categories (slug, name, image, sort_order) values
  ('sofas', 'Sofas', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=70', 1),
  ('beds', 'Beds', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=70', 2),
  ('dining', 'Dining', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=70', 3),
  ('tables', 'Tables', 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=800&q=70', 4),
  ('storage', 'Storage', 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=800&q=70', 5),
  ('decor', 'Decor', 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=70', 6)
on conflict (slug) do update set
  name = excluded.name, image = excluded.image, sort_order = excluded.sort_order;

-- ============================== products ============================
insert into products
  (slug, name, category_slug, price, currency, short_desc, long_desc, materials, dimensions, finish, images, in_stock, is_featured, price_on_request)
values (
  'aravalli-walnut-3-seater-sofa', 'Aravalli Walnut 3-Seater Sofa', 'sofas', 54999, 'INR',
  'Solid walnut frame with deep cushioned seating.', 'Hand-built on a kiln-dried walnut frame, the Aravalli pairs a sculpted wooden base with high-resilience foam and feather-blend cushions. A timeless centrepiece for warm, cozy living rooms.', ARRAY['Walnut', 'Linen']::text[], 'W 84" × D 36" × H 32"', 'Natural matte',
  ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=70', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=70']::text[], true, true, false
) on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug, price = excluded.price,
  short_desc = excluded.short_desc, long_desc = excluded.long_desc, materials = excluded.materials,
  dimensions = excluded.dimensions, finish = excluded.finish, images = excluded.images,
  in_stock = excluded.in_stock, is_featured = excluded.is_featured,
  price_on_request = excluded.price_on_request;

insert into products
  (slug, name, category_slug, price, currency, short_desc, long_desc, materials, dimensions, finish, images, in_stock, is_featured, price_on_request)
values (
  'kashmiri-teak-loveseat', 'Kashmiri Teak 2-Seater Loveseat', 'sofas', 38999, 'INR',
  'Compact teak loveseat for snug corners.', 'A two-seater in solid teak with hand-rubbed oil finish and removable linen cushions. Built for apartments and reading nooks that still want a touch of craft.', ARRAY['Teak', 'Linen']::text[], 'W 56" × D 34" × H 31"', 'Oiled teak',
  ARRAY['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=70']::text[], true, false, false
) on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug, price = excluded.price,
  short_desc = excluded.short_desc, long_desc = excluded.long_desc, materials = excluded.materials,
  dimensions = excluded.dimensions, finish = excluded.finish, images = excluded.images,
  in_stock = excluded.in_stock, is_featured = excluded.is_featured,
  price_on_request = excluded.price_on_request;

insert into products
  (slug, name, category_slug, price, currency, short_desc, long_desc, materials, dimensions, finish, images, in_stock, is_featured, price_on_request)
values (
  'sundar-linen-sectional', 'Sundar Linen Sectional Sofa', 'sofas', 89999, 'INR',
  'L-shaped sectional with a sturdy hardwood base.', 'The Sundar sectional seats the whole family. A solid hardwood understructure carries plush, deep linen-wrapped cushions with a chaise that can sit on either side.', ARRAY['Sheesham', 'Linen']::text[], 'W 112" × D 64" × H 33"', 'Honey matte',
  ARRAY['https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=900&q=70', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=70']::text[], true, true, false
) on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug, price = excluded.price,
  short_desc = excluded.short_desc, long_desc = excluded.long_desc, materials = excluded.materials,
  dimensions = excluded.dimensions, finish = excluded.finish, images = excluded.images,
  in_stock = excluded.in_stock, is_featured = excluded.is_featured,
  price_on_request = excluded.price_on_request;

insert into products
  (slug, name, category_slug, price, currency, short_desc, long_desc, materials, dimensions, finish, images, in_stock, is_featured, price_on_request)
values (
  'heritage-leather-recliner', 'Heritage Leather Recliner', 'sofas', 64999, 'INR',
  'Full-grain leather recliner on a walnut frame.', 'A single-seat recliner upholstered in full-grain leather that ages beautifully, mounted on a walnut frame with a smooth manual recline mechanism.', ARRAY['Walnut', 'Leather']::text[], 'W 34" × D 38" × H 40"', 'Tan leather',
  ARRAY['https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=70']::text[], true, false, false
) on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug, price = excluded.price,
  short_desc = excluded.short_desc, long_desc = excluded.long_desc, materials = excluded.materials,
  dimensions = excluded.dimensions, finish = excluded.finish, images = excluded.images,
  in_stock = excluded.in_stock, is_featured = excluded.is_featured,
  price_on_request = excluded.price_on_request;

insert into products
  (slug, name, category_slug, price, currency, short_desc, long_desc, materials, dimensions, finish, images, in_stock, is_featured, price_on_request)
values (
  'sheesham-king-bed', 'Sheesham King Bed', 'beds', 72999, 'INR',
  'Solid sheesham king bed with a slatted headboard.', 'A grounding king-size bed in solid sheesham (Indian rosewood) with a panelled headboard and a low, modern profile. Engineered slats need no box spring.', ARRAY['Sheesham']::text[], 'W 78" × L 84" × H 42"', 'Walnut stain',
  ARRAY['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=70', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=70']::text[], true, true, false
) on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug, price = excluded.price,
  short_desc = excluded.short_desc, long_desc = excluded.long_desc, materials = excluded.materials,
  dimensions = excluded.dimensions, finish = excluded.finish, images = excluded.images,
  in_stock = excluded.in_stock, is_featured = excluded.is_featured,
  price_on_request = excluded.price_on_request;

insert into products
  (slug, name, category_slug, price, currency, short_desc, long_desc, materials, dimensions, finish, images, in_stock, is_featured, price_on_request)
values (
  'oakwood-queen-storage-bed', 'Oakwood Queen Storage Bed', 'beds', 58999, 'INR',
  'Queen bed with hydraulic under-storage.', 'Clever oak-veneer bed with a lift-up hydraulic base, turning the whole footprint into hidden storage — ideal for compact city bedrooms.', ARRAY['Oak']::text[], 'W 66" × L 78" × H 40"', 'Natural oak',
  ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=70']::text[], true, false, false
) on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug, price = excluded.price,
  short_desc = excluded.short_desc, long_desc = excluded.long_desc, materials = excluded.materials,
  dimensions = excluded.dimensions, finish = excluded.finish, images = excluded.images,
  in_stock = excluded.in_stock, is_featured = excluded.is_featured,
  price_on_request = excluded.price_on_request;

insert into products
  (slug, name, category_slug, price, currency, short_desc, long_desc, materials, dimensions, finish, images, in_stock, is_featured, price_on_request)
values (
  'minimalist-teak-platform-bed', 'Minimalist Teak Platform Bed', 'beds', 49999, 'INR',
  'Low teak platform bed, Japandi-inspired.', 'A calm, low-slung platform bed in teak with a floating-edge detail. Quiet lines for a restful, clutter-free bedroom.', ARRAY['Teak']::text[], 'W 66" × L 78" × H 14"', 'Oiled teak',
  ARRAY['https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=70']::text[], true, false, false
) on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug, price = excluded.price,
  short_desc = excluded.short_desc, long_desc = excluded.long_desc, materials = excluded.materials,
  dimensions = excluded.dimensions, finish = excluded.finish, images = excluded.images,
  in_stock = excluded.in_stock, is_featured = excluded.is_featured,
  price_on_request = excluded.price_on_request;

insert into products
  (slug, name, category_slug, price, currency, short_desc, long_desc, materials, dimensions, finish, images, in_stock, is_featured, price_on_request)
values (
  'banaras-6-seater-dining-set', 'Banaras 6-Seater Dining Set', 'dining', 78000, 'INR',
  'Solid wood table with six cushioned chairs.', 'The Banaras set anchors family dinners — a thick solid-wood top on tapered legs, paired with six chairs upholstered in an easy-clean weave.', ARRAY['Sheesham', 'Fabric']::text[], 'Table: L 72" × W 38" × H 30"', 'Provincial teak',
  ARRAY['https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=70', 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=900&q=70']::text[], true, true, false
) on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug, price = excluded.price,
  short_desc = excluded.short_desc, long_desc = excluded.long_desc, materials = excluded.materials,
  dimensions = excluded.dimensions, finish = excluded.finish, images = excluded.images,
  in_stock = excluded.in_stock, is_featured = excluded.is_featured,
  price_on_request = excluded.price_on_request;

insert into products
  (slug, name, category_slug, price, currency, short_desc, long_desc, materials, dimensions, finish, images, in_stock, is_featured, price_on_request)
values (
  'rosewood-4-seater-dining-table', 'Rosewood 4-Seater Dining Table', 'dining', 45999, 'INR',
  'Compact rosewood dining table for four.', 'A warm rosewood four-seater with a rounded-corner top and sturdy splayed legs. Right-sized for apartments without skimping on presence.', ARRAY['Rosewood']::text[], 'L 54" × W 34" × H 30"', 'Deep walnut',
  ARRAY['https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=900&q=70']::text[], true, false, false
) on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug, price = excluded.price,
  short_desc = excluded.short_desc, long_desc = excluded.long_desc, materials = excluded.materials,
  dimensions = excluded.dimensions, finish = excluded.finish, images = excluded.images,
  in_stock = excluded.in_stock, is_featured = excluded.is_featured,
  price_on_request = excluded.price_on_request;

insert into products
  (slug, name, category_slug, price, currency, short_desc, long_desc, materials, dimensions, finish, images, in_stock, is_featured, price_on_request)
values (
  'cafe-round-dining-table', 'Cafe Round Dining Table', 'dining', 28999, 'INR',
  'Round two-seater bistro table.', 'A charming round-top café table in solid wood with a single turned pedestal — perfect for breakfast corners and balconies.', ARRAY['Mango Wood']::text[], 'Ø 36" × H 30"', 'Honey matte',
  ARRAY['https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=900&q=70']::text[], true, false, false
) on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug, price = excluded.price,
  short_desc = excluded.short_desc, long_desc = excluded.long_desc, materials = excluded.materials,
  dimensions = excluded.dimensions, finish = excluded.finish, images = excluded.images,
  in_stock = excluded.in_stock, is_featured = excluded.is_featured,
  price_on_request = excluded.price_on_request;

insert into products
  (slug, name, category_slug, price, currency, short_desc, long_desc, materials, dimensions, finish, images, in_stock, is_featured, price_on_request)
values (
  'walnut-coffee-table', 'Walnut Coffee Table', 'tables', 18999, 'INR',
  'Two-tier walnut coffee table with shelf.', 'A grounded walnut coffee table with a lower display shelf and softened edges — the warm heart of the living room.', ARRAY['Walnut']::text[], 'L 44" × W 24" × H 18"', 'Natural matte',
  ARRAY['https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=900&q=70']::text[], true, true, false
) on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug, price = excluded.price,
  short_desc = excluded.short_desc, long_desc = excluded.long_desc, materials = excluded.materials,
  dimensions = excluded.dimensions, finish = excluded.finish, images = excluded.images,
  in_stock = excluded.in_stock, is_featured = excluded.is_featured,
  price_on_request = excluded.price_on_request;

insert into products
  (slug, name, category_slug, price, currency, short_desc, long_desc, materials, dimensions, finish, images, in_stock, is_featured, price_on_request)
values (
  'live-edge-console-table', 'Live-Edge Console Table', 'tables', 24999, 'INR',
  'Live-edge console on slim metal legs.', 'A single live-edge plank, finished to show its natural grain and contour, on slim black metal legs. A striking entryway or sofa-back console.', ARRAY['Acacia', 'Metal']::text[], 'L 48" × W 14" × H 30"', 'Natural live-edge',
  ARRAY['https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=70']::text[], true, false, false
) on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug, price = excluded.price,
  short_desc = excluded.short_desc, long_desc = excluded.long_desc, materials = excluded.materials,
  dimensions = excluded.dimensions, finish = excluded.finish, images = excluded.images,
  in_stock = excluded.in_stock, is_featured = excluded.is_featured,
  price_on_request = excluded.price_on_request;

insert into products
  (slug, name, category_slug, price, currency, short_desc, long_desc, materials, dimensions, finish, images, in_stock, is_featured, price_on_request)
values (
  'nesting-side-tables-set-of-2', 'Nesting Side Tables (Set of 2)', 'tables', 12999, 'INR',
  'Pair of stackable wooden side tables.', 'A versatile pair of nesting tables that tuck together or spread out as needed — solid tops with gently splayed legs.', ARRAY['Mango Wood']::text[], 'Large: Ø 18" × H 22"', 'Two-tone walnut',
  ARRAY['https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=900&q=70']::text[], true, false, false
) on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug, price = excluded.price,
  short_desc = excluded.short_desc, long_desc = excluded.long_desc, materials = excluded.materials,
  dimensions = excluded.dimensions, finish = excluded.finish, images = excluded.images,
  in_stock = excluded.in_stock, is_featured = excluded.is_featured,
  price_on_request = excluded.price_on_request;

insert into products
  (slug, name, category_slug, price, currency, short_desc, long_desc, materials, dimensions, finish, images, in_stock, is_featured, price_on_request)
values (
  'oak-4-door-wardrobe', 'Oak 4-Door Wardrobe', 'storage', 62500, 'INR',
  'Spacious four-door oak wardrobe.', 'A full-height four-door wardrobe in oak with a mix of hanging space, shelves and soft-close drawers. Quietly handsome, generously practical.', ARRAY['Oak']::text[], 'W 72" × D 24" × H 84"', 'Natural oak',
  ARRAY['https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=70']::text[], true, false, false
) on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug, price = excluded.price,
  short_desc = excluded.short_desc, long_desc = excluded.long_desc, materials = excluded.materials,
  dimensions = excluded.dimensions, finish = excluded.finish, images = excluded.images,
  in_stock = excluded.in_stock, is_featured = excluded.is_featured,
  price_on_request = excluded.price_on_request;

insert into products
  (slug, name, category_slug, price, currency, short_desc, long_desc, materials, dimensions, finish, images, in_stock, is_featured, price_on_request)
values (
  'teak-bookshelf', 'Teak Open Bookshelf', 'storage', 21999, 'INR',
  'Five-tier open teak bookshelf.', 'An airy five-tier bookshelf in solid teak — open on both sides so it doubles as a gentle room divider.', ARRAY['Teak']::text[], 'W 36" × D 14" × H 72"', 'Oiled teak',
  ARRAY['https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=900&q=70']::text[], true, true, false
) on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug, price = excluded.price,
  short_desc = excluded.short_desc, long_desc = excluded.long_desc, materials = excluded.materials,
  dimensions = excluded.dimensions, finish = excluded.finish, images = excluded.images,
  in_stock = excluded.in_stock, is_featured = excluded.is_featured,
  price_on_request = excluded.price_on_request;

insert into products
  (slug, name, category_slug, price, currency, short_desc, long_desc, materials, dimensions, finish, images, in_stock, is_featured, price_on_request)
values (
  'sideboard-cabinet', 'Sideboard Storage Cabinet', 'storage', 34999, 'INR',
  'Low sideboard with doors and drawers.', 'A low sideboard for the dining or living room — wooden doors, felt-lined drawers and a top that''s ready for lamps, plants and platters.', ARRAY['Sheesham']::text[], 'W 60" × D 18" × H 30"', 'Walnut stain',
  ARRAY['https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=70']::text[], true, false, false
) on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug, price = excluded.price,
  short_desc = excluded.short_desc, long_desc = excluded.long_desc, materials = excluded.materials,
  dimensions = excluded.dimensions, finish = excluded.finish, images = excluded.images,
  in_stock = excluded.in_stock, is_featured = excluded.is_featured,
  price_on_request = excluded.price_on_request;

insert into products
  (slug, name, category_slug, price, currency, short_desc, long_desc, materials, dimensions, finish, images, in_stock, is_featured, price_on_request)
values (
  'lounge-accent-chair', 'Lounge Accent Chair', 'decor', 19999, 'INR',
  'Curved-back accent chair with wooden arms.', 'A sculpted lounge chair with a curved upholstered back cradled by solid wooden arms — the kind of seat you sink into with a book.', ARRAY['Ash Wood', 'Fabric']::text[], 'W 30" × D 32" × H 30"', 'Natural ash',
  ARRAY['https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=70', 'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&w=900&q=70']::text[], true, true, false
) on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug, price = excluded.price,
  short_desc = excluded.short_desc, long_desc = excluded.long_desc, materials = excluded.materials,
  dimensions = excluded.dimensions, finish = excluded.finish, images = excluded.images,
  in_stock = excluded.in_stock, is_featured = excluded.is_featured,
  price_on_request = excluded.price_on_request;

insert into products
  (slug, name, category_slug, price, currency, short_desc, long_desc, materials, dimensions, finish, images, in_stock, is_featured, price_on_request)
values (
  'rattan-armchair', 'Rattan & Teak Armchair', 'decor', 15999, 'INR',
  'Woven rattan seat on a teak frame.', 'Breezy and light, this armchair weaves natural rattan across a teak frame — a relaxed accent for sunrooms and balconies.', ARRAY['Teak', 'Rattan']::text[], 'W 27" × D 29" × H 32"', 'Natural rattan',
  ARRAY['https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&w=900&q=70']::text[], true, false, false
) on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug, price = excluded.price,
  short_desc = excluded.short_desc, long_desc = excluded.long_desc, materials = excluded.materials,
  dimensions = excluded.dimensions, finish = excluded.finish, images = excluded.images,
  in_stock = excluded.in_stock, is_featured = excluded.is_featured,
  price_on_request = excluded.price_on_request;

insert into products
  (slug, name, category_slug, price, currency, short_desc, long_desc, materials, dimensions, finish, images, in_stock, is_featured, price_on_request)
values (
  'wooden-rocking-chair', 'Classic Wooden Rocking Chair', 'decor', 17999, 'INR',
  'Heirloom-style solid wood rocker.', 'A heirloom-style rocking chair in solid wood with a contoured seat and gentle curved runners — comfort that lasts generations.', ARRAY['Sheesham']::text[], 'W 24" × D 38" × H 42"', 'Provincial teak',
  ARRAY['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=70']::text[], true, false, false
) on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug, price = excluded.price,
  short_desc = excluded.short_desc, long_desc = excluded.long_desc, materials = excluded.materials,
  dimensions = excluded.dimensions, finish = excluded.finish, images = excluded.images,
  in_stock = excluded.in_stock, is_featured = excluded.is_featured,
  price_on_request = excluded.price_on_request;

insert into products
  (slug, name, category_slug, price, currency, short_desc, long_desc, materials, dimensions, finish, images, in_stock, is_featured, price_on_request)
values (
  'carved-accent-stool', 'Hand-Carved Accent Stool', 'decor', 8999, 'INR',
  'Hand-carved solid wood stool / side perch.', 'A petite hand-carved stool that moonlights as a plant stand or side perch. Each piece carries the marks of the artisan''s chisel.', ARRAY['Mango Wood']::text[], 'Ø 14" × H 18"', 'Distressed natural',
  ARRAY['https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=900&q=70']::text[], true, false, false
) on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug, price = excluded.price,
  short_desc = excluded.short_desc, long_desc = excluded.long_desc, materials = excluded.materials,
  dimensions = excluded.dimensions, finish = excluded.finish, images = excluded.images,
  in_stock = excluded.in_stock, is_featured = excluded.is_featured,
  price_on_request = excluded.price_on_request;

-- Create the owner login under Authentication → Users in the Supabase dashboard.
