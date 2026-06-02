"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Price } from "@/components/ui/price";
import type { Product } from "@/types";
import { getProductCaratWeight, getProductShape } from "@/lib/product-utils";

interface CompareTableProps {
  products: Product[];
}

export function CompareTable({ products }: CompareTableProps) {
  const rows: { label: string; render: (p: Product) => ReactNode }[] = [
    { label: "Price", render: (p) => <Price amount={p.price} /> },
    { label: "Category", render: (p) => p.category },
    { label: "Color", render: (p) => p.specs.color ?? "—" },
    { label: "Shape", render: (p) => getProductShape(p) ?? "—" },
    {
      label: "Carat",
      render: (p) => p.specs.carat ?? getProductCaratWeight(p)?.toString() ?? "—",
    },
    { label: "Clarity", render: (p) => p.specs.clarity ?? "—" },
    { label: "Origin", render: (p) => p.specs.origin ?? "—" },
    { label: "Treatment", render: (p) => p.specs.treatment ?? "—" },
    { label: "Certification", render: (p) => p.specs.certification ?? "—" },
    { label: "Availability", render: (p) => (p.inStock ? "In Stock" : "Sold Out") },
  ];

  return (
    <div className="mt-10 overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-border bg-surface p-4 text-left text-xs uppercase tracking-widest text-muted" />
            {products.map((p) => (
              <th key={p.id} className="border border-border p-4 text-left">
                <div className="relative mx-auto mb-3 aspect-square w-24 overflow-hidden bg-surface">
                  <Image src={p.image} alt={p.title} fill className="object-cover" sizes="96px" />
                </div>
                <Link href={`/products/${p.handle}`} className="font-display text-sm font-light hover:underline">
                  {p.title}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td className="border border-border bg-surface p-4 text-xs uppercase tracking-widest text-muted">
                {row.label}
              </td>
              {products.map((p) => (
                <td key={p.id} className="border border-border p-4 text-muted">
                  {row.render(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
