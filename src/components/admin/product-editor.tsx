"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "@/config/product-categories";
import type { Product } from "@/types";

function slugify(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function emptyProduct(): Product {
  return {
    id: "",
    handle: "",
    title: "",
    description: "",
    price: 0,
    currency: "USD",
    category: "sapphires",
    image: "",
    images: [],
    featured: false,
    isNew: false,
    createdAt: new Date().toISOString(),
    specs: {},
    inStock: true,
  };
}

interface ProductEditorProps {
  initial?: Product;
}

export function ProductEditor({ initial }: ProductEditorProps) {
  const router = useRouter();
  const isNew = !initial;
  const [product, setProduct] = useState<Product>(initial ?? emptyProduct());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof Product>(key: K, value: Product[K]) {
    setProduct((p) => ({ ...p, [key]: value }));
  }

  function updateSpec(key: keyof Product["specs"], value: string) {
    setProduct((p) => ({
      ...p,
      specs: { ...p.specs, [key]: value || undefined },
    }));
  }

  function addGalleryImage(url: string) {
    if (!url) return;
    setProduct((p) => ({
      ...p,
      images: [...p.images, url],
      image: p.image || url,
    }));
  }

  function removeGalleryImage(index: number) {
    setProduct((p) => {
      const images = p.images.filter((_, i) => i !== index);
      return { ...p, images, image: images[0] || "" };
    });
  }

  async function handleSave() {
    setSaving(true);
    setError("");

    const payload = {
      ...product,
      handle: slugify(product.handle || product.title),
      images: product.images.length > 0 ? product.images : product.image ? [product.image] : [],
      image: product.image || product.images[0] || "",
    };

    const res = await fetch(isNew ? "/api/admin/products" : `/api/admin/products/${product.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setError(data.error || "Save failed");
    }

    setSaving(false);
  }

  async function handleDelete() {
    if (!product.id || !confirm("Delete this product?")) return;

    const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Delete failed");
    }
  }

  const inputClass =
    "w-full border border-border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none";

  return (
    <>
      <AdminHeader title={isNew ? "New product" : "Edit product"} />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="space-y-8">
          <section className="space-y-4 border border-border bg-surface p-6">
            <h2 className="text-xs uppercase tracking-widest text-gold">Basic info</h2>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Title</label>
              <input
                type="text"
                value={product.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setProduct((p) => ({
                    ...p,
                    title,
                    handle: isNew || !p.handle ? slugify(title) : p.handle,
                  }));
                }}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted">URL handle</label>
              <input
                type="text"
                value={product.handle}
                onChange={(e) => updateField("handle", slugify(e.target.value))}
                className={inputClass}
                placeholder="natural-blue-sapphire-1-16ct"
              />
              <p className="mt-1 text-xs text-muted">Product page: /products/{product.handle || "..."}</p>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Description</label>
              <textarea
                value={product.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={4}
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Price (USD)</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={product.price || ""}
                  onChange={(e) => updateField("price", Number(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Category</label>
                <select
                  value={product.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className={inputClass}
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col justify-end gap-3 pt-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={product.inStock}
                    onChange={(e) => updateField("inStock", e.target.checked)}
                  />
                  In stock
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(product.featured)}
                    onChange={(e) => updateField("featured", e.target.checked)}
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(product.isNew)}
                    onChange={(e) => updateField("isNew", e.target.checked)}
                  />
                  New arrival
                </label>
              </div>
            </div>
          </section>

          <section className="space-y-4 border border-border bg-surface p-6">
            <h2 className="text-xs uppercase tracking-widest text-gold">Images</h2>

            <ImageUploadField
              label="Primary image"
              value={product.image}
              onChange={(url) => updateField("image", url)}
            />

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-muted">Gallery</p>
              {product.images.map((url, index) => (
                <div key={`${url}-${index}`} className="flex items-center gap-2">
                  <input type="text" value={url} readOnly className={`${inputClass} flex-1`} />
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeGalleryImage(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <GalleryImageAdd onAdd={addGalleryImage} />
            </div>
          </section>

          <section className="space-y-4 border border-border bg-surface p-6">
            <h2 className="text-xs uppercase tracking-widest text-gold">Gemstone specs</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["carat", "Carat"],
                  ["color", "Color"],
                  ["clarity", "Clarity"],
                  ["cut", "Cut"],
                  ["shape", "Shape"],
                  ["origin", "Origin"],
                  ["treatment", "Treatment"],
                  ["certification", "Certification"],
                  ["certificateNumber", "Certificate number"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className="mb-2 block text-xs uppercase tracking-widest text-muted">{label}</label>
                  <input
                    type="text"
                    value={product.specs[key] ?? ""}
                    onChange={(e) => updateSpec(key, e.target.value)}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted">
                Certification URL (optional)
              </label>
              <input
                type="text"
                value={product.certificationUrl ?? ""}
                onChange={(e) => updateField("certificationUrl", e.target.value)}
                className={inputClass}
              />
            </div>
          </section>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save product"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.push("/admin/products")}>
              Cancel
            </Button>
            {!isNew && (
              <Button type="button" variant="ghost" onClick={handleDelete} className="text-red-400">
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function GalleryImageAdd({ onAdd }: { onAdd: (url: string) => void }) {
  const [url, setUrl] = useState("");

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Image URL after upload"
        className="flex-1 border border-border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
      />
      <Button type="button" variant="secondary" size="sm" onClick={() => { onAdd(url); setUrl(""); }}>
        Add to gallery
      </Button>
      <label>
        <span className="inline-flex cursor-pointer items-center border border-border px-3 py-2 text-xs hover:border-gold">
          Upload
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (res.ok) onAdd(data.url);
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}
