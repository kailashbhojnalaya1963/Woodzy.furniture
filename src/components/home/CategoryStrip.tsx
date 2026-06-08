import Link from "next/link";
import type { Category } from "@/types/catalog";
import { CategoryCard } from "@/components/catalog/CategoryCard";

export function CategoryStrip({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="uppercase tracking-[0.25em] text-amber-brand text-xs mb-1">Browse</p>
          <h2 className="font-display text-3xl text-wood-darkest">Shop by category</h2>
        </div>
        <Link href="/shop" className="text-sm text-wood-dark hover:text-amber-brand">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((c) => (
          <CategoryCard key={c.slug} category={c} />
        ))}
      </div>
    </section>
  );
}
