"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface CatalogFiltersProps {
  categories: string[];
}

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function CatalogFilters({ categories }: CatalogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") ?? "";
  const currentSort = searchParams.get("sort") ?? "featured";
  const currentSearch = searchParams.get("search") ?? "";

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/catalog?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          placeholder="Search gemstones..."
          defaultValue={currentSearch}
          onChange={(e) => updateParams("search", e.target.value)}
          className="w-full border border-border bg-surface py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-sapphire focus:outline-none"
        />
      </div>

      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-gold">
          Category
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => updateParams("category", "")}
            className={cn(
              "border px-4 py-2 text-xs uppercase tracking-wider transition-colors",
              !currentCategory
                ? "border-gold bg-gold/10 text-gold"
                : "border-border text-muted hover:border-gold/40 hover:text-foreground",
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => updateParams("category", cat)}
              className={cn(
                "border px-4 py-2 text-xs uppercase tracking-wider transition-colors",
                currentCategory === cat
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-border text-muted hover:border-gold/40 hover:text-foreground",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-gold">
          Sort By
        </h3>
        <select
          value={currentSort}
          onChange={(e) => updateParams("sort", e.target.value)}
          className="w-full border border-border bg-surface px-4 py-3 text-sm text-foreground focus:border-sapphire focus:outline-none"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
