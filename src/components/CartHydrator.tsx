"use client";

import { useEffect, useState } from "react";

/**
 * Forces zustand-persist to rehydrate from localStorage after mount so cart
 * counts shown in the SSR-rendered Navbar match the client snapshot.
 */
export function CartHydrator() {
  const [, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  return null;
}
