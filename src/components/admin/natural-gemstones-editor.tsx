"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import type { GemstoneCategoryCard } from "@/data/gemstone-categories";
import {
  DEFAULT_NATURAL_GEMSTONES,
  type NaturalGemstonesSection,
} from "@/lib/gemstones/natural-categories";

function newCategory(): GemstoneCategoryCard {
  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    href: "/gemstones",
    image: "",
    featured: false,
  };
}

interface NaturalGemstonesEditorProps {
  initial: NaturalGemstonesSection;
  mongoConfigured: boolean;
}

export function NaturalGemstonesEditor({
  initial,
  mongoConfigured,
}: NaturalGemstonesEditorProps) {
  const router = useRouter();
  const [section, setSection] = useState<NaturalGemstonesSection>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateCategory(index: number, patch: Partial<GemstoneCategoryCard>) {
    setSection((s) => ({
      ...s,
      categories: s.categories.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  }

  function moveCategory(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= section.categories.length) return;
    setSection((s) => {
      const categories = [...s.categories];
      const [row] = categories.splice(index, 1);
      categories.splice(next, 0, row);
      return { ...s, categories };
    });
  }

  function removeCategory(index: number) {
    if (!confirm("Remove this category card?")) return;
    setSection((s) => ({
      ...s,
      categories: s.categories.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/admin/natural-gemstones", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(section),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      setSection(data.section);
      setMessage("Saved. /gemstones Natural Gemstones section is updated.");
      router.refresh();
    } else {
      setError(data.error || "Save failed");
    }
    setSaving(false);
  }

  function resetDefaults() {
    if (!confirm("Reset to the default Natural Gemstones cards?")) return;
    setSection({
      ...DEFAULT_NATURAL_GEMSTONES,
      categories: DEFAULT_NATURAL_GEMSTONES.categories.map((c) => ({ ...c })),
    });
  }

  const inputClass =
    "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none ring-gold/30 focus:border-gold focus:ring-2";
  const labelClass = "mb-1.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-muted";

  return (
    <div className="pb-24">
      {!mongoConfigured ? (
        <div className="mb-6 border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          Set <code className="text-foreground">MONGODB_URI</code> to save Natural Gemstones.
        </div>
      ) : null}

      <section className="mb-6 border border-border bg-surface p-5 sm:p-6">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
          Section text
        </h2>
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Eyebrow</label>
              <input
                type="text"
                value={section.eyebrow}
                onChange={(e) => setSection((s) => ({ ...s, eyebrow: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Title</label>
              <input
                type="text"
                value={section.title}
                onChange={(e) => setSection((s) => ({ ...s, title: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={section.description}
              onChange={(e) => setSection((s) => ({ ...s, description: e.target.value }))}
              rows={3}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
          Category cards ({section.categories.length})
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
            onClick={() =>
              setSection((s) => ({ ...s, categories: [...s.categories, newCategory()] }))
            }
          >
            <Plus className="h-3.5 w-3.5" />
            Add card
          </Button>
        </div>
      </div>

      <ul className="space-y-4">
        {section.categories.map((item, index) => (
          <li key={item.id} className="border border-border bg-surface p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground">
                {item.title || `Card ${index + 1}`}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Move up"
                  onClick={() => moveCategory(index, -1)}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Move down"
                  onClick={() => moveCategory(index, 1)}
                  disabled={index === section.categories.length - 1}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-400"
                  onClick={() => removeCategory(index)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-[180px_1fr]">
              <div className="relative aspect-[4/3] overflow-hidden border border-border bg-background">
                {item.image ? (
                  <Image src={item.image} alt={item.title || "Preview"} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted">
                    No image
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateCategory(index, { title: e.target.value })}
                      className={inputClass}
                      placeholder="Sapphire"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Link URL</label>
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => updateCategory(index, { href: e.target.value })}
                      className={inputClass}
                      placeholder="/gemstones/sapphires"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Caption / description</label>
                  <input
                    type="text"
                    value={item.description ?? ""}
                    onChange={(e) => updateCategory(index, { description: e.target.value })}
                    className={inputClass}
                    placeholder="Ceylon blues, pinks, yellows…"
                  />
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={Boolean(item.featured)}
                    onChange={(e) => updateCategory(index, { featured: e.target.checked })}
                  />
                  Featured (wider on some layouts)
                </label>
                <ImageUploadField
                  label="Photo"
                  value={item.image}
                  onChange={(url) => updateCategory(index, { image: url })}
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
            {saving ? "Saving…" : "Save Natural Gemstones"}
          </Button>
        </div>
      </div>
    </div>
  );
}
