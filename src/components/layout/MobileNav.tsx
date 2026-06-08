"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { useEffect } from "react";
import type { Category } from "@/types/catalog";
import { cn } from "@/lib/utils";

export function MobileNav({
  open,
  onClose,
  categories,
  links,
}: {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  links: { href: string; label: string }[];
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-wood-darkest/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-80 max-w-[85%] bg-cream shadow-xl p-5 flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <Image
            src="/brand/woodzy-logo.png"
            alt="Woodzy"
            width={968}
            height={697}
            className="h-9 w-auto"
          />
          <button onClick={onClose} aria-label="Close menu" className="p-2">
            <X className="size-6" />
          </button>
        </div>
        <Link href="/shop" onClick={onClose} className="py-2 font-medium">
          Shop all
        </Link>
        <div className="pl-3 border-l border-wood-dark/10 mb-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              onClick={onClose}
              className="block py-1.5 text-sm text-wood-dark"
            >
              {c.name}
            </Link>
          ))}
        </div>
        {links.map((l) => (
          <Link key={l.href} href={l.href} onClick={onClose} className="py-2 font-medium">
            {l.label}
          </Link>
        ))}
        <div className="mt-auto text-xs text-wood-dark/60">Warm Woods, Cozy Living.</div>
      </div>
    </div>
  );
}
