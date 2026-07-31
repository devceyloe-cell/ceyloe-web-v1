"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/types";

export interface CartItem {
  id: string;
  handle: string;
  title: string;
  price: number;
  image: string;
  origin?: string;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  addItem: (product: Pick<Product, "id" | "handle" | "title" | "price" | "image" | "specs">) => {
    ok: boolean;
    reason?: "duplicate" | "unavailable";
  };
  removeItem: (handle: string) => void;
  clearCart: () => void;
  hasItem: (handle: string) => boolean;
}

const STORAGE_KEY = "ceyloe-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

function readStoredItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStoredItems());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback(
    (product: Pick<Product, "id" | "handle" | "title" | "price" | "image" | "specs">) => {
      let result: { ok: boolean; reason?: "duplicate" | "unavailable" } = { ok: true };
      setItems((prev) => {
        if (prev.some((item) => item.handle === product.handle)) {
          result = { ok: false, reason: "duplicate" };
          return prev;
        }
        return [
          ...prev,
          {
            id: product.id,
            handle: product.handle,
            title: product.title,
            price: product.price,
            image: product.image,
            origin: product.specs.origin,
          },
        ];
      });
      return result;
    },
    [],
  );

  const removeItem = useCallback((handle: string) => {
    setItems((prev) => prev.filter((item) => item.handle !== handle));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const hasItem = useCallback(
    (handle: string) => items.some((item) => item.handle === handle),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount: items.length,
      addItem,
      removeItem,
      clearCart,
      hasItem,
    }),
    [items, addItem, removeItem, clearCart, hasItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
