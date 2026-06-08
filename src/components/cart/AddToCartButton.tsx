"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import type { Product } from "@/types/catalog";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  product,
  qty = 1,
  size = "sm",
}: {
  product: Product;
  qty?: number;
  size?: "sm" | "lg";
}) {
  const add = useCart((s) => s.add);
  const openCart = useUI((s) => s.openCart);
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    add(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        slug: product.slug,
      },
      qty,
    );
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <button
      type="button"
      onClick={onAdd}
      className={cn(
        "w-full rounded-full font-medium inline-flex items-center justify-center gap-2 transition",
        "bg-wood-darkest text-cream hover:bg-wood-dark",
        size === "sm" ? "text-sm py-2" : "text-base py-3",
      )}
    >
      {added ? (
        <>
          <Check className="size-4" /> Added
        </>
      ) : (
        <>
          <ShoppingBag className="size-4" /> Add to cart
        </>
      )}
    </button>
  );
}
