import { describe, it, expect } from "vitest";
import { getCategories, getProducts, getProductBySlug, getFeatured } from "./catalog";

// No Supabase env in the test environment → data layer must fall back to seed.
describe("catalog data layer (seed fallback)", () => {
  it("returns seed categories sorted", async () => {
    const cats = await getCategories();
    expect(cats.length).toBeGreaterThan(0);
    expect(cats[0].sortOrder).toBeLessThanOrEqual(cats[cats.length - 1].sortOrder);
  });

  it("returns seed products", async () => {
    expect((await getProducts()).length).toBeGreaterThan(0);
  });

  it("filters products by category", async () => {
    const sofas = await getProducts({ category: "sofas" });
    expect(sofas.length).toBeGreaterThan(0);
    expect(sofas.every((p) => p.categorySlug === "sofas")).toBe(true);
  });

  it("returns only featured for getFeatured", async () => {
    const featured = await getFeatured();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((p) => p.isFeatured)).toBe(true);
  });

  it("finds a product by slug", async () => {
    const all = await getProducts();
    const found = await getProductBySlug(all[0].slug);
    expect(found?.id).toBe(all[0].id);
  });
});
