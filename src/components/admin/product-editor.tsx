"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Gem,
  ImagePlus,
  Save,
  Star,
  Trash2,
  Upload,
  Play,
} from "lucide-react";
import { upload } from "@vercel/blob/client";
import { ceyloeBlobVideoPathname } from "@/lib/blob/config";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { PRODUCT_CATEGORIES } from "@/config/product-categories";
import {
  categoryHasSubcategories,
  getSubcategoriesForCategory,
  isValidSubcategory,
} from "@/config/product-subcategories";
import type { Product, ProductAvailability } from "@/types";
import {
  PRODUCT_AVAILABILITY_OPTIONS,
  getProductAvailability,
  withSyncedAvailability,
} from "@/lib/product-availability";
import { ProductStatusBanner } from "@/components/product/product-status-banner";
import { cn } from "@/lib/utils";

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
    currency: "AUD",
    category: "sapphires",
    image: "",
    images: [],
    featured: false,
    isNew: false,
    createdAt: new Date().toISOString(),
    specs: {},
    availability: "available",
    inStock: true,
  };
}

const SPEC_FIELDS = [
  ["carat", "Carat"],
  ["dimensions", "Dimensions"],
  ["color", "Color"],
  ["clarity", "Clarity"],
  ["cut", "Cut"],
  ["shape", "Shape"],
  ["origin", "Origin"],
  ["treatment", "Treatment"],
  ["certification", "Certification"],
  ["certificateNumber", "Certificate number"],
] as const;

interface ProductEditorProps {
  initial?: Product;
}

export function ProductEditor({ initial }: ProductEditorProps) {
  const router = useRouter();
  const isNew = !initial;
  const [product, setProduct] = useState<Product>(() => {
    if (!initial) return emptyProduct();
    return withSyncedAvailability(initial, getProductAvailability(initial));
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState("");

  const gallery = useMemo(() => {
    if (product.images.length > 0) return product.images;
    return product.image ? [product.image] : [];
  }, [product.image, product.images]);

  const subcategoryOptions = useMemo(
    () => getSubcategoriesForCategory(product.category),
    [product.category],
  );

  const previewSrc = gallery[Math.min(activeIndex, Math.max(gallery.length - 1, 0))] || "";

  function updateField<K extends keyof Product>(key: K, value: Product[K]) {
    setProduct((p) => ({ ...p, [key]: value }));
  }

  function updateCategory(nextCategory: string) {
    setProduct((p) => {
      const nextSub =
        p.subcategory && isValidSubcategory(nextCategory, p.subcategory)
          ? p.subcategory
          : undefined;
      return { ...p, category: nextCategory, subcategory: nextSub };
    });
  }

  function updateSpec(key: keyof Product["specs"], value: string) {
    setProduct((p) => ({
      ...p,
      specs: { ...p.specs, [key]: value || undefined },
    }));
  }

  function currentGallery(p: Product): string[] {
    if (p.images.length > 0) return p.images;
    return p.image ? [p.image] : [];
  }

  function setGallery(images: string[], primary?: string) {
    setProduct((p) => ({
      ...p,
      images,
      image: primary ?? images[0] ?? "",
    }));
  }

  function addGalleryImage(url: string) {
    if (!url) return;
    setProduct((p) => {
      const current = currentGallery(p);
      if (current.includes(url)) return p;
      const images = [...current, url];
      return {
        ...p,
        images,
        image: p.image || url,
      };
    });
    setActiveIndex(Number.MAX_SAFE_INTEGER);
  }

  function removeGalleryImage(index: number) {
    setProduct((p) => {
      const images = currentGallery(p).filter((_, i) => i !== index);
      return {
        ...p,
        images,
        image: images[0] ?? "",
      };
    });
    setActiveIndex((i) => Math.max(0, i - (i === index ? 1 : 0)));
  }

  function setPrimaryImage(index: number) {
    setProduct((p) => {
      const current = currentGallery(p);
      const url = current[index];
      if (!url) return p;
      const images = [url, ...current.filter((_, i) => i !== index)];
      return { ...p, images, image: url };
    });
    setActiveIndex(0);
  }

  async function uploadFile(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (res.ok && data.url) return String(data.url);
    setError(data.error || `Upload failed: ${file.name}`);
    return null;
  }

  async function uploadFiles(files: FileList | File[]) {
    setUploading(true);
    setError("");
    const list = Array.from(files);
    const uploaded: string[] = [];
    for (const file of list) {
      const url = await uploadFile(file);
      if (url) uploaded.push(url);
    }
    if (uploaded.length > 0) {
      setProduct((p) => {
        const current = currentGallery(p);
        const images = [...current];
        for (const url of uploaded) {
          if (!images.includes(url)) images.push(url);
        }
        return {
          ...p,
          images,
          image: p.image || images[0] || "",
        };
      });
      setActiveIndex(Number.MAX_SAFE_INTEGER);
    }
    setUploading(false);
  }

  async function uploadVideoFile(file: File) {
    const handle = slugify(product.handle || product.title);
    if (!handle) {
      setError("Set a title or URL handle before uploading a video.");
      return;
    }

    const type = file.type || "video/mp4";
    if (type && !["video/mp4", "video/quicktime", "video/x-mp4"].includes(type)) {
      setError("Please upload an MP4 video (or QuickTime .mov).");
      return;
    }

    setUploadingVideo(true);
    setError("");

    try {
      const pathname = ceyloeBlobVideoPathname(handle);
      const blob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload/video",
        multipart: file.size > 4 * 1024 * 1024,
        contentType: type.startsWith("video/") ? type : "video/mp4",
      });
      updateField("videoUrl", blob.url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Video upload failed";
      const blocked =
        /content security policy|refused to connect|failed to fetch|networkerror/i.test(message);
      setError(
        blocked
          ? "Video upload was blocked by the browser. Restart the dev server after the latest update, then try again."
          : message,
      );
    } finally {
      setUploadingVideo(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");

    const images = gallery;
    const payload = {
      ...product,
      handle: slugify(product.handle || product.title),
      images,
      image: product.image || images[0] || "",
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
    "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none ring-gold/30 transition focus:border-gold focus:ring-2";
  const labelClass = "mb-1.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-muted";

  return (
    <>
      <AdminHeader title={isNew ? "New product" : "Edit product"} />

      <div className="border-b border-border bg-surface/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted transition hover:bg-background hover:text-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Products
            </Link>
            <span className="hidden h-4 w-px bg-border sm:block" aria-hidden />
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">
                {product.title || (isNew ? "New product" : "Untitled")}
              </p>
              <p className="truncate text-xs text-muted">
                {product.handle ? `/products/${product.handle}` : "Set a title to generate the URL"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isNew && product.handle ? (
              <a
                href={`/products/${product.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-xs text-muted transition hover:bg-background hover:text-gold"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View live
              </a>
            ) : null}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => router.push("/admin/products")}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 pb-28">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          {/* Media column */}
          <section className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden border border-border bg-surface">
              <div className="relative aspect-square bg-background">
                {previewSrc ? (
                  <Image
                    src={previewSrc}
                    alt={product.title || "Product preview"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-muted">
                    <Gem className="h-12 w-12" />
                    <p className="text-sm">No images yet</p>
                  </div>
                )}

                <ProductStatusBanner product={product} />
                <div className="absolute left-3 top-12 z-20 flex flex-wrap gap-1.5">
                  {getProductAvailability(product) === "available" ? (
                    <span className="rounded-full bg-emerald-600/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                      Available
                    </span>
                  ) : null}
                  {product.featured ? (
                    <span className="rounded-full bg-gold/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                      Featured
                    </span>
                  ) : null}
                </div>

                {product.price > 0 ? (
                  <div className="absolute bottom-3 right-3 rounded-md bg-black/70 px-3 py-1.5 text-sm text-white backdrop-blur">
                    <Price amount={product.price} />
                  </div>
                ) : null}
              </div>

              <div className="border-t border-border p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-gold">
                      Gallery
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {gallery.length === 1 ? "1 image" : `${gallery.length} images`} · first is
                      primary
                    </p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs transition hover:border-gold">
                    <Upload className="h-3.5 w-3.5" />
                    {uploading ? "Uploading…" : "Upload images"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      disabled={uploading}
                      onChange={async (e) => {
                        if (e.target.files?.length) await uploadFiles(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>

                {gallery.length > 0 ? (
                  <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                    {gallery.map((url, index) => {
                      const isPrimary = index === 0;
                      const isActive = index === activeIndex;
                      return (
                        <li key={`${url}-${index}`} className="group/thumb relative">
                          <button
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={cn(
                              "relative aspect-square w-full overflow-hidden border bg-background transition",
                              isActive ? "border-gold ring-2 ring-gold/30" : "border-border hover:border-gold/50",
                            )}
                          >
                            <Image src={url} alt="" fill className="object-cover" sizes="96px" />
                            {index === 0 ? (
                              <span className="absolute left-1 top-1 rounded bg-gold px-1 py-0.5 text-[9px] font-semibold uppercase text-white">
                                Main
                              </span>
                            ) : null}
                          </button>
                          <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-black/55 p-1 opacity-0 transition group-hover/thumb:opacity-100">
                            {!isPrimary ? (
                              <button
                                type="button"
                                title="Set as primary"
                                onClick={() => setPrimaryImage(index)}
                                className="rounded bg-white/90 p-1 text-neutral-900 hover:bg-white"
                              >
                                <Star className="h-3 w-3" />
                              </button>
                            ) : null}
                            <button
                              type="button"
                              title="Remove"
                              onClick={() => removeGalleryImage(index)}
                              className="rounded bg-white/90 p-1 text-red-600 hover:bg-white"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                    <li>
                      <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-border text-muted transition hover:border-gold hover:text-gold">
                        <ImagePlus className="h-5 w-5" />
                        <span className="text-[10px] uppercase tracking-wider">Add</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          disabled={uploading}
                          onChange={async (e) => {
                            if (e.target.files?.length) await uploadFiles(e.target.files);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </li>
                  </ul>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-border px-4 py-10 text-center transition hover:border-gold">
                    <ImagePlus className="h-8 w-8 text-muted" />
                    <p className="text-sm text-muted">Upload product photos</p>
                    <span className="text-xs text-gold">Choose one or more files</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      disabled={uploading}
                      onChange={async (e) => {
                        if (e.target.files?.length) await uploadFiles(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>
                )}

                <GalleryUrlAdd onAdd={addGalleryImage} />
              </div>

              <div className="border-t border-border p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-gold">
                      Product video
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      Stored in Vercel Blob as{" "}
                      <code className="text-foreground">videos/{"{handle}"}.mp4</code>
                    </p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs transition hover:border-gold">
                    <Upload className="h-3.5 w-3.5" />
                    {uploadingVideo ? "Uploading…" : "Upload video"}
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime,.mp4"
                      className="hidden"
                      disabled={uploadingVideo}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) await uploadVideoFile(file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>

                {product.videoUrl ? (
                  <div className="space-y-2">
                    <div className="relative aspect-video overflow-hidden border border-border bg-black">
                      <video
                        src={product.videoUrl}
                        controls
                        playsInline
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <input
                      type="url"
                      value={product.videoUrl}
                      onChange={(e) => updateField("videoUrl", e.target.value)}
                      className={inputClass}
                      placeholder="https://….public.blob.vercel-storage.com/videos/…"
                    />
                    <button
                      type="button"
                      className="text-xs text-muted hover:text-red-500"
                      onClick={() => updateField("videoUrl", undefined)}
                    >
                      Remove video URL
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-border px-4 py-8 text-center transition hover:border-gold">
                    <Play className="h-8 w-8 text-muted" />
                    <p className="text-sm text-muted">Upload MP4 to Vercel Blob</p>
                    <span className="text-xs text-gold">Choose file</span>
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime,.mp4"
                      className="hidden"
                      disabled={uploadingVideo}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) await uploadVideoFile(file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </section>

          {/* Form column */}
          <div className="space-y-5">
            <section className="border border-border bg-surface p-5 sm:p-6">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
                Basic info
              </h2>

              <div className="mt-4 space-y-4">
                <div>
                  <label className={labelClass}>Title</label>
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
                  <label className={labelClass}>URL handle</label>
                  <div className="flex overflow-hidden rounded-md border border-border focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/30">
                    <span className="hidden shrink-0 bg-background px-3 py-2.5 text-xs text-muted sm:inline">
                      /products/
                    </span>
                    <input
                      type="text"
                      value={product.handle}
                      onChange={(e) => updateField("handle", slugify(e.target.value))}
                      className="min-w-0 flex-1 border-0 bg-background px-3 py-2.5 text-sm outline-none"
                      placeholder="natural-blue-sapphire-1-16ct"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={product.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={5}
                    className={inputClass}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Price (AUD)</label>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={product.price || ""}
                      onChange={(e) => updateField("price", Number(e.target.value))}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
                      Stone classification
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>Category (level 1)</label>
                        <select
                          value={product.category}
                          onChange={(e) => updateCategory(e.target.value)}
                          className={inputClass}
                        >
                          {PRODUCT_CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                        <p className="mt-1.5 text-xs text-muted">
                          Stone type — e.g. Sapphires, Spinel.
                        </p>
                      </div>
                      <div>
                        <label className={labelClass}>Subcategory (level 2 colour)</label>
                        {categoryHasSubcategories(product.category) ? (
                          <select
                            value={product.subcategory ?? ""}
                            onChange={(e) =>
                              updateField(
                                "subcategory",
                                e.target.value ? e.target.value : undefined,
                              )
                            }
                            className={inputClass}
                          >
                            <option value="">None</option>
                            {subcategoryOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <select disabled className={inputClass} value="">
                            <option value="">Not used for this category</option>
                          </select>
                        )}
                        <p className="mt-1.5 text-xs text-muted">
                          {categoryHasSubcategories(product.category) ? (
                            <>
                              Colour / variety — links to{" "}
                              <code className="text-foreground">
                                /catalog?category={product.category}&amp;color=
                                {product.subcategory || "…"}
                              </code>
                              . Display name (e.g. Hot Pink) stays in Color below.
                            </>
                          ) : (
                            <>Jewellery and similar categories do not use a colour subcategory.</>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Availability banner</label>
                  <select
                    value={getProductAvailability(product)}
                    onChange={(e) => {
                      const availability = e.target.value as ProductAvailability;
                      setProduct((prev) => withSyncedAvailability(prev, availability));
                    }}
                    className={inputClass}
                  >
                    {PRODUCT_AVAILABILITY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1.5 text-xs text-muted">
                    Sold out and Hold show a banner on the catalog and product page. Purchase buttons
                    are disabled for both.
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {(
                    [
                      ["featured", "Featured", Boolean(product.featured)],
                      ["isNew", "New arrival", Boolean(product.isNew)],
                    ] as const
                  ).map(([key, label, checked]) => (
                    <label
                      key={key}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-3 text-sm transition",
                        checked
                          ? "border-gold/50 bg-gold/10 text-foreground"
                          : "border-border bg-background text-muted hover:border-gold/40",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => updateField(key, e.target.checked)}
                        className="accent-[var(--gold,#b8953a)]"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </section>

            <section className="border border-border bg-surface p-5 sm:p-6">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
                Gemstone specs
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {SPEC_FIELDS.map(([key, label]) => (
                  <div key={key}>
                    <label className={labelClass}>{label}</label>
                    <input
                      type="text"
                      value={product.specs[key] ?? ""}
                      onChange={(e) => updateSpec(key, e.target.value)}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <label className={labelClass}>Certification URL</label>
                <input
                  type="text"
                  value={product.certificationUrl ?? ""}
                  onChange={(e) => updateField("certificationUrl", e.target.value)}
                  className={inputClass}
                  placeholder="https://"
                />
              </div>
            </section>

            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            {!isNew ? (
              <div className="flex items-center justify-between gap-3 border border-red-500/20 bg-red-500/5 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Delete product</p>
                  <p className="text-xs text-muted">Removes this gem from the catalog permanently.</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <p className="hidden truncate text-sm text-muted sm:block">
            {product.title || "Untitled product"}
            {product.price > 0 ? (
              <>
                {" · "}
                <span className="text-gold">
                  <Price amount={product.price} />
                </span>
              </>
            ) : null}
          </p>
          <div className="ml-auto flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => router.push("/admin/products")}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving…" : "Save product"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function GalleryUrlAdd({ onAdd }: { onAdd: (url: string) => void }) {
  const [url, setUrl] = useState("");

  return (
    <div className="mt-3 flex gap-2">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Or paste image URL"
        className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-gold/30 focus:border-gold focus:ring-2"
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => {
          onAdd(url.trim());
          setUrl("");
        }}
      >
        Add
      </Button>
    </div>
  );
}
