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

type CartProduct = Pick<Product, "id" | "handle" | "title" | "price" | "image" | "specs"> & {
  images?: string[];
};

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  /** Sum of item prices (AUD/catalog currency as stored) */
  itemsTotal: number;
  /** False until guest/server cart has finished loading */
  ready: boolean;
  addItem: (product: CartProduct) => {
    ok: boolean;
    reason?: "duplicate" | "unavailable";
  };
  removeItem: (handle: string) => void;
  clearCart: () => void;
  hasItem: (handle: string) => boolean;
}

const STORAGE_KEY = "ceyloe-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

function resolveProductImage(product: CartProduct): string {
  if (typeof product.image === "string" && product.image.trim()) {
    return product.image.trim();
  }
  const fromGallery = product.images?.find((url) => typeof url === "string" && url.trim());
  return fromGallery?.trim() || "";
}

function toCartItem(product: CartProduct): CartItem {
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    price: product.price,
    image: resolveProductImage(product),
    origin: product.specs?.origin,
  };
}

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
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore quota / private mode */
  }
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
  const itemsRef = useRef<CartItem[]>([]);
  const skipNextPersist = useRef(false);
  const wasLoggedIn = useRef(false);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    async function load() {
      if (user) {
        const guest = readStoredItems();
        const res = await fetch("/api/auth/me");
        const data = await res.json().catch(() => ({}));
        const serverCart = Array.isArray(data.cart) ? (data.cart as CartItem[]) : [];

        const byHandle = new Map<string, CartItem>();
        for (const item of serverCart) byHandle.set(item.handle, item);
        for (const item of guest) {
          if (!byHandle.has(item.handle)) byHandle.set(item.handle, item);
        }
        // Keep anything added while auth was still loading
        for (const item of itemsRef.current) {
          if (!byHandle.has(item.handle)) byHandle.set(item.handle, item);
        }
        const merged = Array.from(byHandle.values());

        if (!cancelled) {
          skipNextPersist.current = true;
          itemsRef.current = merged;
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
          const stored = wasLoggedIn.current ? [] : readStoredItems();
          const byHandle = new Map<string, CartItem>();
          for (const item of stored) byHandle.set(item.handle, item);
          for (const item of itemsRef.current) {
            if (!byHandle.has(item.handle)) byHandle.set(item.handle, item);
          }
          const merged = Array.from(byHandle.values());
          skipNextPersist.current = true;
          itemsRef.current = merged;
          setItems(merged);
          setHydrated(true);
          if (!user) writeStoredItems(merged);
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

  const addItem = useCallback((product: CartProduct) => {
    if (!product?.handle) {
      return { ok: false as const, reason: "unavailable" as const };
    }

    const prev = itemsRef.current;
    if (prev.some((item) => item.handle === product.handle)) {
      return { ok: false as const, reason: "duplicate" as const };
    }

    const next = [...prev, toCartItem(product)];
    itemsRef.current = next;
    setItems(next);

    // Persist guest cart immediately so /cart sees it even if navigation is fast
    if (!user) {
      writeStoredItems(next);
    }

    return { ok: true as const };
  }, [user]);

  const removeItem = useCallback((handle: string) => {
    const next = itemsRef.current.filter((item) => item.handle !== handle);
    itemsRef.current = next;
    setItems(next);
  }, []);

  const clearCart = useCallback(() => {
    itemsRef.current = [];
    setItems([]);
  }, []);

  const hasItem = useCallback(
    (handle: string) => itemsRef.current.some((item) => item.handle === handle) ||
      items.some((item) => item.handle === handle),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount: items.length,
      itemsTotal: items.reduce((sum, item) => sum + (Number(item.price) || 0), 0),
      ready: hydrated,
      addItem,
      removeItem,
      clearCart,
      hasItem,
    }),
    [items, hydrated, addItem, removeItem, clearCart, hasItem],
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
