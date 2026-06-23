"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import type { Product } from "@/types";

interface ProductsDashboardProps {
  products: Product[];
  mongoConfigured: boolean;
}

export function ProductsDashboard({ products, mongoConfigured }: ProductsDashboardProps) {
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState("");

  async function seedFromMock() {
    setSeeding(true);
    setMessage("");
    const res = await fetch("/api/admin/products/seed", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setMessage(data.inserted > 0 ? `Imported ${data.inserted} sample products.` : "Catalog already has products.");
      window.location.reload();
    } else {
      setMessage(data.error || "Import failed");
    }
    setSeeding(false);
  }

  return (
    <>
      <AdminHeader />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-4">
          <Link href="/admin" className="text-xs text-muted hover:text-gold">
            ← Back to admin
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-light">Gem catalog</h1>
            <p className="mt-1 text-sm text-muted">
              Manage gemstones and jewellery shown on /catalog — no Shopify required
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {products.length === 0 && mongoConfigured && (
              <Button type="button" variant="secondary" onClick={seedFromMock} disabled={seeding}>
                {seeding ? "Importing..." : "Import sample products"}
              </Button>
            )}
            <Link href="/admin/products/new">
              <Button>New product</Button>
            </Link>
          </div>
        </div>

        {!mongoConfigured && (
          <div className="mb-8 border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
            Set <code className="text-foreground">MONGODB_URI</code> in your environment to enable product
            management. The catalog will use mock data until MongoDB is connected.
          </div>
        )}

        {message && <p className="mb-4 text-sm text-muted">{message}</p>}

        {products.length === 0 ? (
          <div className="border border-dashed border-border p-12 text-center">
            <p className="text-muted">No products yet.</p>
            <Link href="/admin/products/new" className="mt-4 inline-block text-sm text-gold hover:underline">
              Add your first gemstone
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border border border-border">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex flex-wrap items-center justify-between gap-4 bg-surface px-4 py-4"
              >
                <div>
                  <p className="font-medium">{product.title}</p>
                  <p className="text-xs text-muted">
                    /products/{product.handle} · {product.category}
                    {!product.inStock && (
                      <span className="ml-2 rounded bg-surface-elevated px-2 py-0.5">Out of stock</span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-gold">
                    <Price amount={product.price} />
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/products/${product.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-xs text-muted hover:text-gold"
                  >
                    View
                  </a>
                  <Link href={`/admin/products/${product.id}`}>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
