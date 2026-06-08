import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts, getCategoryBySlug, getCategories } from "@/lib/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";

export const revalidate = 60;

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return {};
  return { title: cat.name, description: `Shop ${cat.name} — handcrafted by Woodzy.` };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();

  const products = await getProducts({ category: slug });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="font-display text-4xl text-wood-darkest">{cat.name}</h1>
      <p className="text-wood-dark/60 mt-1">{products.length} pieces</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
