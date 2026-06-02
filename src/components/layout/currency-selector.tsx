"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { currencyOptions } from "@/config/currencies";
import { useCurrency } from "@/contexts/currency-context";
import { cn } from "@/lib/utils";

interface CurrencySelectorProps {
  className?: string;
  compact?: boolean;
}

export function CurrencySelector({ className, compact }: CurrencySelectorProps) {
  const { currency, setCurrencyCode } = useCurrency();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-muted transition-colors hover:text-gold"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Globe className="h-3.5 w-3.5 shrink-0" />
        <span>{compact ? currency.code : `${currency.country} · ${currency.label}`}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 max-h-72 w-64 overflow-y-auto border border-border bg-surface shadow-lg"
        >
          {currencyOptions.map((option) => (
            <button
              key={option.code}
              type="button"
              role="option"
              aria-selected={option.code === currency.code}
              onClick={() => {
                setCurrencyCode(option.code);
                setOpen(false);
              }}
              className={cn(
                "flex w-full flex-col px-4 py-2.5 text-left transition-colors hover:bg-gold/5",
                option.code === currency.code && "bg-gold/10",
              )}
            >
              <span className="text-xs font-medium text-heading">{option.country}</span>
              <span className="text-[11px] text-muted">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
