"use client";

import Link from "next/link";
import { CartLines } from "@/components/cart/CartLines";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl text-wood-darkest mb-6">Your cart</h1>
      <CartLines
        emptyAction={
          <Link href="/shop" className="text-amber-brand hover:underline">
            Browse furniture →
          </Link>
        }
      />
    </div>
  );
}
