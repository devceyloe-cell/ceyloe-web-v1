"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, Gem, Pencil, Plus, Search } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { ProductStatusBanner } from "@/components/product/product-status-banner";
import {
  availabilityLabel,
  getProductAvailability,
} from "@/lib/product-availability";
import type { Product, ProductAvailability } from "@/types";

interface ProductsDashboardProps {
  products: Product[];
  mongoConfigured: boolean;
}

type StockFilter = "all" | ProductAvailability;
type SortKey = "newest" | "title" | "price-asc" | "price-desc";

function productImage(product: Product) {
  return product.image || product.images?.[0] || "";
}

export function ProductsDashboard({ products, mongoConfigured }: ProductsDashboardProps) {
  const [seeding, setSeeding] = useState(false);
  const [syncingVideos, setSyncingVideos] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [color, setColor] = useState("all");
  const [stock, setStock] = useState<StockFilter>("all");
  const [sort, setSort] = useState<SortKey>("newest");

  async function syncVideosFromBlob() {
    setSyncingVideos(true);
    setMessage("");
    const res = await fetch("/api/admin/products/sync-videos", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setMessage(
        `Synced ${data.updated} product video URL(s) from Blob (${data.blobCount} videos in store).`,
      );
      if (data.updated > 0) window.location.reload();
    } else {
      setMessage(data.error || "Video sync failed");
    }
    setSyncingVideos(false);
  }

  async function seedFromMock() {
    setSeeding(true);
    setMessage("");
    const res = await fetch("/api/admin/products/seed", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setMessage(
        data.inserted > 0
          ? `Imported ${data.inserted} sample products.`
          : "Catalog already has products.",
      );
      window.location.reload();
    } else {
      setMessage(data.error || "Import failed");
    }
    setSeeding(false);
  }

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const colors = useMemo(() => {
    const set = new Set(
      products
        .map((p) => p.specs?.color?.trim())
        .filter((c): c is string => Boolean(c)),
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (color !== "all" && (p.specs?.color?.trim() || "") !== color) return false;
      if (stock !== "all" && getProductAvailability(p) !== stock) return false;
      if (!q) return true;
      const productColor = p.specs?.color?.toLowerCase() ?? "";
      return (
        p.title.toLowerCase().includes(q) ||
        p.handle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        productColor.includes(q)
      );
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "title":
          return a.title.localeCompare(b.title);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
        default:
          return (b.createdAt || "").localeCompare(a.createdAt || "");
      }
    });

    return list;
  }, [products, query, category, color, stock, sort]);

  const availableCount = products.filter(
    (p) => getProductAvailability(p) === "available",
  ).length;
  const soldOutCount = products.filter(
    (p) => getProductAvailability(p) === "sold_out",
  ).length;
  const holdCount = products.filter((p) => getProductAvailability(p) === "hold").length;

  return (
    <>
      <AdminHeader title="Products" />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Catalog</p>
            <h1 className="mt-1 font-display text-3xl font-light tracking-tight">Products</h1>
            <p className="mt-1 text-sm text-muted">
              Click a gem to edit · images from the catalog
              {products.length > 0 ? (
                <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
                  {products.length} total · {availableCount} available · {soldOutCount} sold
                  out · {holdCount} hold
                </span>
              ) : null}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {products.length === 0 && mongoConfigured ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={seedFromMock}
                disabled={seeding}
              >
                {seeding ? "Importing..." : "Import samples"}
              </Button>
            ) : null}
            {products.length > 0 && mongoConfigured ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={syncVideosFromBlob}
                disabled={syncingVideos}
              >
                {syncingVideos ? "Syncing videos…" : "Sync videos from Blob"}
              </Button>
            ) : null}
            <Link href="/admin/products/new">
              <Button size="sm" className="inline-flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                New product
              </Button>
            </Link>
          </div>
        </div>

        {!mongoConfigured ? (
          <div className="mb-8 border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
            Set <code className="text-foreground">MONGODB_URI</code> to enable product management. The
            catalog uses mock data until MongoDB is connected.
          </div>
        ) : null}

        {message ? <p className="mb-4 text-sm text-muted">{message}</p> : null}

        {products.length === 0 ? (
          <div className="border border-dashed border-border bg-surface/50 px-6 py-14 text-center">
            <Gem className="mx-auto h-8 w-8 text-muted" />
            <p className="mt-3 text-sm text-muted">No products yet.</p>
            <Link
              href="/admin/products/new"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-gold hover:underline"
            >
              Add your first gemstone
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-3 rounded-lg border border-border bg-surface p-3 sm:flex-row sm:items-center">
              <label className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search title, handle, category, or color…"
                  className="w-full rounded-md border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none ring-gold/40 placeholder:text-muted focus:ring-2"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none ring-gold/40 focus:ring-2"
                  aria-label="Filter by category"
                >
                  <option value="all">All categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none ring-gold/40 focus:ring-2"
                  aria-label="Filter by color"
                >
                  <option value="all">All colors</option>
                  {colors.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <select
                  value={stock}
                  onChange={(e) => setStock(e.target.value as StockFilter)}
                  className="rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none ring-gold/40 focus:ring-2"
                  aria-label="Filter by stock"
                >
                  <option value="all">All availability</option>
                  <option value="available">Available</option>
                  <option value="sold_out">Sold out</option>
                  <option value="hold">Hold</option>
                </select>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none ring-gold/40 focus:ring-2"
                  aria-label="Sort products"
                >
                  <option value="newest">Newest</option>
                  <option value="title">Title A–Z</option>
                  <option value="price-asc">Price ↑</option>
                  <option value="price-desc">Price ↓</option>
                </select>
              </div>
            </div>

            <p className="mb-4 text-xs text-muted">
              Showing {filtered.length} of {products.length}
            </p>

            {filtered.length === 0 ? (
              <div className="border border-dashed border-border bg-surface/50 px-6 py-12 text-center">
                <p className="text-sm text-muted">No products match your filters.</p>
                <button
                  type="button"
                  className="mt-3 text-sm text-gold hover:underline"
                  onClick={() => {
                    setQuery("");
                    setCategory("all");
                    setColor("all");
                    setStock("all");
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((product) => {
                  const src = productImage(product);
                  return (
                    <li
                      key={product.id}
                      className="group relative flex flex-col overflow-hidden border border-border bg-background transition hover:border-gold/60 hover:shadow-[0_12px_28px_-18px_rgba(0,0,0,0.4)]"
                    >
                      <div className="relative aspect-square overflow-hidden bg-surface">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="absolute inset-0 block"
                          aria-label={`Edit ${product.title}`}
                        >
                          {src ? (
                            <Image
                              src={src}
                              alt={product.title}
                              fill
                              className="object-cover transition duration-500 group-hover:scale-[1.03]"
                              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
                            />
                          ) : (
                            <span className="flex h-full items-center justify-center">
                              <Gem className="h-10 w-10 text-muted" />
                            </span>
                          )}
                        </Link>

                        <ProductStatusBanner product={product} />
                        <div className="pointer-events-none absolute left-2 top-12 z-10 flex flex-wrap gap-1.5">
                          {getProductAvailability(product) === "available" ? (
                            <span className="rounded-full bg-emerald-600/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                              {availabilityLabel("available")}
                            </span>
                          ) : null}
                          {product.featured ? (
                            <span className="rounded-full bg-gold/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                              Featured
                            </span>
                          ) : null}
                        </div>

                        <div className="absolute inset-x-0 bottom-0 z-10 flex gap-2 bg-gradient-to-t from-black/75 via-black/40 to-transparent p-2.5 pt-8 opacity-100 sm:translate-y-1 sm:opacity-0 sm:transition group-hover:sm:translate-y-0 group-hover:sm:opacity-100">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-white px-3 py-2 text-xs font-medium text-neutral-900"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                          <a
                            href={`/products/${product.handle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-white/15 px-3 py-2 text-xs font-medium text-white backdrop-blur hover:bg-white/25"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </a>
                        </div>
                      </div>

                      <Link
                        href={`/admin/products/${product.id}`}
                        className="flex flex-1 flex-col gap-1 border-t border-border p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
                            {product.title}
                          </p>
                          <span className="shrink-0 pt-0.5 text-gold opacity-0 transition group-hover:opacity-100">
                            <Pencil className="h-3.5 w-3.5" />
                          </span>
                        </div>
                        <p className="truncate text-[11px] uppercase tracking-[0.12em] text-muted">
                          {product.category}
                          {product.specs?.color ? ` · ${product.specs.color}` : null}
                          {product.specs?.carat ? ` · ${product.specs.carat}` : null}
                        </p>
                        <p className="mt-auto pt-1.5 text-sm font-medium text-gold">
                          <Price amount={product.price} />
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
}
