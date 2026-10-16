"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CropUploadModalProps {
  /** Page label shown in the heading */
  pageLabel: string;
  /** Aspect ratio to lock the crop (e.g. 1920/600 for wide, 1920/560 for standard) */
  aspect: number;
  /** Callback with the uploaded image URL after successful crop + upload */
  onUploaded: (url: string) => void;
  onClose: () => void;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight,
  );
}

async function getCroppedBlob(
  image: HTMLImageElement,
  crop: PixelCrop,
  mimeType: string,
): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = Math.round(crop.width * scaleX);
  canvas.height = Math.round(crop.height * scaleY);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mimeType, 0.92));
}

export function CropUploadModal({ pageLabel, aspect, onUploaded, onClose }: CropUploadModalProps) {
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMimeType(file.type || "image/jpeg");
    setError("");
    const reader = new FileReader();
    reader.onload = () => setSrcUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    },
    [aspect],
  );

  const handleConfirm = async () => {
    if (!imgRef.current || !completedCrop) return;
    setUploading(true);
    setError("");
    try {
      const blob = await getCroppedBlob(imgRef.current, completedCrop, mimeType);
      if (!blob) throw new Error("Could not generate cropped image.");
      const ext = mimeType === "image/png" ? ".png" : mimeType === "image/webp" ? ".webp" : ".jpg";
      const file = new File([blob], `hero${ext}`, { type: mimeType });
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onUploaded(data.url);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-gold">Hero Image</p>
            <h2 className="font-display mt-0.5 text-lg font-light">{pageLabel}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center text-muted transition hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {!srcUrl ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-muted">
                Select an image to crop to the correct hero dimensions. The cropper will lock the
                aspect ratio automatically.
              </p>
              <label className="cursor-pointer">
                <span className="inline-flex items-center justify-center border border-border bg-surface-elevated px-6 py-3 text-sm transition hover:border-gold">
                  Choose Image
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={onSelectFile}
                />
              </label>
              <p className="text-xs text-muted">JPEG, PNG or WebP — max 4.5 MB</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-xs text-muted">
                Drag or resize the selection to frame your hero image. The aspect ratio is locked.
              </p>
              <div className="max-h-[50vh] overflow-auto">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  minWidth={100}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imgRef}
                    src={srcUrl}
                    alt="Crop preview"
                    onLoad={onImageLoad}
                    style={{ maxHeight: "50vh", display: "block" }}
                  />
                </ReactCrop>
              </div>
              <button
                className="text-xs text-muted underline underline-offset-2 hover:text-foreground"
                onClick={() => { setSrcUrl(null); setCrop(undefined); setCompletedCrop(undefined); }}
              >
                Choose a different image
              </button>
            </div>
          )}

          {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={!completedCrop || uploading || !srcUrl}
          >
            {uploading ? "Uploading…" : "Crop & Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
}
