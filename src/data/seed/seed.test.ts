import { describe, it, expect } from "vitest";
import { seedCategories } from "./categories";
import { seedProducts } from "./products";

describe("seed catalog integrity", () => {
  it("every product points to an existing category", () => {
    const slugs = new Set(seedCategories.map((c) => c.slug));
    for (const p of seedProducts) {
      expect(slugs.has(p.categorySlug), `${p.slug} → ${p.categorySlug}`).toBe(true);
    }
  });

  it("product slugs are unique", () => {
    const slugs = seedProducts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("category slugs are unique", () => {
    const slugs = seedCategories.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has at least one featured product", () => {
    expect(seedProducts.some((p) => p.isFeatured)).toBe(true);
  });

  it("every product has at least one image and a price", () => {
    for (const p of seedProducts) {
      expect(p.images.length).toBeGreaterThan(0);
      expect(p.price).toBeGreaterThan(0);
    }
  });
});
