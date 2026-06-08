import type { MetadataRoute } from "next";
import { getProducts, getCategories } from "@/lib/catalog";

const BASE = "https://woodzy.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const now = new Date();

  const staticPaths = ["", "/shop", "/collections", "/our-story", "/showroom"].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: now,
  }));
  const cat = categories.map((c) => ({ url: `${BASE}/category/${c.slug}`, lastModified: now }));
  const prod = products.map((p) => ({ url: `${BASE}/product/${p.slug}`, lastModified: now }));

  return [...staticPaths, ...cat, ...prod];
}
