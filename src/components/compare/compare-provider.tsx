"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "ceyloe-compare";
const MAX_COMPARE = 3;

interface CompareContextValue {
  handles: string[];
  add: (handle: string) => void;
  remove: (handle: string) => void;
  clear: () => void;
  isInCompare: (handle: string) => boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [handles, setHandles] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setHandles(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(handles));
  }, [handles]);

  const add = useCallback((handle: string) => {
    setHandles((prev) => {
      if (prev.includes(handle)) return prev;
      if (prev.length >= MAX_COMPARE) return [...prev.slice(1), handle];
      return [...prev, handle];
    });
  }, []);

  const remove = useCallback((handle: string) => {
    setHandles((prev) => prev.filter((h) => h !== handle));
  }, []);

  const clear = useCallback(() => setHandles([]), []);

  const isInCompare = useCallback((handle: string) => handles.includes(handle), [handles]);

  return (
    <CompareContext.Provider value={{ handles, add, remove, clear, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
