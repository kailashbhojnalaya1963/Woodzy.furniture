"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Search, ChevronDown } from "lucide-react";
import type { Category } from "@/types/catalog";
import { Logo } from "@/components/brand/Logo";
import { CartButton } from "@/components/cart/CartButton";
import { MegaMenu } from "./MegaMenu";
import { useUI } from "@/store/ui";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/collections", label: "Collections" },
  { href: "/our-story", label: "Our Story" },
  { href: "/showroom", label: "Showroom" },
];

export function Navbar({ categories }: { categories: Category[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const openMobileNav = useUI((s) => s.openMobileNav);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "bg-cream/95 backdrop-blur border-b border-wood-dark/10 shadow-sm"
          : "bg-cream/60 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center gap-6 h-16">
        <Link href="/" aria-label="Woodzy home" className="shrink-0">
          <Logo variant="full" size={38} />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-2 text-sm font-medium">
          <div
            className="relative"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <Link
              href="/shop"
              className="px-3 py-2 inline-flex items-center gap-1 hover:text-amber-brand transition-colors"
            >
              Shop <ChevronDown className="size-4" />
            </Link>
            {shopOpen && <MegaMenu categories={categories} onNavigate={() => setShopOpen(false)} />}
          </div>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 hover:text-amber-brand transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/shop"
            aria-label="Search products"
            className="p-2 hover:text-amber-brand transition-colors"
          >
            <Search className="size-5" />
          </Link>
          <CartButton />
          <button
            className="p-2 lg:hidden"
            aria-label="Open menu"
            onClick={openMobileNav}
          >
            <Menu className="size-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
