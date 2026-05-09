"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  currency: string;
  imageUrl?: string | null;
  slug: string;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD":
      if (state.items.find((i) => i.id === action.item.id)) return state;
      return { items: [...state.items, action.item] };
    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.id) };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

const CartContext = createContext<{
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
  count: number;
}>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  total: 0,
  count: 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("rakam-cart");
        return stored ? JSON.parse(stored) : { items: [] };
      } catch {
        return { items: [] };
      }
    }
    return { items: [] };
  });

  useEffect(() => {
    localStorage.setItem("rakam-cart", JSON.stringify(state));
  }, [state]);

  const total = state.items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem: (item) => dispatch({ type: "ADD", item }),
        removeItem: (id) => dispatch({ type: "REMOVE", id }),
        clearCart: () => dispatch({ type: "CLEAR" }),
        total,
        count: state.items.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
