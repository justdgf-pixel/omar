"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/components/cart/CartContext";
import RegisterSW from "@/components/RegisterSW";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <RegisterSW />
        {children}
      </CartProvider>
    </SessionProvider>
  );
}
