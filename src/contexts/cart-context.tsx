"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Product } from "@/types";
import { useUserAuth } from "@/contexts/user-auth-context";

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
    reason?: "duplicate" | "unavailable" | "auth";
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

function writeStoredItems(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

async function persistServerCart(items: CartItem[]) {
  await fetch("/api/cart", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useUserAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const skipNextPersist = useRef(false);
  const wasLoggedIn = useRef(false);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    async function load() {
      if (user) {
        const guest = readStoredItems();
        const res = await fetch("/api/auth/me");
        const data = await res.json().catch(() => ({}));
        const serverCart = Array.isArray(data.cart) ? (data.cart as CartItem[]) : [];

        // Merge guest local cart into server on first login hydrate
        const byHandle = new Map<string, CartItem>();
        for (const item of serverCart) byHandle.set(item.handle, item);
        for (const item of guest) {
          if (!byHandle.has(item.handle)) byHandle.set(item.handle, item);
        }
        const merged = Array.from(byHandle.values());

        if (!cancelled) {
          skipNextPersist.current = true;
          setItems(merged);
          setHydrated(true);
          writeStoredItems([]);
          if (guest.length > 0 || merged.length !== serverCart.length) {
            await persistServerCart(merged);
          }
        }
        wasLoggedIn.current = true;
      } else {
        if (!cancelled) {
          skipNextPersist.current = true;
          setItems(wasLoggedIn.current ? [] : readStoredItems());
          setHydrated(true);
        }
        wasLoggedIn.current = false;
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  useEffect(() => {
    if (!hydrated || skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }

    if (user) {
      void persistServerCart(items);
    } else {
      writeStoredItems(items);
    }
  }, [items, hydrated, user]);

  const addItem = useCallback(
    (product: Pick<Product, "id" | "handle" | "title" | "price" | "image" | "specs">) => {
      if (!user) {
        return { ok: false as const, reason: "auth" as const };
      }

      let result: { ok: boolean; reason?: "duplicate" | "unavailable" | "auth" } = { ok: true };
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
    [user],
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

/** Guest cart snapshot for login/register merge */
export function getGuestCartSnapshot(): CartItem[] {
  return readStoredItems();
}

export function clearGuestCartStorage() {
  writeStoredItems([]);
}
