"use client";

import Link from "next/link";
import { GitCompare, X } from "lucide-react";
import { useCompare } from "@/components/compare/compare-provider";

export function CompareBar() {
  const { handles, remove, clear } = useCompare();

  if (handles.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 border border-border bg-surface px-4 py-3 shadow-lg md:bottom-6">
      <GitCompare className="h-4 w-4" />
      <span className="text-xs uppercase tracking-widest">
        {handles.length} selected
      </span>
      <Link
        href={`/compare?handles=${handles.join(",")}`}
        className="bg-primary px-4 py-1.5 text-xs uppercase tracking-widest text-white hover:bg-gold hover:text-brand-navy"
      >
        Compare
      </Link>
      <button type="button" onClick={clear} aria-label="Clear compare">
        <X className="h-4 w-4 text-muted" />
      </button>
    </div>
  );
}
