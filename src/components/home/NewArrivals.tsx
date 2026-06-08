import Link from "next/link";
import type { Product } from "@/types/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";

export function NewArrivals({ products }: { products: Product[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="uppercase tracking-[0.25em] text-amber-brand text-xs mb-1">
            Fresh from the workshop
          </p>
          <h2 className="font-display text-3xl text-wood-darkest">New arrivals</h2>
        </div>
        <Link href="/shop" className="text-sm text-wood-dark hover:text-amber-brand">
          Shop all →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
