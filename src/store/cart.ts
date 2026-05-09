"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  title: string;
  priceCentimes: number;
  coverUrl?: string | null;
};

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: string) => void;
  clear: () => void;
  count: () => number;
  totalCentimes: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((s) =>
          s.items.find((i) => i.productId === item.productId) ? s : { items: [...s.items, item] },
        ),
      remove: (productId) => set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      clear: () => set({ items: [] }),
      count: () => get().items.length,
      totalCentimes: () => get().items.reduce((acc, i) => acc + i.priceCentimes, 0),
    }),
    { name: "souqami-cart" },
  ),
);
