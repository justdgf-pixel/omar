import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string | null;
  slug: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => {
    const exists = get().items.find((i) => i.id === item.id);
    if (!exists) {
      set((state) => ({ items: [...state.items, item] }));
    }
  },
  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
  },
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, item) => sum + item.price, 0),
  itemCount: () => get().items.length,
}));

interface AuthStore {
  user: { id: string; name: string; email: string; role: string } | null;
  setUser: (user: AuthStore["user"]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    set({ user: null });
    fetch("/api/auth/logout", { method: "POST" });
  },
}));
