/**
 * Generate catalog seed SQL (categories + products) from the TS seed and append
 * it to supabase/schema.sql after the `-- @SEED@` sentinel. Re-runnable.
 * Run: node scripts/gen-seed-sql.mjs   (Node 23+ strips the TS types)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { seedCategories } from "../src/data/seed/categories.ts";
import { seedProducts } from "../src/data/seed/products.ts";

const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const arr = (a) => `ARRAY[${a.map(q).join(", ")}]::text[]`;

const catRows = seedCategories
  .map((c) => `  (${q(c.slug)}, ${q(c.name)}, ${q(c.image)}, ${c.sortOrder})`)
  .join(",\n");

const catSql = `insert into categories (slug, name, image, sort_order) values
${catRows}
on conflict (slug) do update set
  name = excluded.name, image = excluded.image, sort_order = excluded.sort_order;`;

const prodSql = seedProducts
  .map(
    (p) => `insert into products
  (slug, name, category_slug, price, currency, short_desc, long_desc, materials, dimensions, finish, images, in_stock, is_featured, price_on_request)
values (
  ${q(p.slug)}, ${q(p.name)}, ${q(p.categorySlug)}, ${p.price}, ${q(p.currency)},
  ${q(p.shortDesc)}, ${q(p.longDesc)}, ${arr(p.materials)}, ${q(p.dimensions)}, ${q(p.finish)},
  ${arr(p.images)}, ${p.inStock}, ${p.isFeatured}, ${p.priceOnRequest}
) on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug, price = excluded.price,
  short_desc = excluded.short_desc, long_desc = excluded.long_desc, materials = excluded.materials,
  dimensions = excluded.dimensions, finish = excluded.finish, images = excluded.images,
  in_stock = excluded.in_stock, is_featured = excluded.is_featured,
  price_on_request = excluded.price_on_request;`,
  )
  .join("\n\n");

const block = `

-- ============================ categories ============================
${catSql}

-- ============================== products ============================
${prodSql}

-- Create the owner login under Authentication → Users in the Supabase dashboard.
`;

const SENTINEL = "(upserts).";
const schema = readFileSync("supabase/schema.sql", "utf8");
const cut = schema.indexOf(SENTINEL);
if (cut === -1) throw new Error("seed sentinel not found in schema.sql");
writeFileSync("supabase/schema.sql", schema.slice(0, cut + SENTINEL.length) + block);
console.log(`seeded ${seedCategories.length} categories + ${seedProducts.length} products into supabase/schema.sql`);
