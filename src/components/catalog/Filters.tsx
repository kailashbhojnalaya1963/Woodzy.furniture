"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Category } from "@/types/catalog";
import { cn } from "@/lib/utils";

export function Filters({
  categories,
  materials,
}: {
  categories: Category[];
  materials: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const current = (key: string) => sp.get(key) ?? "";

  const toggle = (key: string, val: string) => {
    const params = new URLSearchParams(sp.toString());
    if (current(key) === val || !val) params.delete(key);
    else params.set(key, val);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const setSort = (val: string) => {
    const params = new URLSearchParams(sp.toString());
    if (val) params.set("sort", val);
    else params.delete("sort");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const hasFilters = sp.get("category") || sp.get("material") || sp.get("sort");

  return (
    <div className="space-y-3 border-y border-wood-dark/10 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-wood-dark/50 mr-1">Category</span>
        {categories.map((c) => (
          <Chip key={c.slug} active={current("category") === c.slug} onClick={() => toggle("category", c.slug)}>
            {c.name}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-wood-dark/50 mr-1">Material</span>
        {materials.map((m) => (
          <Chip key={m} active={current("material") === m} onClick={() => toggle("material", m)}>
            {m}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs uppercase tracking-wide text-wood-dark/50">Sort</label>
        <select
          value={current("sort")}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-wood-dark/20 bg-cream px-3 py-1.5 text-sm"
        >
          <option value="">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
        {hasFilters && (
          <button
            onClick={() => router.push(pathname, { scroll: false })}
            className="text-sm text-amber-brand hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-sm border transition",
        active
          ? "bg-wood-darkest text-cream border-wood-darkest"
          : "border-wood-dark/20 text-wood-dark hover:border-amber-brand",
      )}
    >
      {children}
    </button>
  );
}
