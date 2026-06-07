"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";

export function CartButton() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));

  return (
    <Link href="/cart" aria-label="Cart" className="relative p-2 hover:text-amber-brand transition-colors">
      <ShoppingBag className="size-5" />
      {mounted && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 grid place-items-center rounded-full bg-amber-brand text-cream text-[11px] font-bold">
          {count}
        </span>
      )}
    </Link>
  );
}
