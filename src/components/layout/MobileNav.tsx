"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect } from "react";
import type { Category } from "@/types/catalog";
import { Logo } from "@/components/brand/Logo";
import { useUI } from "@/store/ui";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/collections", label: "Collections" },
  { href: "/our-story", label: "Our Story" },
  { href: "/showroom", label: "Showroom" },
];

export function MobileNav({ categories }: { categories: Category[] }) {
  const open = useUI((s) => s.mobileNavOpen);
  const close = useUI((s) => s.closeMobileNav);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-wood-darkest/60 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={close}
      />
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-80 max-w-[85%] bg-cream shadow-2xl p-5 flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <Logo variant="mark" size={36} />
          <button onClick={close} aria-label="Close menu" className="p-2 text-wood-darkest">
            <X className="size-6" />
          </button>
        </div>

        <Link href="/shop" onClick={close} className="py-2 font-medium text-wood-darkest">
          Shop all
        </Link>
        <div className="pl-3 border-l border-wood-dark/15 my-1">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              onClick={close}
              className="block py-1.5 text-sm text-wood-dark/80"
            >
              {c.name}
            </Link>
          ))}
        </div>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={close}
            className="py-2 font-medium text-wood-darkest"
          >
            {l.label}
          </Link>
        ))}
        <div className="mt-auto text-xs text-wood-dark/50">Warm Woods, Cozy Living.</div>
      </div>
    </div>
  );
}
