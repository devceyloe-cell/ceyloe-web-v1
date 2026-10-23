"use client";

import { useEffect, useId, useState } from "react";
import { X } from "lucide-react";

const TITLE = "Certification at Ceyloe";

const BODY =
  "Every Ceyloe gemstone is accompanied by a laboratory certificate, providing independent documentation of the gemstone’s identity and characteristics and greater confidence in your purchase. For clients who would also like a GIA laboratory report, Ceyloe is happy to arrange submission to GIA upon request. The applicable GIA laboratory, handling and associated costs are payable by the customer. We are committed to transparency and are always happy to help our clients understand the information provided in their gemstone reports.";

interface CertificationPopupProps {
  /** Footer dark theme vs light (default footer). */
  variant?: "footer" | "light";
  className?: string;
}

export function CertificationPopup({
  variant = "footer",
  className = "",
}: CertificationPopupProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const triggerClass =
    variant === "footer"
      ? "inline-flex items-center gap-2 rounded border border-white/15 px-3 py-2 transition hover:border-rich-gold/60"
      : "inline-flex items-center gap-2 rounded border border-border px-3 py-2 transition hover:border-gold/60";

  const labelClass =
    variant === "footer"
      ? "font-manrope text-[10px] font-bold uppercase tracking-[0.14em] text-rich-gold"
      : "text-[10px] font-bold uppercase tracking-[0.14em] text-gold";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${triggerClass} ${className}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={labelClass}>{TITLE}</span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative max-h-[min(85vh,560px)] w-full max-w-lg overflow-y-auto border border-border bg-background p-6 shadow-xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 rounded p-1.5 text-muted transition hover:bg-surface hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-gold">
              Transparency
            </p>
            <h2
              id={titleId}
              className="mt-2 font-display text-2xl font-light tracking-tight text-foreground"
            >
              {TITLE}
            </h2>
            <p className="mt-4 font-manrope text-sm leading-relaxed text-muted">{BODY}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
