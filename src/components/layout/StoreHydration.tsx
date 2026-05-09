"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { useLocaleStore } from "@/store/locale";

export default function StoreHydration() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
    useLocaleStore.persist.rehydrate();
  }, []);

  return null;
}
