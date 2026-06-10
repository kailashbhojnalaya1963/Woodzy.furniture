"use client";

import { ShoppingBag, Minus, Plus } from "lucide-react";
import type { Product } from "@/types/catalog";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";

/**
 * Adds a product to the cart. Once in the cart it becomes an inline qty stepper
 * so the user sees how many they've added. It does NOT open the cart drawer —
 * the drawer only opens when the user taps the bag icon in the navbar.
 */
export function AddToCartButton({
  product,
  size = "sm",
}: {
  product: Product;
  size?: "sm" | "lg";
}) {
  const qty = useCart((s) => s.lines.find((l) => l.productId === product.id)?.qty ?? 0);
  const add = useCart((s) => s.add);
  const updateQty = useCart((s) => s.updateQty);

  const lineItem = {
    productId: product.id,
    name: product.name,
    price: product.price,
    image: product.images[0],
    slug: product.slug,
  };

  const pad = size === "sm" ? "py-2 text-sm" : "py-3 text-base";

  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={() => add(lineItem, 1)}
        className={cn(
          "w-full rounded-full font-medium inline-flex items-center justify-center gap-2 transition bg-wood-darkest text-cream hover:bg-wood-dark",
          pad,
        )}
      >
        <ShoppingBag className="size-4" /> Add to cart
      </button>
    );
  }

  return (
    <div
      className={cn(
        "w-full rounded-full font-medium flex items-center justify-between bg-wood-darkest text-cream px-2",
        pad,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => updateQty(product.id, qty - 1)}
        className="size-7 grid place-items-center rounded-full hover:bg-cream/15 transition"
      >
        <Minus className="size-4" />
      </button>
      <span className="text-sm tabular-nums">{qty} in cart</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => add(lineItem, 1)}
        className="size-7 grid place-items-center rounded-full hover:bg-cream/15 transition"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
