"use client";

import { useId, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import type { CatalogBounds } from "@/lib/product-utils";
import { cn } from "@/lib/utils";

interface CatalogFiltersProps {
  categories?: string[];
  colors?: string[];
  shapes?: string[];
  origins?: string[];
  bounds?: CatalogBounds | null;
}

const sortOptions = [
  { value: "", label: "Catalog order" },
  { value: "updated", label: "Recently updated" },
  { value: "newest", label: "Recently added" },
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function CatalogFilters({ bounds }: CatalogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const panelId = useId();
  const [open, setOpen] = useState(false);

  const current = {
    category: searchParams.get("category") ?? "",
    colors: searchParams.getAll("color").filter(Boolean),
    sort: searchParams.get("sort") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    minCarat: searchParams.get("minCarat") ?? "",
    maxCarat: searchParams.get("maxCarat") ?? "",
  };

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/catalog?${params.toString()}`);
  }

  function clearAll() {
    const params = new URLSearchParams();
    if (current.category) params.set("category", current.category);
    for (const color of current.colors) {
      params.append("color", color);
    }
    const qs = params.toString();
    router.push(qs ? `/catalog?${qs}` : "/catalog");
  }

  const activeCount = [
    current.minPrice,
    current.maxPrice,
    current.minCarat,
    current.maxCarat,
    current.sort,
  ].filter(Boolean).length;

  const hasFilters = activeCount > 0;

  const inputClass =
    "w-full border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-foreground/30 focus:outline-none";

  const priceMin = bounds?.minPrice;
  const priceMax = bounds?.maxPrice;
  const caratMin = bounds?.minCarat;
  const caratMax = bounds?.maxCarat;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="inline-flex flex-1 items-center justify-between gap-3 border border-border bg-surface px-4 py-3 text-left transition-colors hover:border-foreground/25"
        >
          <span className="inline-flex items-center gap-2 font-manrope text-sm font-medium text-foreground">
            <SlidersHorizontal className="h-4 w-4 text-muted" aria-hidden />
            Filters
            {activeCount > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#004B69] px-1.5 text-[11px] font-semibold text-white">
                {activeCount}
              </span>
            ) : null}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted transition-transform duration-200",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>

        {hasFilters ? (
          <button
            type="button"
            onClick={clearAll}
            className="shrink-0 inline-flex items-center gap-1 px-2 py-3 text-xs uppercase tracking-widest text-muted hover:text-gold"
            aria-label="Clear filters"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        ) : null}
      </div>

      <div
        id={panelId}
        className={cn(
          "space-y-6 border border-border bg-surface p-4 lg:border-0 lg:bg-transparent lg:p-0",
          open ? "block" : "hidden lg:block",
        )}
      >
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="hidden items-center gap-1 text-xs uppercase tracking-widest text-muted hover:text-gold lg:inline-flex"
          >
            <X className="h-3 w-3" /> Clear filters
          </button>
        )}

        <FilterGroup title="Price">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder={priceMin !== undefined ? String(priceMin) : "Min"}
              min={priceMin}
              max={priceMax}
              defaultValue={current.minPrice}
              onChange={(e) => updateParams("minPrice", e.target.value)}
              className={inputClass}
              aria-label="Minimum price"
            />
            <input
              type="number"
              placeholder={priceMax !== undefined ? String(priceMax) : "Max"}
              min={priceMin}
              max={priceMax}
              defaultValue={current.maxPrice}
              onChange={(e) => updateParams("maxPrice", e.target.value)}
              className={inputClass}
              aria-label="Maximum price"
            />
          </div>
          {priceMin !== undefined && priceMax !== undefined ? (
            <p className="mt-1.5 text-[10px] text-muted">
              {priceMin.toLocaleString()} – {priceMax.toLocaleString()}
            </p>
          ) : null}
        </FilterGroup>

        <FilterGroup title="Carat">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              step="0.01"
              placeholder={caratMin !== undefined ? String(caratMin) : "Min"}
              min={caratMin}
              max={caratMax}
              defaultValue={current.minCarat}
              onChange={(e) => updateParams("minCarat", e.target.value)}
              className={inputClass}
              aria-label="Minimum carat"
            />
            <input
              type="number"
              step="0.01"
              placeholder={caratMax !== undefined ? String(caratMax) : "Max"}
              min={caratMin}
              max={caratMax}
              defaultValue={current.maxCarat}
              onChange={(e) => updateParams("maxCarat", e.target.value)}
              className={inputClass}
              aria-label="Maximum carat"
            />
          </div>
          {caratMin !== undefined && caratMax !== undefined && caratMax > 0 ? (
            <p className="mt-1.5 text-[10px] text-muted">
              {caratMin} – {caratMax} ct
            </p>
          ) : null}
        </FilterGroup>

        <FilterGroup title="Sort By">
          <select
            value={current.sort}
            onChange={(e) => updateParams("sort", e.target.value)}
            className={inputClass}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FilterGroup>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-muted">{title}</h3>
      {children}
    </div>
  );
}
