"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CatalogFiltersProps {
  categories: string[];
  colors: string[];
  shapes: string[];
  origins: string[];
}

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Recently Added" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function CatalogFilters({ categories, colors, shapes, origins }: CatalogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = {
    category: searchParams.get("category") ?? "",
    color: searchParams.get("color") ?? "",
    shape: searchParams.get("shape") ?? "",
    origin: searchParams.get("origin") ?? "",
    sort: searchParams.get("sort") ?? "featured",
    search: searchParams.get("search") ?? "",
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
    router.push("/catalog");
  }

  const hasFilters = Object.entries(current).some(
    ([k, v]) => v && k !== "sort" && v !== "featured",
  );

  const inputClass =
    "w-full border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-foreground/30 focus:outline-none";

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          placeholder="Search gemstones..."
          defaultValue={current.search}
          onChange={(e) => updateParams("search", e.target.value)}
          className="w-full border border-border bg-surface py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-foreground/30 focus:outline-none"
        />
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-muted hover:text-gold"
        >
          <X className="h-3 w-3" /> Clear filters
        </button>
      )}

      <FilterGroup title="Category">
        <FilterPills
          options={[{ value: "", label: "All" }, ...categories.map((c) => ({ value: c, label: c }))]}
          current={current.category}
          onChange={(v) => updateParams("category", v)}
        />
      </FilterGroup>

      <FilterGroup title="Color">
        <FilterPills
          options={[{ value: "", label: "All" }, ...colors.map((c) => ({ value: c, label: c }))]}
          current={current.color}
          onChange={(v) => updateParams("color", v)}
        />
      </FilterGroup>

      <FilterGroup title="Shape">
        <FilterPills
          options={[{ value: "", label: "All" }, ...shapes.map((s) => ({ value: s, label: s }))]}
          current={current.shape}
          onChange={(v) => updateParams("shape", v)}
        />
      </FilterGroup>

      <FilterGroup title="Origin">
        <FilterPills
          options={[{ value: "", label: "All" }, ...origins.map((o) => ({ value: o, label: o }))]}
          current={current.origin}
          onChange={(v) => updateParams("origin", v)}
        />
      </FilterGroup>

      <FilterGroup title="Price (USD)">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={current.minPrice}
            onChange={(e) => updateParams("minPrice", e.target.value)}
            className={inputClass}
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={current.maxPrice}
            onChange={(e) => updateParams("maxPrice", e.target.value)}
            className={inputClass}
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Carat">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            step="0.01"
            placeholder="Min"
            defaultValue={current.minCarat}
            onChange={(e) => updateParams("minCarat", e.target.value)}
            className={inputClass}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Max"
            defaultValue={current.maxCarat}
            onChange={(e) => updateParams("maxCarat", e.target.value)}
            className={inputClass}
          />
        </div>
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

function FilterPills({
  options,
  current,
  onChange,
}: {
  options: { value: string; label: string }[];
  current: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value || "all"}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "border px-3 py-1.5 text-[11px] uppercase tracking-wider transition-colors",
            current === opt.value
              ? "border-primary bg-primary text-white"
              : "border-border text-muted hover:border-primary/40 hover:text-primary",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
