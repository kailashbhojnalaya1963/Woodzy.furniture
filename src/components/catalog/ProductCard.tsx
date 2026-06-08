import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/catalog";
import { priceLabel } from "@/lib/format";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col rounded-2xl bg-cream ring-1 ring-wood-dark/10 overflow-hidden hover:shadow-xl transition-shadow">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-sand overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {!product.inStock && (
            <span className="absolute top-2 left-2 rounded-full bg-wood-darkest/80 text-cream text-[10px] px-2 py-0.5">
              Made to order
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm text-wood-darkest line-clamp-1">{product.name}</h3>
          <p className="text-xs text-wood-dark/60 line-clamp-1 mt-0.5">{product.shortDesc}</p>
          <p className="mt-1.5 text-amber-brand font-semibold">{priceLabel(product)}</p>
        </div>
      </Link>
      <div className="px-3 pb-3 mt-auto">
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
