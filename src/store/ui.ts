import { create } from "zustand";

type UIState = {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  mobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
};

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  mobileNavOpen: false,
  openMobileNav: () => set({ mobileNavOpen: true }),
  closeMobileNav: () => set({ mobileNavOpen: false }),
}));
