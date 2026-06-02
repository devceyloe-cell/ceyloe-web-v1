"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/catalog/product-card";
import type { Product } from "@/types";

const inputClass =
  "w-full border border-border bg-surface px-4 py-3 text-sm focus:border-foreground/30 focus:outline-none";

interface RecommendWizardProps {
  colors: string[];
  shapes: string[];
}

export function RecommendWizard({ colors, shapes }: RecommendWizardProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ products: Product[]; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budget: form.get("budget") ? Number(form.get("budget")) : undefined,
          color: form.get("color") || undefined,
          shape: form.get("shape") || undefined,
          minCarat: form.get("minCarat") ? Number(form.get("minCarat")) : undefined,
          occasion: form.get("occasion") || undefined,
        }),
      });
      const data = await res.json();
      setResults(data);
    } catch {
      setResults(null);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="space-y-5 border border-border bg-surface-elevated p-6 md:p-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <h2 className="font-display text-xl font-light">Tell us what you&apos;re looking for</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Budget (USD)</label>
            <input name="budget" type="number" className={inputClass} placeholder="e.g. 3000" />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Occasion</label>
            <select name="occasion" className={inputClass}>
              <option value="">Any</option>
              <option value="engagement">Engagement</option>
              <option value="anniversary">Anniversary</option>
              <option value="investment">Investment</option>
              <option value="gift">Gift</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Preferred Color</label>
            <select name="color" className={inputClass}>
              <option value="">Any</option>
              {colors.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Preferred Shape</label>
            <select name="shape" className={inputClass}>
              <option value="">Any</option>
              {shapes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Minimum Carat</label>
            <input name="minCarat" type="number" step="0.01" className={inputClass} placeholder="e.g. 1.0" />
          </div>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Analysing..." : "Get AI Recommendations"}
        </Button>
      </form>

      {results && (
        <div>
          <p className="mb-6 text-sm leading-relaxed text-muted">{results.message}</p>
          {results.products.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {results.products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <Link href="/catalog" className="text-sm underline">Browse full catalog</Link>
          )}
        </div>
      )}
    </div>
  );
}
