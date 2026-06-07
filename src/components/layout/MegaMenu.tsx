import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types/catalog";

export function MegaMenu({
  categories,
  onNavigate,
}: {
  categories: Category[];
  onNavigate?: () => void;
}) {
  return (
    <div className="absolute left-0 top-full pt-3">
      <div className="w-[620px] rounded-2xl border border-wood-dark/10 bg-cream shadow-xl p-4 grid grid-cols-3 gap-2">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            onClick={onNavigate}
            className="group flex items-center gap-3 rounded-xl p-2 hover:bg-sand/60 transition-colors"
          >
            <span className="relative size-14 overflow-hidden rounded-lg bg-sand shrink-0">
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="56px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </span>
            <span className="font-medium">{c.name}</span>
          </Link>
        ))}
        <Link
          href="/shop"
          onClick={onNavigate}
          className="col-span-3 mt-1 text-center text-sm text-amber-brand hover:underline"
        >
          View all furniture →
        </Link>
      </div>
    </div>
  );
}
