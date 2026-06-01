"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CmsPage } from "@/lib/cms/types";
import { emptyPage, emptySection } from "@/lib/cms/types";
import { AdminHeader } from "@/components/admin/admin-header";
import { SectionEditor } from "@/components/admin/section-editor";
import { Button } from "@/components/ui/button";

function slugify(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

interface PageEditorProps {
  initial?: CmsPage;
}

export function PageEditor({ initial }: PageEditorProps) {
  const router = useRouter();
  const isNew = !initial;
  const [page, setPage] = useState<CmsPage>(() =>
    initial ?? {
      ...emptyPage(),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof CmsPage>(key: K, value: CmsPage[K]) {
    setPage((p) => ({ ...p, [key]: value }));
  }

  function updateSection(index: number, section: CmsPage["sections"][0]) {
    setPage((p) => {
      const sections = [...p.sections];
      sections[index] = section;
      return { ...p, sections };
    });
  }

  function addSection() {
    setPage((p) => ({ ...p, sections: [...p.sections, emptySection("text")] }));
  }

  function removeSection(index: number) {
    setPage((p) => ({ ...p, sections: p.sections.filter((_, i) => i !== index) }));
  }

  function moveSection(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= page.sections.length) return;
    setPage((p) => {
      const sections = [...p.sections];
      [sections[index], sections[next]] = [sections[next], sections[index]];
      return { ...p, sections };
    });
  }

  async function handleSave() {
    setSaving(true);
    setError("");

    const res = await fetch(isNew ? "/api/admin/pages" : `/api/admin/pages/${page.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(page),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(data.error || "Save failed");
    }

    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this page permanently?")) return;

    const res = await fetch(`/api/admin/pages/${page.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Delete failed");
    }
  }

  return (
    <>
      <AdminHeader title={isNew ? "New page" : "Edit page"} />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Title</label>
              <input
                type="text"
                value={page.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setPage((p) => ({
                    ...p,
                    title,
                    slug: isNew && !p.slug ? slugify(title) : p.slug,
                  }));
                }}
                className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted">URL slug</label>
              <div className="flex items-center gap-1 text-sm text-muted">
                <span>/p/</span>
                <input
                  type="text"
                  value={page.slug}
                  onChange={(e) => updateField("slug", slugify(e.target.value))}
                  className="flex-1 border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                  required
                />
              </div>
            </div>
            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={page.published}
                  onChange={(e) => updateField("published", e.target.checked)}
                  className="h-4 w-4 accent-gold"
                />
                Published (visible on site)
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted">
                Meta description (optional)
              </label>
              <input
                type="text"
                value={page.description ?? ""}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-light">Content sections</h2>
              <Button type="button" variant="secondary" size="sm" onClick={addSection}>
                Add section
              </Button>
            </div>
            <div className="space-y-4">
              {page.sections.map((section, index) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  index={index}
                  onChange={(s) => updateSection(index, s)}
                  onRemove={() => removeSection(index)}
                  onMoveUp={() => moveSection(index, -1)}
                  onMoveDown={() => moveSection(index, 1)}
                  canMoveUp={index > 0}
                  canMoveDown={index < page.sections.length - 1}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex flex-wrap gap-3 border-t border-border pt-6">
            <Button type="button" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save page"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.push("/admin")}>
              Cancel
            </Button>
            {!isNew && page.published && (
              <a
                href={`/p/${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-xs text-muted hover:text-gold"
              >
                Preview live →
              </a>
            )}
            {!isNew && (
              <Button type="button" variant="ghost" size="sm" onClick={handleDelete} className="text-red-400">
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
