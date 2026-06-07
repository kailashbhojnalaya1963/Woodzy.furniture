import type { Category, Product } from "@/types/catalog";
import { seedCategories } from "@/data/seed/categories";
import { seedProducts } from "@/data/seed/products";
import { hasSupabase } from "./supabase/env";
import { getReadClient } from "./supabase/server";

/* ----------------------------- row mappers ----------------------------- */

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    image: String(row.image ?? ""),
    sortOrder: Number(row.sort_order ?? 0),
  };
}

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    categorySlug: String(row.category_slug),
    price: Number(row.price ?? 0),
    currency: "INR",
    shortDesc: String(row.short_desc ?? ""),
    longDesc: String(row.long_desc ?? ""),
    materials: (row.materials as string[]) ?? [],
    dimensions: String(row.dimensions ?? ""),
    finish: String(row.finish ?? ""),
    images: (row.images as string[]) ?? [],
    inStock: Boolean(row.in_stock ?? true),
    isFeatured: Boolean(row.is_featured ?? false),
    priceOnRequest: Boolean(row.price_on_request ?? false),
  };
}

/* ----------------------------- public API ------------------------------ */

export async function getCategories(): Promise<Category[]> {
  const sb = getReadClient();
  if (!hasSupabase() || !sb) {
    return [...seedCategories].sort((a, b) => a.sortOrder - b.sortOrder);
  }
  const { data, error } = await sb.from("categories").select("*").order("sort_order");
  if (error || !data) return [...seedCategories].sort((a, b) => a.sortOrder - b.sortOrder);
  return data.map(mapCategory);
}

export async function getProducts(
  opts: { category?: string; featured?: boolean } = {},
): Promise<Product[]> {
  const sb = getReadClient();
  if (!hasSupabase() || !sb) {
    let list = [...seedProducts];
    if (opts.category) list = list.filter((p) => p.categorySlug === opts.category);
    if (opts.featured) list = list.filter((p) => p.isFeatured);
    return list;
  }
  let query = sb.from("products").select("*");
  if (opts.category) query = query.eq("category_slug", opts.category);
  if (opts.featured) query = query.eq("is_featured", true);
  const { data, error } = await query;
  if (error || !data) {
    let list = [...seedProducts];
    if (opts.category) list = list.filter((p) => p.categorySlug === opts.category);
    if (opts.featured) list = list.filter((p) => p.isFeatured);
    return list;
  }
  return data.map(mapProduct);
}

export function getFeatured(): Promise<Product[]> {
  return getProducts({ featured: true });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const sb = getReadClient();
  if (!hasSupabase() || !sb) {
    return seedProducts.find((p) => p.slug === slug) ?? null;
  }
  const { data, error } = await sb.from("products").select("*").eq("slug", slug).maybeSingle();
  if (error || !data) return seedProducts.find((p) => p.slug === slug) ?? null;
  return mapProduct(data);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const all = await getCategories();
  return all.find((c) => c.slug === slug) ?? null;
}
