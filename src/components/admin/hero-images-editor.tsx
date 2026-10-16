"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { CropUploadModal } from "@/components/admin/crop-upload-modal";
import { Button } from "@/components/ui/button";
import type { HeroImageOverrides } from "@/lib/mongodb/hero-images";

/** Aspect ratio: wide heroes (home, gemstones) = 1920:600; standard = 1920:560 */
const WIDE_ASPECT = 1920 / 600;
const STD_ASPECT = 1920 / 560;

export interface HeroPageConfig {
  key: string;
  label: string;
  pageHref: string;
  defaultImage: string;
  /** Recommended upload dimensions shown to the admin */
  dimensions: string;
  aspect: number;
}

export const HERO_PAGES: HeroPageConfig[] = [
  {
    key: "home",
    label: "Home",
    pageHref: "/",
    defaultImage: "/images/covers/hero-image.webp",
    dimensions: "1920 × 600 px",
    aspect: WIDE_ASPECT,
  },
  {
    key: "gemstones",
    label: "Gemstones",
    pageHref: "/gemstones",
    defaultImage: "/images/covers/gemstones-hero-hq.webp",
    dimensions: "1920 × 600 px",
    aspect: WIDE_ASPECT,
  },
  {
    key: "about",
    label: "Our Story / About",
    pageHref: "/about",
    defaultImage: "/images/covers/our-story.webp",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
  },
  {
    key: "contact",
    label: "Contact",
    pageHref: "/contact",
    defaultImage: "/images/covers/contact.webp",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
  },
  {
    key: "book",
    label: "Book Appointment",
    pageHref: "/book",
    defaultImage: "/images/covers/book-appointment.webp",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
  },
  {
    key: "bespoke",
    label: "Bespoke Jewellery",
    pageHref: "/custom-jewelry",
    defaultImage: "/images/covers/bespoke-jewelry.webp",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
  },
  {
    key: "journal",
    label: "Education / Journal",
    pageHref: "/journal",
    defaultImage: "/images/covers/education.webp",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
  },
  {
    key: "cart",
    label: "Cart",
    pageHref: "/cart",
    defaultImage: "/images/covers/cart.webp",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
  },
  {
    key: "fineJewellery",
    label: "Fine Jewellery",
    pageHref: "/catalog?category=jewellery",
    defaultImage: "/images/fine-jewellery/hero-jewellery.jpg",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
  },
  {
    key: "sapphires",
    label: "Sapphires",
    pageHref: "/gemstones/sapphires",
    defaultImage: "/images/covers/sapphires-hero.jpg",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
  },
  {
    key: "spinel",
    label: "Spinels",
    pageHref: "/gemstones/spinel",
    defaultImage: "/images/covers/spinels.webp",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
  },
  {
    key: "garnet",
    label: "Garnets",
    pageHref: "/gemstones/garnet",
    defaultImage: "/images/covers/garnets.webp",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
  },
  {
    key: "topaz",
    label: "Topaz",
    pageHref: "/gemstones/topaz",
    defaultImage: "/images/covers/topaz.webp",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
  },
  {
    key: "citrine",
    label: "Citrine",
    pageHref: "/gemstones/citrine",
    defaultImage: "/images/covers/citrine.webp",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
  },
  {
    key: "tourmaline",
    label: "Tourmaline",
    pageHref: "/gemstones/tourmaline",
    defaultImage: "/images/covers/other-gemstones.webp",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
  },
  {
    key: "zircon",
    label: "Zircon",
    pageHref: "/gemstones/zircon",
    defaultImage: "/images/covers/other-gemstones.webp",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
  },
  {
    key: "other",
    label: "Other Gemstones",
    pageHref: "/gemstones/other",
    defaultImage: "/images/covers/other-gemstones.webp",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
  },
];

interface HeroImagesEditorProps {
  initialOverrides: HeroImageOverrides;
}

export function HeroImagesEditor({ initialOverrides }: HeroImagesEditorProps) {
  const [overrides, setOverrides] = useState<HeroImageOverrides>(initialOverrides);
  const [activeModal, setActiveModal] = useState<HeroPageConfig | null>(null);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState("");

  async function persistOverrides(next: HeroImageOverrides) {
    setSaveStatus("saving");
    setSaveError("");
    try {
      const res = await fetch("/api/admin/hero-images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overrides: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
      setSaveStatus("error");
    }
  }

  function handleUploaded(key: string, url: string) {
    startTransition(() => {
      const next = { ...overrides, [key]: url };
      setOverrides(next);
      persistOverrides(next);
    });
  }

  function handleRemove(key: string) {
    startTransition(() => {
      const next = { ...overrides };
      delete next[key];
      setOverrides(next);
      persistOverrides(next);
    });
  }

  return (
    <>
      {/* Global save status banner */}
      {saveStatus !== "idle" && (
        <div
          className={`mb-6 rounded-none border px-4 py-3 text-sm ${
            saveStatus === "error"
              ? "border-red-300 bg-red-50 text-red-700"
              : saveStatus === "saved"
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-border bg-surface text-muted"
          }`}
        >
          {saveStatus === "saving" && "Saving…"}
          {saveStatus === "saved" && "Hero image saved successfully."}
          {saveStatus === "error" && `Error: ${saveError}`}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {HERO_PAGES.map((page) => {
          const override = overrides[page.key];
          const displayImage = override || page.defaultImage;
          const hasOverride = Boolean(override);

          return (
            <div
              key={page.key}
              className="flex flex-col border border-border bg-background transition hover:border-gold/50"
            >
              {/* Image preview */}
              <div className="relative w-full overflow-hidden bg-surface-elevated" style={{ height: "130px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayImage}
                  alt={page.label}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
                />
                {/* Override badge */}
                {hasOverride && (
                  <span className="absolute top-2 left-2 bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Custom
                  </span>
                )}
                {/* Default badge */}
                {!hasOverride && (
                  <span className="absolute top-2 left-2 bg-black/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/80">
                    Default
                  </span>
                )}
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{page.label}</h3>
                    <a
                      href={page.pageHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted hover:text-gold"
                    >
                      {page.pageHref}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  {/* Dimension badge */}
                  <span className="shrink-0 rounded-sm border border-border bg-surface-elevated px-2 py-1 text-[10px] font-semibold tabular-nums text-muted">
                    {page.dimensions}
                  </span>
                </div>

                <p className="text-[11px] text-muted leading-relaxed">
                  Upload a <strong>{page.dimensions}</strong> image for best results. The cropper
                  locks the correct aspect ratio automatically.
                </p>

                {/* Actions */}
                <div className="mt-auto flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="inline-flex flex-1 items-center justify-center gap-1.5"
                    onClick={() => setActiveModal(page)}
                    disabled={isPending}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    {hasOverride ? "Replace Image" : "Upload Image"}
                  </Button>
                  {hasOverride && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-600"
                      onClick={() => handleRemove(page.key)}
                      disabled={isPending}
                      title="Remove custom image — revert to default"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Revert
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Crop/Upload modal */}
      {activeModal && (
        <CropUploadModal
          pageLabel={activeModal.label}
          aspect={activeModal.aspect}
          onUploaded={(url) => handleUploaded(activeModal.key, url)}
          onClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
}
