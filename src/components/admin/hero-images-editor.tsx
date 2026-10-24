"use client";

import { useMemo, useState, useTransition } from "react";
import { ExternalLink, Pencil, Save, Trash2 } from "lucide-react";
import { CropUploadModal } from "@/components/admin/crop-upload-modal";
import { Button } from "@/components/ui/button";
import {
  normalizeHeroOverride,
  type HeroContentOverride,
  type HeroContentOverrides,
} from "@/lib/hero/content";
import { webCovers } from "@/config/web-covers";

const WIDE_ASPECT = 1920 / 600;
const STD_ASPECT = 1920 / 560;

export type HeroGroup = "marketing" | "gemstoneTypes" | "catalog";

export interface HeroPageConfig {
  key: string;
  label: string;
  pageHref: string;
  defaultImage: string;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultEyebrow?: string;
  dimensions: string;
  aspect: number;
  group: HeroGroup;
  note?: string;
}

function coverDefaults(
  key: keyof typeof webCovers,
  href: string,
  label: string,
  group: HeroGroup = "catalog",
): HeroPageConfig {
  const c = webCovers[key];
  return {
    key,
    label,
    pageHref: href,
    defaultImage: c.image,
    defaultTitle: c.titleLines?.join("\n") || c.title,
    defaultDescription: c.description,
    defaultEyebrow: c.eyebrow,
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
    group,
  };
}

export const HERO_PAGES: HeroPageConfig[] = [
  {
    key: "home",
    label: "Home (legacy single image)",
    pageHref: "/",
    defaultImage: "/images/covers/hero-image.webp",
    defaultTitle: "Natural Ceylon\nGemstones",
    defaultDescription:
      "Exceptional natural Ceylon gemstones sourced from Sri Lanka and curated in Australia.",
    defaultEyebrow: "Sri Lanka's Finest Treasures",
    dimensions: "1920 × 600 px",
    aspect: WIDE_ASPECT,
    group: "marketing",
    note: "Homepage slideshow is managed under Homepage Banner. This slot is optional fallback only.",
  },
  {
    key: "gemstones",
    label: "Gemstones landing",
    pageHref: "/gemstones",
    defaultImage: "/images/covers/gemstones-hero-hq.webp",
    defaultTitle: "Gemstones",
    defaultDescription: "Discover a world of rare, natural and exceptional beauty.",
    defaultEyebrow: "Explore Our",
    dimensions: "1920 × 600 px",
    aspect: WIDE_ASPECT,
    group: "marketing",
  },
  {
    key: "about",
    label: "Our Story / About",
    pageHref: "/about",
    defaultImage: "/images/covers/our-story.webp",
    defaultTitle: "Our Story",
    defaultDescription:
      "From our family mines in Sri Lanka to you in Australia. A journey of passion, heritage and trust.",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
    group: "marketing",
  },
  {
    key: "contact",
    label: "Contact",
    pageHref: "/contact",
    defaultImage: "/images/covers/contact.webp",
    defaultTitle: "Get In Touch",
    defaultDescription: "We're here to help you find the perfect gemstone.",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
    group: "marketing",
  },
  {
    key: "book",
    label: "Book Appointment",
    pageHref: "/book",
    defaultImage: "/images/covers/book-appointment.webp",
    defaultTitle: "Book Your\nAppointment",
    defaultDescription: "Experience our gemstones up close in a private setting.",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
    group: "marketing",
  },
  {
    key: "bespoke",
    label: "Bespoke Jewellery",
    pageHref: "/custom-jewelry",
    defaultImage: "/images/covers/bespoke-jewelry.webp",
    defaultTitle: "Bespoke\nJewellery",
    defaultDescription: "Your vision. Our craftsmanship. Timeless jewellery, made just for you.",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
    group: "marketing",
  },
  {
    key: "journal",
    label: "Education / Journal",
    pageHref: "/journal",
    defaultImage: "/images/covers/education.webp",
    defaultTitle: "Education",
    defaultDescription: "Learn, discover and be inspired by the world of gemstones.",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
    group: "marketing",
  },
  {
    key: "cart",
    label: "Cart",
    pageHref: "/cart",
    defaultImage: "/images/covers/cart.webp",
    defaultTitle: "Your Cart",
    defaultDescription: "Review your selected gemstones.",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
    group: "marketing",
  },
  {
    key: "fineJewellery",
    label: "Fine Jewellery",
    pageHref: "/catalog?category=jewellery",
    defaultImage: "/images/fine-jewellery/hero-jewellery.jpg",
    defaultTitle: "Fine Jewellery",
    defaultDescription: "Natural gemstones. Timeless jewellery. Ready to become yours.",
    defaultEyebrow: "Ready to Wear",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
    group: "catalog",
  },
  coverDefaults("allGemstones", "/catalog", "Catalog — All gemstones"),
  coverDefaults("allSapphires", "/catalog?category=sapphires", "Catalog — All sapphires"),
  coverDefaults(
    "blueSapphireCollection",
    "/catalog?category=sapphires&color=blue",
    "Catalog — Blue sapphires",
  ),
  coverDefaults(
    "pinkSapphires",
    "/catalog?category=sapphires&color=pink",
    "Catalog — Pink sapphires",
  ),
  coverDefaults(
    "yellowSapphires",
    "/catalog?category=sapphires&color=yellow",
    "Catalog — Yellow sapphires",
  ),
  coverDefaults(
    "tealSapphires",
    "/catalog?category=sapphires&color=teal",
    "Catalog — Teal sapphires",
  ),
  coverDefaults(
    "greenSapphires",
    "/catalog?category=sapphires&color=green",
    "Catalog — Green sapphires",
  ),
  coverDefaults(
    "greenTealSapphires",
    "/catalog?category=sapphires&color=green&color=teal",
    "Catalog — Green & Teal sapphires",
  ),
  coverDefaults(
    "whiteSapphires",
    "/catalog?category=sapphires&color=white",
    "Catalog — White sapphires",
  ),
  coverDefaults(
    "purpleSapphires",
    "/catalog?category=sapphires&color=purple",
    "Catalog — Purple sapphires",
  ),
  coverDefaults(
    "starSapphires",
    "/catalog?category=sapphires&color=star",
    "Catalog — Star sapphires",
  ),
  coverDefaults(
    "partiSapphires",
    "/catalog?category=sapphires&color=parti",
    "Catalog — Parti sapphires",
  ),
  coverDefaults(
    "padparadscha",
    "/catalog?category=sapphires&color=padparadscha",
    "Catalog — Padparadscha",
  ),
  coverDefaults("spinels", "/catalog?category=spinel", "Catalog — Spinels"),
  coverDefaults("garnets", "/catalog?category=garnet", "Catalog — Garnets"),
  coverDefaults("topaz", "/catalog?category=topaz", "Catalog — Topaz"),
  coverDefaults("citrine", "/catalog?category=citrine", "Catalog — Citrine"),
  coverDefaults("otherGemstones", "/catalog?category=other", "Catalog — Other gemstones"),
  {
    key: "sapphires",
    label: "Type — Sapphires",
    pageHref: "/gemstones/sapphires",
    defaultImage: "/images/covers/sapphires-hero.jpg",
    defaultTitle: "Sapphires",
    defaultDescription: "Explore our finest sapphire collection.",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
    group: "gemstoneTypes",
  },
  {
    key: "spinel",
    label: "Type — Spinels",
    pageHref: "/gemstones/spinel",
    defaultImage: "/images/covers/spinels.webp",
    defaultTitle: "Spinels",
    defaultDescription: "Vibrant. Rare. Remarkable.",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
    group: "gemstoneTypes",
  },
  {
    key: "garnet",
    label: "Type — Garnets",
    pageHref: "/gemstones/garnet",
    defaultImage: "/images/covers/garnets.webp",
    defaultTitle: "Garnets",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
    group: "gemstoneTypes",
  },
  {
    key: "topaz",
    label: "Type — Topaz",
    pageHref: "/gemstones/topaz",
    defaultImage: "/images/covers/topaz.webp",
    defaultTitle: "Topaz",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
    group: "gemstoneTypes",
  },
  {
    key: "citrine",
    label: "Type — Citrine",
    pageHref: "/gemstones/citrine",
    defaultImage: "/images/covers/citrine.webp",
    defaultTitle: "Citrine",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
    group: "gemstoneTypes",
  },
  {
    key: "tourmaline",
    label: "Type — Tourmaline",
    pageHref: "/gemstones/tourmaline",
    defaultImage: "/images/covers/other-gemstones.webp",
    defaultTitle: "Tourmaline",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
    group: "gemstoneTypes",
  },
  {
    key: "zircon",
    label: "Type — Zircon",
    pageHref: "/gemstones/zircon",
    defaultImage: "/images/covers/other-gemstones.webp",
    defaultTitle: "Zircon",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
    group: "gemstoneTypes",
  },
  {
    key: "other",
    label: "Type — Other gemstones",
    pageHref: "/gemstones/other",
    defaultImage: "/images/covers/other-gemstones.webp",
    defaultTitle: "Other Gemstones",
    dimensions: "1920 × 560 px",
    aspect: STD_ASPECT,
    group: "gemstoneTypes",
  },
];

const GROUP_LABELS: Record<HeroGroup, string> = {
  catalog: "Catalog & sapphire colours",
  marketing: "Marketing pages",
  gemstoneTypes: "Gemstone type landings",
};

interface HeroImagesEditorProps {
  initialOverrides: HeroContentOverrides;
}

export function HeroImagesEditor({ initialOverrides }: HeroImagesEditorProps) {
  const [overrides, setOverrides] = useState<Record<string, HeroContentOverride>>(() => {
    const next: Record<string, HeroContentOverride> = {};
    for (const [key, value] of Object.entries(initialOverrides)) {
      next[key] = normalizeHeroOverride(value);
    }
    return next;
  });
  const [drafts, setDrafts] = useState<Record<string, HeroContentOverride>>({});
  const [activeModal, setActiveModal] = useState<HeroPageConfig | null>(null);
  const [filter, setFilter] = useState<HeroGroup | "all">("catalog");
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState("");

  const pages = useMemo(
    () => (filter === "all" ? HERO_PAGES : HERO_PAGES.filter((p) => p.group === filter)),
    [filter],
  );

  function draftFor(page: HeroPageConfig): HeroContentOverride {
    return (
      drafts[page.key] ??
      overrides[page.key] ?? {
        image: undefined,
        title: page.defaultTitle,
        description: page.defaultDescription,
        eyebrow: page.defaultEyebrow,
      }
    );
  }

  function setDraft(key: string, patch: Partial<HeroContentOverride>) {
    setDrafts((d) => ({
      ...d,
      [key]: { ...normalizeHeroOverride(overrides[key]), ...d[key], ...patch },
    }));
  }

  async function persistOverrides(next: Record<string, HeroContentOverride>) {
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
      const current = { ...normalizeHeroOverride(overrides[key]), ...drafts[key], image: url };
      const next = { ...overrides, [key]: current };
      setOverrides(next);
      setDrafts((d) => ({ ...d, [key]: current }));
      persistOverrides(next);
    });
  }

  function handleSaveText(key: string) {
    startTransition(() => {
      const page = HERO_PAGES.find((p) => p.key === key);
      const draft = drafts[key] ?? overrides[key] ?? {};
      const cleaned: HeroContentOverride = {
        image: draft.image || overrides[key]?.image,
        eyebrow:
          draft.eyebrow && draft.eyebrow !== page?.defaultEyebrow ? draft.eyebrow : draft.eyebrow,
        title: draft.title,
        description: draft.description,
      };
      // Store only if different from defaults or has image
      const next = { ...overrides, [key]: cleaned };
      if (!cleaned.image && !cleaned.title && !cleaned.description && !cleaned.eyebrow) {
        delete next[key];
      }
      setOverrides(next);
      persistOverrides(next);
    });
  }

  function handleRemove(key: string) {
    startTransition(() => {
      const next = { ...overrides };
      delete next[key];
      setOverrides(next);
      setDrafts((d) => {
        const copy = { ...d };
        delete copy[key];
        return copy;
      });
      persistOverrides(next);
    });
  }

  const inputClass =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-gold/30 focus:border-gold focus:ring-2";
  const labelClass = "mb-1 block text-[10px] font-medium uppercase tracking-[0.14em] text-muted";

  return (
    <>
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
          {saveStatus === "saved" && "Hero content saved."}
          {saveStatus === "error" && `Error: ${saveError}`}
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            ["catalog", GROUP_LABELS.catalog],
            ["marketing", GROUP_LABELS.marketing],
            ["gemstoneTypes", GROUP_LABELS.gemstoneTypes],
            ["all", "All heroes"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-md border px-3 py-1.5 text-xs transition ${
              filter === value
                ? "border-gold bg-gold/10 font-medium text-gold"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {pages.map((page) => {
          const override = overrides[page.key];
          const draft = draftFor(page);
          const displayImage = draft.image || override?.image || page.defaultImage;
          const hasCustom = Boolean(override?.image || override?.title || override?.description);

          return (
            <div
              key={page.key}
              className="flex flex-col border border-border bg-background transition hover:border-gold/50"
            >
              <div className="relative w-full overflow-hidden bg-surface-elevated" style={{ height: "140px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayImage}
                  alt={page.label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                  }}
                />
                <span
                  className={`absolute left-2 top-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${
                    hasCustom ? "bg-gold" : "bg-black/50"
                  }`}
                >
                  {hasCustom ? "Custom" : "Default"}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{page.label}</h3>
                    <a
                      href={page.pageHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-flex items-center gap-1 break-all text-[11px] text-muted hover:text-gold"
                    >
                      {page.pageHref}
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                  <span className="shrink-0 rounded-sm border border-border bg-surface-elevated px-2 py-1 text-[10px] font-semibold tabular-nums text-muted">
                    {page.dimensions}
                  </span>
                </div>

                {page.note ? <p className="text-[11px] text-amber-700">{page.note}</p> : null}

                <div>
                  <label className={labelClass}>Eyebrow (optional)</label>
                  <input
                    type="text"
                    value={draft.eyebrow ?? ""}
                    onChange={(e) => setDraft(page.key, { eyebrow: e.target.value })}
                    placeholder={page.defaultEyebrow || "Optional"}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Title (new line = second line)</label>
                  <textarea
                    rows={2}
                    value={draft.title ?? ""}
                    onChange={(e) => setDraft(page.key, { title: e.target.value })}
                    placeholder={page.defaultTitle || "Title"}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Supporting text</label>
                  <textarea
                    rows={3}
                    value={draft.description ?? ""}
                    onChange={(e) => setDraft(page.key, { description: e.target.value })}
                    placeholder={page.defaultDescription || "Description"}
                    className={inputClass}
                  />
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="inline-flex items-center gap-1.5"
                    onClick={() => setActiveModal(page)}
                    disabled={isPending}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    {override?.image ? "Replace image" : "Upload image"}
                  </Button>
                  <Button
                    size="sm"
                    className="inline-flex items-center gap-1.5"
                    onClick={() => handleSaveText(page.key)}
                    disabled={isPending}
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save text
                  </Button>
                  {hasCustom ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-600"
                      onClick={() => handleRemove(page.key)}
                      disabled={isPending}
                      title="Revert to defaults"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Revert
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeModal ? (
        <CropUploadModal
          pageLabel={activeModal.label}
          aspect={activeModal.aspect}
          onUploaded={(url) => handleUploaded(activeModal.key, url)}
          onClose={() => setActiveModal(null)}
        />
      ) : null}
    </>
  );
}
