"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";

export function CartButton() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  const openCart = useUI((s) => s.openCart);

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label="Open cart"
      className="relative p-2 hover:text-amber-brand transition-colors"
    >
      <ShoppingBag className="size-5" />
      {mounted && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 grid place-items-center rounded-full bg-amber-brand text-cream text-[11px] font-bold">
          {count}
        </span>
      )}
    </button>
  );
}
