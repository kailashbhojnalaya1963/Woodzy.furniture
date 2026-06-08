import { Suspense } from "react";
import type { Metadata } from "next";
import { getProducts, getCategories } from "@/lib/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Filters } from "@/components/catalog/Filters";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse all Woodzy furniture — sofas, beds, dining, tables, storage and decor.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; material?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const [all, categories] = await Promise.all([getProducts(), getCategories()]);
  const materials = Array.from(new Set(all.flatMap((p) => p.materials))).sort();

  let products = all;
  if (sp.category) products = products.filter((p) => p.categorySlug === sp.category);
  if (sp.material) products = products.filter((p) => p.materials.includes(sp.material!));
  if (sp.sort === "price-asc") products = [...products].sort((a, b) => a.price - b.price);
  else if (sp.sort === "price-desc") products = [...products].sort((a, b) => b.price - a.price);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-4xl text-wood-darkest mb-1">All furniture</h1>
      <p className="text-wood-dark/60 mb-6">{products.length} pieces</p>

      <Suspense>
        <Filters categories={categories} materials={materials} />
      </Suspense>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-wood-dark/60 py-16 text-center">No pieces match these filters.</p>
      )}
    </div>
  );
}
