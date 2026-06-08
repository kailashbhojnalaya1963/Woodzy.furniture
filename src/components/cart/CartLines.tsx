"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { useCart } from "@/store/cart";
import { formatINR } from "@/lib/format";

export function CartLines({
  onNavigate,
  emptyAction,
}: {
  onNavigate?: () => void;
  emptyAction?: ReactNode;
}) {
  const lines = useCart((s) => s.lines);
  const updateQty = useCart((s) => s.updateQty);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.lines.reduce((n, l) => n + l.price * l.qty, 0));

  if (lines.length === 0) {
    return (
      <div className="text-center py-16 text-wood-dark/60">
        Your cart is empty.
        {emptyAction && <div className="mt-4">{emptyAction}</div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <ul className="divide-y divide-wood-dark/10">
        {lines.map((l) => (
          <li key={l.productId} className="flex gap-3 py-3">
            <Link
              href={`/product/${l.slug}`}
              onClick={onNavigate}
              className="relative size-16 rounded-lg overflow-hidden bg-sand shrink-0"
            >
              <Image src={l.image} alt={l.name} fill sizes="64px" className="object-cover" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                href={`/product/${l.slug}`}
                onClick={onNavigate}
                className="text-sm font-medium line-clamp-1 hover:text-amber-brand"
              >
                {l.name}
              </Link>
              <div className="text-amber-brand text-sm font-semibold">{formatINR(l.price)}</div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => updateQty(l.productId, l.qty - 1)}
                  aria-label="Decrease quantity"
                  className="size-6 grid place-items-center rounded border border-wood-dark/20 hover:bg-sand"
                >
                  <Minus className="size-3" />
                </button>
                <span className="text-sm w-6 text-center">{l.qty}</span>
                <button
                  onClick={() => updateQty(l.productId, l.qty + 1)}
                  aria-label="Increase quantity"
                  className="size-6 grid place-items-center rounded border border-wood-dark/20 hover:bg-sand"
                >
                  <Plus className="size-3" />
                </button>
                <button
                  onClick={() => remove(l.productId)}
                  aria-label="Remove item"
                  className="ml-auto text-wood-dark/40 hover:text-red-700"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
            <div className="text-sm font-medium whitespace-nowrap">{formatINR(l.price * l.qty)}</div>
          </li>
        ))}
      </ul>

      <div className="border-t border-wood-dark/10 pt-4 mt-2">
        <div className="flex justify-between font-medium mb-1">
          <span>Subtotal</span>
          <span>{formatINR(subtotal)}</span>
        </div>
        <p className="text-xs text-wood-dark/50 mb-3">
          Final price &amp; delivery are confirmed with you on WhatsApp.
        </p>
        <Link
          href="/checkout"
          onClick={onNavigate}
          className="block text-center rounded-full bg-amber-brand text-wood-darkest font-semibold py-3 hover:brightness-105 transition"
        >
          Checkout →
        </Link>
      </div>
    </div>
  );
}
