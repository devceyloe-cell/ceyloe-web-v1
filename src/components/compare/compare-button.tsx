"use client";

import { GitCompare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompare } from "@/components/compare/compare-provider";

interface CompareButtonProps {
  handle: string;
  className?: string;
}

export function CompareButton({ handle, className }: CompareButtonProps) {
  const { add, remove, isInCompare } = useCompare();
  const active = isInCompare(handle);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (active) remove(handle);
        else add(handle);
      }}
      className={cn(
        "inline-flex items-center gap-1.5 border px-3 py-1.5 text-[10px] uppercase tracking-widest transition-colors",
        active
          ? "border-primary bg-primary text-white"
          : "border-border text-muted hover:border-primary hover:text-primary",
        className,
      )}
    >
      <GitCompare className="h-3 w-3" />
      {active ? "Added" : "Compare"}
    </button>
  );
}
