import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export type CartLine = {
  productId: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  qty: number;
};

type CartState = {
  lines: CartLine[];
  add: (item: Omit<CartLine, "qty">, qty?: number) => void;
  remove: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.productId === item.productId);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.productId === item.productId ? { ...l, qty: l.qty + qty } : l,
              ),
            };
          }
          return { lines: [...s.lines, { ...item, qty }] };
        }),
      remove: (productId) =>
        set((s) => ({ lines: s.lines.filter((l) => l.productId !== productId) })),
      updateQty: (productId, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.productId !== productId)
              : s.lines.map((l) => (l.productId === productId ? { ...l, qty } : l)),
        })),
      clear: () => set({ lines: [] }),
      count: () => get().lines.reduce((n, l) => n + l.qty, 0),
      subtotal: () => get().lines.reduce((n, l) => n + l.price * l.qty, 0),
    }),
    {
      name: "woodzy-cart",
      // Use the DOM Storage explicitly. Node 25 exposes a non-functional global
      // `localStorage`, which would otherwise shadow jsdom's in tests; on the
      // server `window` is undefined so persistence is skipped.
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage,
      ),
    },
  ),
);
