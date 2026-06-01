"use client";

import type { CmsSection, SectionType } from "@/lib/cms/types";
import { emptySection } from "@/lib/cms/types";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";

const SECTION_LABELS: Record<SectionType, string> = {
  hero: "Hero",
  text: "Text block",
  image: "Image",
  textImage: "Text + image",
};

interface SectionEditorProps {
  section: CmsSection;
  index: number;
  onChange: (section: CmsSection) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function SectionEditor({
  section,
  index,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: SectionEditorProps) {
  function update<K extends keyof CmsSection>(key: K, value: CmsSection[K]) {
    onChange({ ...section, [key]: value });
  }

  function changeType(type: SectionType) {
    onChange({ ...emptySection(type), id: section.id });
  }

  return (
    <div className="border border-border bg-surface p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs uppercase tracking-widest text-gold">
          Section {index + 1}: {SECTION_LABELS[section.type]}
        </span>
        <div className="flex flex-wrap gap-2">
          <select
            value={section.type}
            onChange={(e) => changeType(e.target.value as SectionType)}
            className="border border-border bg-background px-2 py-1 text-xs"
          >
            {(Object.keys(SECTION_LABELS) as SectionType[]).map((t) => (
              <option key={t} value={t}>
                {SECTION_LABELS[t]}
              </option>
            ))}
          </select>
          <Button type="button" variant="ghost" size="sm" onClick={onMoveUp} disabled={!canMoveUp}>
            ↑
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onMoveDown} disabled={!canMoveDown}>
            ↓
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            Remove
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {(section.type === "hero" || section.type === "text" || section.type === "textImage") && (
          <input
            type="text"
            value={section.heading ?? ""}
            onChange={(e) => update("heading", e.target.value)}
            placeholder="Heading"
            className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        )}

        {(section.type === "hero" || section.type === "text" || section.type === "textImage") && (
          <textarea
            value={section.body ?? ""}
            onChange={(e) => update("body", e.target.value)}
            placeholder="Body text (supports line breaks)"
            rows={section.type === "hero" ? 3 : 6}
            className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        )}

        {(section.type === "hero" || section.type === "image" || section.type === "textImage") && (
          <ImageUploadField
            label="Image"
            value={section.image ?? ""}
            altValue={section.imageAlt ?? ""}
            onChange={(url) => update("image", url)}
            onAltChange={(alt) => update("imageAlt", alt)}
          />
        )}

        {section.type === "textImage" && (
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Image position</label>
            <select
              value={section.imagePosition ?? "right"}
              onChange={(e) => update("imagePosition", e.target.value as "left" | "right")}
              className="border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
