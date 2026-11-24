"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import type { GoogleReview, GoogleReviewSettings } from "@/lib/mongodb/google-reviews";
import { cn } from "@/lib/utils";

type FormState = {
  name: string;
  rating: string;
  dateLabel: string;
  text: string;
  textComplete: boolean;
  hasPhoto: boolean;
  published: boolean;
  sortOrder: string;
};

const emptyForm = (): FormState => ({
  name: "",
  rating: "5",
  dateLabel: "",
  text: "",
  textComplete: true,
  hasPhoto: false,
  published: true,
  sortOrder: "0",
});

function reviewToForm(r: GoogleReview): FormState {
  return {
    name: r.name,
    rating: String(r.rating),
    dateLabel: r.dateLabel,
    text: r.text,
    textComplete: r.textComplete,
    hasPhoto: Boolean(r.hasPhoto),
    published: r.published,
    sortOrder: String(r.sortOrder),
  };
}

export function ReviewsDashboard({ mongoConfigured }: { mongoConfigured: boolean }) {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [settings, setSettings] = useState<GoogleReviewSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [settingsForm, setSettingsForm] = useState({
    rating: "4.9",
    reviewCount: "8",
    sourceUrl: "",
  });

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/google-reviews");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not load reviews");
        setLoading(false);
        return;
      }
      setReviews(data.reviews || []);
      setSettings(data.settings || null);
      if (data.settings) {
        setSettingsForm({
          rating: String(data.settings.rating),
          reviewCount: String(data.settings.reviewCount),
          sourceUrl: data.settings.sourceUrl || "",
        });
      }
    } catch {
      setError("Could not load reviews");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (mongoConfigured) void load();
    else setLoading(false);
  }, [mongoConfigured]);

  function flash(msg: string) {
    setSuccess(msg);
    setError("");
    window.setTimeout(() => setSuccess(""), 3000);
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm());
    setShowForm(true);
  }

  function openEdit(review: GoogleReview) {
    setEditingId(review.id);
    setForm(reviewToForm(review));
    setShowForm(true);
  }

  async function saveReview() {
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      rating: Number(form.rating),
      dateLabel: form.dateLabel,
      text: form.text,
      textComplete: form.textComplete,
      hasPhoto: form.hasPhoto,
      published: form.published,
      sortOrder: Number(form.sortOrder) || 0,
    };
    try {
      const res = await fetch(
        editingId ? `/api/admin/google-reviews/${editingId}` : "/api/admin/google-reviews",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save review");
        setSaving(false);
        return;
      }
      setShowForm(false);
      setEditingId(null);
      await load();
      flash(editingId ? "Review updated" : "Review added");
    } catch {
      setError("Could not save review");
    }
    setSaving(false);
  }

  async function removeReview(id: string) {
    if (!confirm("Delete this Google review?")) return;
    const res = await fetch(`/api/admin/google-reviews/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not delete");
      return;
    }
    await load();
    flash("Review deleted");
  }

  async function saveSettings() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/google-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveSettings",
          settings: {
            ...(settings || {}),
            rating: Number(settingsForm.rating),
            reviewCount: Number(settingsForm.reviewCount),
            sourceUrl: settingsForm.sourceUrl,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save settings");
        setSaving(false);
        return;
      }
      setSettings(data.settings);
      flash("Google summary updated");
    } catch {
      setError("Could not save settings");
    }
    setSaving(false);
  }

  if (!mongoConfigured) {
    return (
      <div>
        <AdminHeader title="Reviews" />
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-sm text-muted">MongoDB is not configured.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader title="Google Reviews" />
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-gold uppercase">
              Storefront
            </p>
            <h1 className="font-display mt-1 text-2xl font-light sm:text-3xl">Google reviews</h1>
            <p className="mt-1 max-w-xl text-sm text-muted">
              Manually add reviews shown on the homepage testimonials carousel.
            </p>
          </div>
          <Button type="button" onClick={openCreate} className="gap-2 self-start">
            <Plus className="h-4 w-4" />
            Add review
          </Button>
        </div>

        {error ? (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="mb-4 inline-flex w-full items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            <CheckCircle2 className="h-4 w-4" />
            {success}
          </p>
        ) : null}

        <section className="mb-6 rounded-lg border border-border bg-surface p-4 sm:p-5">
          <h2 className="font-manrope text-sm font-semibold">Google summary</h2>
          <p className="mt-1 text-xs text-muted">
            Rating badge and “View on Google” link on the homepage.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <label className="block text-xs">
              <span className="mb-1 block text-muted">Average rating</span>
              <input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={settingsForm.rating}
                onChange={(e) => setSettingsForm((s) => ({ ...s, rating: e.target.value }))}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs">
              <span className="mb-1 block text-muted">Total reviews</span>
              <input
                type="number"
                min={0}
                step={1}
                value={settingsForm.reviewCount}
                onChange={(e) => setSettingsForm((s) => ({ ...s, reviewCount: e.target.value }))}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs sm:col-span-1">
              <span className="mb-1 block text-muted">Google URL</span>
              <input
                value={settingsForm.sourceUrl}
                onChange={(e) => setSettingsForm((s) => ({ ...s, sourceUrl: e.target.value }))}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
          </div>
          <Button type="button" className="mt-3" disabled={saving} onClick={saveSettings}>
            Save summary
          </Button>
        </section>

        {showForm ? (
          <section className="mb-6 rounded-lg border border-border bg-surface p-4 sm:p-5">
            <h2 className="font-manrope text-sm font-semibold">
              {editingId ? "Edit review" : "New review"}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block text-xs">
                <span className="mb-1 block text-muted">Name *</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-xs">
                <span className="mb-1 block text-muted">Date label</span>
                <input
                  value={form.dateLabel}
                  onChange={(e) => setForm((f) => ({ ...f, dateLabel: e.target.value }))}
                  placeholder="e.g. 2 months ago"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-xs">
                <span className="mb-1 block text-muted">Rating</span>
                <select
                  value={form.rating}
                  onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} stars
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs">
                <span className="mb-1 block text-muted">Sort order</span>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-xs sm:col-span-2">
                <span className="mb-1 block text-muted">Review text</span>
                <textarea
                  rows={4}
                  value={form.text}
                  onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.textComplete}
                  onChange={(e) => setForm((f) => ({ ...f, textComplete: e.target.checked }))}
                />
                Text is complete (no ellipsis)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                />
                Published on homepage
              </label>
            </div>
            <div className="mt-4 flex gap-2">
              <Button type="button" disabled={saving} onClick={saveReview}>
                {saving ? "Saving…" : "Save review"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </section>
        ) : null}

        {loading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : reviews.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
            <p className="text-sm text-muted">No reviews yet. Add one or reload to seed defaults.</p>
            <Button type="button" className="mt-4" onClick={openCreate}>
              Add first review
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-manrope text-sm font-semibold">{review.name}</p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                        review.published
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-neutral-100 text-neutral-600",
                      )}
                    >
                      {review.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-gold text-gold" />
                    ))}
                    <span className="ml-2 text-xs text-muted">{review.dateLabel}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">
                    {review.text || "(no text)"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(review)}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-background"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeReview(review.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
