"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  altValue?: string;
  onChange: (url: string) => void;
  onAltChange?: (alt: string) => void;
}

export function ImageUploadField({
  label,
  value,
  altValue = "",
  onChange,
  onAltChange,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (res.ok) {
      onChange(data.url);
    } else {
      setError(data.error || "Upload failed");
    }

    setUploading(false);
    e.target.value = "";
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase tracking-widest text-muted">{label}</label>
      {value && (
        <div className="relative aspect-video max-w-md overflow-hidden border border-border">
          <Image src={value} alt={altValue || "Preview"} fill className="object-cover" />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <label className="cursor-pointer">
          <span className="inline-flex items-center justify-center border border-border bg-surface-elevated px-4 py-2 text-xs transition hover:border-gold">
            {uploading ? "Uploading..." : "Upload image"}
          </span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
            Remove
          </Button>
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL"
        className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
      />
      {onAltChange && (
        <input
          type="text"
          value={altValue}
          onChange={(e) => onAltChange(e.target.value)}
          placeholder="Alt text"
          className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
        />
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
