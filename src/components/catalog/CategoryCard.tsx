import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types/catalog";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative block aspect-[3/4] rounded-2xl overflow-hidden ring-1 ring-wood-dark/10"
    >
      <Image
        src={category.image}
        alt={category.name}
        fill
        sizes="(max-width: 640px) 33vw, 16vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-wood-darkest/85 via-wood-darkest/15 to-transparent" />
      <span className="absolute bottom-3 left-3 text-cream font-display text-lg drop-shadow">
        {category.name}
      </span>
    </Link>
  );
}
