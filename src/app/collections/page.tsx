import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";

export const metadata: Metadata = {
  title: "Collections",
  description: "Curated Woodzy edits for every room — living, bedroom, dining and finishing accents.",
};

const COLLECTIONS = [
  {
    name: "The Living Room",
    blurb: "Sink-in sofas and warm tables — pieces that gather people.",
    categories: ["sofas", "tables"],
  },
  {
    name: "The Bedroom",
    blurb: "Calm beds and quiet storage for restful spaces.",
    categories: ["beds", "storage"],
  },
  {
    name: "Dining & Hosting",
    blurb: "Tables and seating made for long, lingering meals.",
    categories: ["dining"],
  },
  {
    name: "Finishing Accents",
    blurb: "The chairs, stools and details that make a house yours.",
    categories: ["decor"],
  },
];

export const revalidate = 60;

export default async function CollectionsPage() {
  const all = await getProducts();

  return (
    <div>
      <section
        className="text-cream"
        style={{ background: "radial-gradient(circle at 50% 20%, #6B3E1D, #1c1006 70%)" }}
      >
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="uppercase tracking-[0.3em] text-amber-brand text-xs mb-3">Curated edits</p>
          <h1 className="font-display text-4xl sm:text-5xl">Collections</h1>
          <p className="mt-4 text-sand/80 max-w-xl mx-auto">
            Room-by-room edits to help you build a space that feels whole.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6">
        {COLLECTIONS.map((col) => {
          const products = all
            .filter((p) => col.categories.includes(p.categorySlug))
            .slice(0, 4);
          if (products.length === 0) return null;
          return (
            <section key={col.name} className="py-14 border-b border-wood-dark/10 last:border-0">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="font-display text-3xl text-wood-darkest">{col.name}</h2>
                  <p className="text-wood-dark/70 mt-1">{col.blurb}</p>
                </div>
                <Link
                  href={`/category/${col.categories[0]}`}
                  className="text-sm text-wood-dark hover:text-amber-brand whitespace-nowrap"
                >
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
        })}
      </div>
    </div>
  );
}
