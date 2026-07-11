"use client";

import { Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/** Light-only site — toggle kept as a no-op placeholder for compatibility. */
export function ThemeToggle({ className }: { className?: string }) {
  return (
    <button
      type="button"
      disabled
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center border border-border bg-surface text-muted opacity-50",
        className,
      )}
      aria-label="Light theme"
      title="Light mode"
    >
      <Sun className="h-4 w-4" />
    </button>
  );
}
