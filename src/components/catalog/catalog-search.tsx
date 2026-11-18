"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { formatProductSku } from "@/lib/product-sku";
import { getDiscountPercent, isOnSale } from "@/lib/pricing";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

const SEARCH_DEBOUNCE_MS = 250;
const SUGGESTION_LIMIT = 8;

type Suggestion = Pick<
  Product,
  | "id"
  | "handle"
  | "title"
  | "image"
  | "price"
  | "compareAtPrice"
  | "currency"
  | "sku"
  | "category"
  | "specs"
>;

interface CatalogSearchProps {
  initialQuery?: string;
  className?: string;
}

export function CatalogSearch({ initialQuery = "", className }: CatalogSearchProps) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [totalMatches, setTotalMatches] = useState(0);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 1) {
      setSuggestions([]);
      setTotalMatches(0);
      setLoading(false);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Search failed");
        const data = (await res.json()) as { products?: Suggestion[] };
        const products = data.products ?? [];
        setTotalMatches(products.length);
        setSuggestions(products.slice(0, SUGGESTION_LIMIT));
        setOpen(true);
        setActiveIndex(-1);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setSuggestions([]);
        setTotalMatches(0);
      } finally {
        setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function goToProduct(handle: string) {
    setOpen(false);
    setActiveIndex(-1);
    router.push(`/products/${handle}`);
  }

  function viewAllResults() {
    const trimmed = query.trim();
    setOpen(false);
    if (!trimmed) {
      router.push("/catalog");
      return;
    }
    router.push(`/catalog?search=${encodeURIComponent(trimmed)}`);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp") && suggestions.length) {
      setOpen(true);
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!suggestions.length) return;
      setOpen(true);
      setActiveIndex((i) => (i + 1) % suggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!suggestions.length) return;
      setOpen(true);
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        goToProduct(suggestions[activeIndex].handle);
        return;
      }
      viewAllResults();
    }
  }

  const showPanel = open && query.trim().length > 0;

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <label className="relative block">
        <span className="sr-only">Search gemstones</span>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (query.trim() && (suggestions.length > 0 || loading)) setOpen(true);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search by name, SKU, colour…"
          className="w-full border border-border bg-surface py-3 pr-10 pl-10 text-sm text-foreground outline-none placeholder:text-muted focus:border-foreground/30"
          autoComplete="off"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
          }
          enterKeyHint="search"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setOpen(false);
            }}
            className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-muted hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </label>

      {showPanel ? (
        <div
          id={listId}
          role="listbox"
          className="absolute top-full right-0 left-0 z-40 mt-1 max-h-[min(24rem,70vh)] overflow-auto border border-border bg-surface shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
        >
          {loading && suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted">Searching…</p>
          ) : null}

          {!loading && suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted">No gemstones match “{query.trim()}”.</p>
          ) : null}

          {suggestions.map((product, index) => {
            const sku = formatProductSku(product.sku, product.category);
            const meta = [sku, product.specs.carat ? `${product.specs.carat} ct` : null]
              .filter(Boolean)
              .join(" · ");

            return (
              <button
                key={product.id}
                id={`${listId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => goToProduct(product.handle)}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                  index === activeIndex ? "bg-background" : "hover:bg-background/80",
                )}
              >
                <span className="relative h-12 w-12 shrink-0 overflow-hidden bg-background">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-manrope text-sm font-medium text-foreground">
                    {product.title}
                  </span>
                  {meta ? (
                    <span className="mt-0.5 block truncate text-xs text-muted">{meta}</span>
                  ) : null}
                </span>
                <span className="shrink-0 text-right text-sm text-foreground">
                  {isOnSale(product) ? (
                    <span className="inline-flex flex-col items-end gap-0.5">
                      {(() => {
                        const pct = getDiscountPercent(product);
                        return pct ? (
                          <span className="rounded-sm bg-[#004B69] px-1 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase">
                            −{pct}%
                          </span>
                        ) : null;
                      })()}
                      <span className="text-xs text-muted line-through">
                        {formatPrice(product.compareAtPrice!, product.currency)}
                      </span>
                      <span className="text-rich-gold">
                        {formatPrice(product.price, product.currency)}
                      </span>
                    </span>
                  ) : (
                    formatPrice(product.price, product.currency)
                  )}
                </span>
              </button>
            );
          })}

          {totalMatches > 0 ? (
            <div className="border-t border-border">
              <Link
                href={`/catalog?search=${encodeURIComponent(query.trim())}`}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-center text-xs font-medium tracking-widest text-muted uppercase transition-colors hover:bg-background hover:text-foreground"
              >
                {totalMatches > SUGGESTION_LIMIT
                  ? `View all ${totalMatches} results`
                  : "View in catalog"}
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
