"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/data/faq-content";
import { returnsPolicyUrl, termsUrl } from "@/data/faq-content";

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-border border border-border">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="bg-surface">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-surface-elevated"
              aria-expanded={isOpen}
            >
              <span className="font-display text-lg font-light text-foreground sm:text-xl">
                {item.question}
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-gold transition-transform duration-300",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-base leading-relaxed text-muted">
                  {item.answer}
                  {item.id === "shipping" && (
                    <>
                      {" "}
                      <a
                        href={termsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold underline-offset-2 hover:underline"
                      >
                        Terms &amp; Conditions
                      </a>
                    </>
                  )}
                  {(item.id === "returns" || item.id === "refund") && (
                    <>
                      {" "}
                      <Link
                        href={returnsPolicyUrl}
                        className="text-gold underline-offset-2 hover:underline"
                      >
                        Returns &amp; Refunds Policy
                      </Link>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
