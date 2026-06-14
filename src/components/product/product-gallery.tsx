"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductVideo } from "@/components/product/product-video";

interface ProductGalleryProps {
  images: string[];
  title: string;
  videoUrl?: string;
  poster?: string;
}

export function ProductGallery({ images, title, videoUrl, poster }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [mode, setMode] = useState<"photo" | "video">("photo");

  const videoPoster = poster ?? images[0];

  return (
    <>
      <div className="space-y-4">
        <div className="mb-3 flex gap-2">
          <button
            type="button"
            onClick={() => setMode("photo")}
            className={cn(
              "px-3 py-1.5 text-[10px] uppercase tracking-widest",
              mode === "photo" ? "bg-primary text-white" : "border border-border text-muted hover:text-primary",
            )}
          >
            Photos
          </button>
          <button
            type="button"
            onClick={() => setMode("video")}
            className={cn(
              "px-3 py-1.5 text-[10px] uppercase tracking-widest",
              mode === "video" ? "bg-primary text-white" : "border border-border text-muted hover:text-primary",
            )}
          >
            Video
          </button>
        </div>

        {mode === "video" ? (
          <ProductVideo variant="gallery" videoUrl={videoUrl} poster={videoPoster} title={title} />
        ) : (
          <div className="relative aspect-square overflow-hidden bg-surface-elevated">
            <Image
              src={images[activeIndex]}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <button
              type="button"
              onClick={() => setFullscreen(true)}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center bg-background/80 transition-colors hover:bg-background"
              aria-label="Full screen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        )}

        {mode === "photo" && images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative h-16 w-16 shrink-0 overflow-hidden border bg-surface-elevated",
                  activeIndex === index ? "border-foreground" : "border-border",
                )}
              >
                <Image src={image} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="absolute right-4 top-4 text-white"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative h-full w-full max-h-[90vh] max-w-5xl">
            <Image src={images[activeIndex]} alt={title} fill className="object-contain" sizes="100vw" />
          </div>
        </div>
      )}
    </>
  );
}
