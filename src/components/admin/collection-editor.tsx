"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_HOMEPAGE_COLLECTION,
  type HomepageCollection,
  type HomepageCollectionItem,
} from "@/lib/homepage/collection";

function newItem(): HomepageCollectionItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    href: "/catalog",
    image: "",
  };
}

interface CollectionEditorProps {
  initial: HomepageCollection;
  mongoConfigured: boolean;
}

export function CollectionEditor({ initial, mongoConfigured }: CollectionEditorProps) {
  const router = useRouter();
  const [collection, setCollection] = useState<HomepageCollection>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateItem(index: number, patch: Partial<HomepageCollectionItem>) {
    setCollection((c) => ({
      ...c,
      items: c.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  }

  function moveItem(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= collection.items.length) return;
    setCollection((c) => {
      const items = [...c.items];
      const [row] = items.splice(index, 1);
      items.splice(next, 0, row);
      return { ...c, items };
    });
  }

  function removeItem(index: number) {
    if (!confirm("Remove this collection item?")) return;
    setCollection((c) => ({
      ...c,
      items: c.items.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/admin/homepage-collection", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(collection),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      setCollection(data.collection);
      setMessage("Collection saved. Homepage will show the updates.");
      router.refresh();
    } else {
      setError(data.error || "Save failed");
    }
    setSaving(false);
  }

  function resetDefaults() {
    if (!confirm("Reset to the default six gem categories?")) return;
    setCollection({ ...DEFAULT_HOMEPAGE_COLLECTION, items: [...DEFAULT_HOMEPAGE_COLLECTION.items] });
  }

  const inputClass =
    "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none ring-gold/30 focus:border-gold focus:ring-2";
  const labelClass = "mb-1.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-muted";

  return (
    <>
      <AdminHeader title="Homepage collection" />
      <div className="mx-auto max-w-4xl px-4 py-8 pb-28">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Homepage</p>
            <h1 className="mt-1 font-display text-3xl font-light tracking-tight">
              Our Collection
            </h1>
            <p className="mt-1 text-sm text-muted">
              Circular gem images, captions, and links on the homepage
            </p>
          </div>
          <a
            href="/#collection"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-gold"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View on site
          </a>
        </div>

        {!mongoConfigured ? (
          <div className="mb-6 border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
            Set <code className="text-foreground">MONGODB_URI</code> to save collection changes.
          </div>
        ) : null}

        <section className="mb-6 border border-border bg-surface p-5 sm:p-6">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
            Section text
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Eyebrow</label>
              <input
                type="text"
                value={collection.eyebrow}
                onChange={(e) => setCollection((c) => ({ ...c, eyebrow: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Explore label</label>
              <input
                type="text"
                value={collection.exploreLabel}
                onChange={(e) => setCollection((c) => ({ ...c, exploreLabel: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Heading</label>
              <input
                type="text"
                value={collection.title}
                onChange={(e) => setCollection((c) => ({ ...c, title: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
            Gems ({collection.items.length})
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
              onClick={() => setCollection((c) => ({ ...c, items: [...c.items, newItem()] }))}
            >
              <Plus className="h-3.5 w-3.5" />
              Add item
            </Button>
          </div>
        </div>

        <ul className="space-y-4">
          {collection.items.map((item, index) => (
            <li key={item.id} className="border border-border bg-surface p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">
                  {item.name || `Item ${index + 1}`}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label="Move up"
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label="Move down"
                    onClick={() => moveItem(index, 1)}
                    disabled={index === collection.items.length - 1}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-400"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-[140px_1fr]">
                <div className="space-y-3">
                  <div className="relative mx-auto aspect-square w-full max-w-[140px] overflow-hidden rounded-full border border-border bg-background">
                    {item.image ? (
                      <Image src={item.image} alt={item.name || "Preview"} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted">
                        No image
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Caption</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(index, { name: e.target.value })}
                      className={inputClass}
                      placeholder="Blue Sapphire"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Link URL</label>
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => updateItem(index, { href: e.target.value })}
                      className={inputClass}
                      placeholder="/catalog?category=sapphires"
                    />
                  </div>
                  <ImageUploadField
                    label="Image"
                    value={item.image}
                    onChange={(url) => updateItem(index, { image: url })}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>

        {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
        {message ? <p className="mt-4 text-sm text-emerald-600">{message}</p> : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/admin" className="text-sm text-muted hover:text-gold">
            Back to dashboard
          </Link>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={saving || !mongoConfigured}
            className="inline-flex items-center gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Saving…" : "Save collection"}
          </Button>
        </div>
      </div>
    </>
  );
}
