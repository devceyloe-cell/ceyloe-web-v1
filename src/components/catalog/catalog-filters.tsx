"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import type { CatalogBounds } from "@/lib/product-utils";

interface CatalogFiltersProps {
  categories?: string[];
  colors?: string[];
  shapes?: string[];
  origins?: string[];
  bounds?: CatalogBounds | null;
}

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Recently Added" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function CatalogFilters({ bounds }: CatalogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = {
    category: searchParams.get("category") ?? "",
    color: searchParams.get("color") ?? "",
    sort: searchParams.get("sort") ?? "featured",
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
    if (current.color) params.set("color", current.color);
    const qs = params.toString();
    router.push(qs ? `/catalog?${qs}` : "/catalog");
  }

  const hasFilters =
    Boolean(current.minPrice) ||
    Boolean(current.maxPrice) ||
    Boolean(current.minCarat) ||
    Boolean(current.maxCarat) ||
    (Boolean(current.sort) && current.sort !== "featured");

  const inputClass =
    "w-full border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-foreground/30 focus:outline-none";

  const priceMin = bounds?.minPrice;
  const priceMax = bounds?.maxPrice;
  const caratMin = bounds?.minCarat;
  const caratMax = bounds?.maxCarat;

  return (
    <div className="space-y-6">
      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-muted hover:text-gold"
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
