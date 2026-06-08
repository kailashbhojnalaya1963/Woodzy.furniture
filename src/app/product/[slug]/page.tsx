import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getCategoryBySlug } from "@/lib/catalog";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductCard } from "@/components/catalog/ProductCard";
import { priceLabel } from "@/lib/format";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.shortDesc,
    openGraph: { images: p.images.slice(0, 1), title: p.name, description: p.shortDesc },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, related] = await Promise.all([
    getCategoryBySlug(product.categorySlug),
    getProducts({ category: product.categorySlug }),
  ]);
  const more = related.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <nav className="text-xs text-wood-dark/50 mb-4">
        <Link href="/shop" className="hover:text-amber-brand">
          Shop
        </Link>{" "}
        /{" "}
        <Link href={`/category/${product.categorySlug}`} className="hover:text-amber-brand">
          {category?.name ?? product.categorySlug}
        </Link>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <h1 className="font-display text-3xl text-wood-darkest">{product.name}</h1>
          <p className="text-2xl text-amber-brand font-semibold mt-2">{priceLabel(product)}</p>
          <p className="mt-4 text-wood-dark/80 leading-relaxed">{product.longDesc}</p>

          <dl className="mt-6 grid grid-cols-3 gap-y-3 text-sm">
            <dt className="text-wood-dark/50">Materials</dt>
            <dd className="col-span-2">{product.materials.join(", ")}</dd>
            <dt className="text-wood-dark/50">Dimensions</dt>
            <dd className="col-span-2">{product.dimensions}</dd>
            <dt className="text-wood-dark/50">Finish</dt>
            <dd className="col-span-2">{product.finish}</dd>
            <dt className="text-wood-dark/50">Availability</dt>
            <dd className="col-span-2">{product.inStock ? "In stock" : "Made to order"}</dd>
          </dl>

          <div className="mt-8 max-w-xs">
            <AddToCartButton product={product} size="lg" />
          </div>
          <p className="mt-3 text-xs text-wood-dark/50">
            Add to cart, then send your itemised quote to us on WhatsApp at checkout.
          </p>
        </div>
      </div>

      {more.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl text-wood-darkest mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {more.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
