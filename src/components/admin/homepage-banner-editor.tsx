"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, Plus, Save, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_HOMEPAGE_BANNER_SLIDES,
  MAX_BANNER_SLIDES,
  MIN_BANNER_SLIDES,
  validateBannerSlideCount,
  type HomepageBannerSlide,
  type HomepageBannerSlides,
} from "@/lib/homepage/banner-slides";

function newSlide(): HomepageBannerSlide {
  return {
    id: crypto.randomUUID(),
    image: "",
    alt: "",
  };
}

interface HomepageBannerEditorProps {
  initial: HomepageBannerSlides;
  mongoConfigured: boolean;
}

export function HomepageBannerEditor({
  initial,
  mongoConfigured,
}: HomepageBannerEditorProps) {
  const router = useRouter();
  const [section, setSection] = useState<HomepageBannerSlides>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateSlide(index: number, patch: Partial<HomepageBannerSlide>) {
    setSection((s) => ({
      ...s,
      slides: s.slides.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  }

  function moveSlide(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= section.slides.length) return;
    setSection((s) => {
      const slides = [...s.slides];
      const [row] = slides.splice(index, 1);
      slides.splice(next, 0, row);
      return { ...s, slides };
    });
  }

  function removeSlide(index: number) {
    if (section.slides.length <= MIN_BANNER_SLIDES) {
      setError(`Keep at least ${MIN_BANNER_SLIDES} slides.`);
      return;
    }
    if (!confirm("Remove this banner slide?")) return;
    setSection((s) => ({
      ...s,
      slides: s.slides.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setMessage("");

    const countError = validateBannerSlideCount(section.slides);
    if (countError) {
      setError(countError);
      setSaving(false);
      return;
    }

    const res = await fetch("/api/admin/homepage-banner-slides", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(section),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      setSection(data.slides);
      setMessage("Banner slides saved. Homepage hero will rotate these images.");
      router.refresh();
    } else {
      setError(data.error || "Save failed");
    }
    setSaving(false);
  }

  function resetDefaults() {
    if (!confirm("Reset to the default three banner images?")) return;
    setSection({
      ...DEFAULT_HOMEPAGE_BANNER_SLIDES,
      slides: DEFAULT_HOMEPAGE_BANNER_SLIDES.slides.map((s) => ({ ...s })),
    });
  }

  const inputClass =
    "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none ring-gold/30 focus:border-gold focus:ring-2";
  const labelClass = "mb-1.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-muted";

  return (
    <>
      <AdminHeader title="Homepage banner" />
      <div className="mx-auto max-w-4xl px-4 py-8 pb-28">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Homepage</p>
            <h1 className="mt-1 font-display text-3xl font-light tracking-tight">
              Banner slides
            </h1>
            <p className="mt-1 text-sm text-muted">
              Upload {MIN_BANNER_SLIDES}–{MAX_BANNER_SLIDES} wide images (1920×600). They rotate
              automatically on the homepage hero.
            </p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-gold"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View homepage
          </a>
        </div>

        {!mongoConfigured ? (
          <div className="mb-6 border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
            Set <code className="text-foreground">MONGODB_URI</code> to save banner slides.
          </div>
        ) : null}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
            Slides ({section.slides.length}/{MAX_BANNER_SLIDES})
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={resetDefaults}>
              Reset defaults
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="inline-flex items-center gap-1.5"
              disabled={section.slides.length >= MAX_BANNER_SLIDES}
              onClick={() =>
                setSection((s) => ({
                  ...s,
                  slides: [...s.slides, newSlide()],
                }))
              }
            >
              <Plus className="h-3.5 w-3.5" />
              Add slide
            </Button>
          </div>
        </div>

        <ul className="space-y-4">
          {section.slides.map((slide, index) => (
            <li key={slide.id} className="border border-border bg-surface p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">Slide {index + 1}</p>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label="Move up"
                    onClick={() => moveSlide(index, -1)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label="Move down"
                    onClick={() => moveSlide(index, 1)}
                    disabled={index === section.slides.length - 1}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-400"
                    onClick={() => removeSlide(index)}
                    disabled={section.slides.length <= MIN_BANNER_SLIDES}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-[220px_1fr]">
                <div className="relative aspect-[16/5] overflow-hidden border border-border bg-background">
                  {slide.image ? (
                    <Image
                      src={slide.image}
                      alt={slide.alt || `Slide ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted">
                      No image
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Alt text (optional)</label>
                    <input
                      type="text"
                      value={slide.alt ?? ""}
                      onChange={(e) => updateSlide(index, { alt: e.target.value })}
                      className={inputClass}
                      placeholder="Describe the image"
                    />
                  </div>
                  <ImageUploadField
                    label="Banner image"
                    value={slide.image}
                    onChange={(url) => updateSlide(index, { image: url })}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>

        {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
        {message ? <p className="mt-4 text-sm text-emerald-600">{message}</p> : null}

        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center justify-end gap-3 px-4 py-3">
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={saving || !mongoConfigured}
              className="inline-flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving…" : "Save banner slides"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
