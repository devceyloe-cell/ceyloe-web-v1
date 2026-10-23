"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import type { GemstoneCategoryCard } from "@/data/gemstone-categories";
import {
  getDefaultSubcategories,
  type GemstoneTypeSubcategories,
} from "@/lib/gemstones/type-subcategories";

function newCard(): GemstoneCategoryCard {
  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    href: "/catalog",
    image: "",
    featured: false,
  };
}

interface TypeSubcategoriesEditorProps {
  initial: GemstoneTypeSubcategories;
  mongoConfigured: boolean;
}

export function TypeSubcategoriesEditor({
  initial,
  mongoConfigured,
}: TypeSubcategoriesEditorProps) {
  const router = useRouter();
  const [section, setSection] = useState<GemstoneTypeSubcategories>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateCard(index: number, patch: Partial<GemstoneCategoryCard>) {
    setSection((s) => ({
      ...s,
      cards: s.cards.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  }

  function moveCard(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= section.cards.length) return;
    setSection((s) => {
      const cards = [...s.cards];
      const [row] = cards.splice(index, 1);
      cards.splice(next, 0, row);
      return { ...s, cards };
    });
  }

  function removeCard(index: number) {
    if (!confirm("Remove this card?")) return;
    setSection((s) => ({
      ...s,
      cards: s.cards.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setMessage("");

    const res = await fetch(`/api/admin/gemstone-subcategories/${section.type}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(section),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      setSection(data.section);
      setMessage(`Saved. /gemstones/${section.type} colour cards are updated.`);
      router.refresh();
    } else {
      setError(data.error || "Save failed");
    }
    setSaving(false);
  }

  function resetDefaults() {
    if (!confirm("Reset to the default colour cards?")) return;
    const defaults = getDefaultSubcategories(section.type);
    if (!defaults) return;
    setSection({
      ...defaults,
      cards: defaults.cards.map((c) => ({ ...c })),
    });
  }

  const inputClass =
    "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none ring-gold/30 focus:border-gold focus:ring-2";
  const labelClass = "mb-1.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-muted";

  return (
    <div className="pb-24">
      {!mongoConfigured ? (
        <div className="mb-6 border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          Set <code className="text-foreground">MONGODB_URI</code> to save colour cards.
        </div>
      ) : null}

      <div className="mb-4 rounded-md border border-border bg-surface/60 px-4 py-3 text-sm text-muted">
        Path: <span className="text-foreground">Natural Gemstones</span>
        {" → "}
        <span className="text-foreground capitalize">{section.type}</span>
        {" → "}
        <span className="text-foreground">colour cards</span>
        <span className="mt-1 block text-xs">
          Change each card&apos;s title, link URL, and photo. Example: Blue →{" "}
          <code className="text-foreground">/catalog?category=sapphires&amp;color=blue</code>
          {" · "}
          multi-colour:{" "}
          <code className="text-foreground">
            /catalog?category=sapphires&amp;color=green&amp;color=teal
          </code>
        </span>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
          {section.title} ({section.cards.length})
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
            onClick={() => setSection((s) => ({ ...s, cards: [...s.cards, newCard()] }))}
          >
            <Plus className="h-3.5 w-3.5" />
            Add card
          </Button>
        </div>
      </div>

      <ul className="space-y-4">
        {section.cards.map((item, index) => (
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
                  onClick={() => moveCard(index, -1)}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Move down"
                  onClick={() => moveCard(index, 1)}
                  disabled={index === section.cards.length - 1}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-400"
                  onClick={() => removeCard(index)}
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
                      onChange={(e) => updateCard(index, { title: e.target.value })}
                      className={inputClass}
                      placeholder="Blue Sapphire"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Link URL</label>
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => updateCard(index, { href: e.target.value })}
                      className={inputClass}
                      placeholder="/catalog?category=sapphires&color=green&color=teal"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Caption / description (optional)</label>
                  <input
                    type="text"
                    value={item.description ?? ""}
                    onChange={(e) => updateCard(index, { description: e.target.value })}
                    className={inputClass}
                    placeholder="Ceylon blues…"
                  />
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={Boolean(item.featured)}
                    onChange={(e) => updateCard(index, { featured: e.target.checked })}
                  />
                  Featured (wider on some layouts)
                </label>
                <ImageUploadField
                  label="Photo"
                  value={item.image}
                  onChange={(url) => updateCard(index, { image: url })}
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
            {saving ? "Saving…" : "Save colour cards"}
          </Button>
        </div>
      </div>
    </div>
  );
}
