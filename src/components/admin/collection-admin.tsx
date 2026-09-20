"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { NaturalGemstonesEditor } from "@/components/admin/natural-gemstones-editor";
import type { HomepageCollection } from "@/lib/homepage/collection";
import type { NaturalGemstonesSection } from "@/lib/gemstones/natural-categories";
import { cn } from "@/lib/utils";

type Tab = "homepage" | "natural";

interface CollectionAdminProps {
  homepage: HomepageCollection;
  natural: NaturalGemstonesSection;
  mongoConfigured: boolean;
}

export function CollectionAdmin({ homepage, natural, mongoConfigured }: CollectionAdminProps) {
  const [tab, setTab] = useState<Tab>("natural");

  return (
    <>
      <AdminHeader title="Collection" />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Site content</p>
            <h1 className="mt-1 font-display text-3xl font-light tracking-tight">Collection</h1>
            <p className="mt-1 text-sm text-muted">
              Edit Natural Gemstones photos on /gemstones and homepage circle gems
            </p>
          </div>
          <a
            href={tab === "natural" ? "/gemstones#natural-gemstones" : "/#collection"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-gold"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View on site
          </a>
        </div>

        <div className="mb-6 flex gap-1 border-b border-border">
          <button
            type="button"
            onClick={() => setTab("natural")}
            className={cn(
              "px-4 py-2.5 text-sm transition",
              tab === "natural"
                ? "border-b-2 border-gold font-medium text-gold"
                : "text-muted hover:text-foreground",
            )}
          >
            Natural Gemstones
          </button>
          <button
            type="button"
            onClick={() => setTab("homepage")}
            className={cn(
              "px-4 py-2.5 text-sm transition",
              tab === "homepage"
                ? "border-b-2 border-gold font-medium text-gold"
                : "text-muted hover:text-foreground",
            )}
          >
            Homepage circles
          </button>
        </div>

        {tab === "natural" ? (
          <NaturalGemstonesEditor initial={natural} mongoConfigured={mongoConfigured} />
        ) : (
          <CollectionEditor
            initial={homepage}
            mongoConfigured={mongoConfigured}
            embedded
          />
        )}
      </div>
    </>
  );
}
