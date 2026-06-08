"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useUI } from "@/store/ui";
import { CartLines } from "./CartLines";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const close = useUI((s) => s.closeCart);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <div
      className={cn("fixed inset-0 z-[60]", open ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-wood-darkest/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={close}
      />
      <aside
        className={cn(
          "absolute right-0 top-0 h-full w-96 max-w-[90%] bg-cream shadow-2xl flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-5 pb-3 shrink-0">
          <h2 className="font-display text-xl text-wood-darkest">Your cart</h2>
          <button onClick={close} aria-label="Close cart" className="p-1">
            <X className="size-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          <CartLines
            onNavigate={close}
            emptyAction={
              <Link href="/shop" onClick={close} className="text-amber-brand hover:underline">
                Browse furniture →
              </Link>
            }
          />
        </div>
      </aside>
    </div>
  );
}
