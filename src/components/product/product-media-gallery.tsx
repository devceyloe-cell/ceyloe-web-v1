"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, Play, X } from "lucide-react";
import { ProductVideo } from "@/components/product/product-video";
import { cn } from "@/lib/utils";

interface ProductMediaGalleryProps {
  images: string[];
  title: string;
  videoUrl?: string;
  poster?: string;
}

type MediaMode = "photo" | "video";

export function ProductMediaGallery({
  images,
  title,
  videoUrl,
  poster,
}: ProductMediaGalleryProps) {
  const galleryImages = images.length > 0 ? images : poster ? [poster] : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<MediaMode>("photo");
  const [fullscreen, setFullscreen] = useState(false);

  const hasVideo = Boolean(videoUrl);
  const videoPoster = poster ?? galleryImages[0];
  const safeIndex = Math.min(activeIndex, Math.max(galleryImages.length - 1, 0));

  const showPrev = useCallback(() => {
    if (galleryImages.length < 2) return;
    setMode("photo");
    setActiveIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  const showNext = useCallback(() => {
    if (galleryImages.length < 2) return;
    setMode("photo");
    setActiveIndex((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen, showPrev, showNext]);

  if (galleryImages.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center border border-border bg-surface-elevated text-sm text-muted">
        Image unavailable
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <div className="relative aspect-square overflow-hidden border border-border bg-surface-elevated">
          {mode === "video" && hasVideo ? (
            <ProductVideo
              variant="gallery"
              videoUrl={videoUrl}
              poster={videoPoster}
              title={title}
            />
          ) : (
            <>
              <Image
                src={galleryImages[safeIndex]}
                alt={title}
                fill
                priority
                className="object-cover object-center transition-opacity duration-300"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <button
                type="button"
                onClick={() => setFullscreen(true)}
                className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center bg-black/55 text-white transition-colors hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rich-gold"
                aria-label="Zoom image"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </>
          )}

          {mode === "photo" && galleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPrev}
                className="absolute top-1/2 left-2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-black/40 text-white/90 transition-colors hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rich-gold"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={showNext}
                className="absolute top-1/2 right-2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-black/40 text-white/90 transition-colors hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rich-gold"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {galleryImages.map((image, index) => {
            const active = mode === "photo" && index === safeIndex;
            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => {
                  setMode("photo");
                  setActiveIndex(index);
                }}
                className={cn(
                  "relative h-[72px] w-[72px] shrink-0 overflow-hidden border bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rich-gold",
                  active ? "border-rich-gold" : "border-border hover:border-rich-gold/50",
                )}
                aria-label={`View image ${index + 1}`}
                aria-current={active ? "true" : undefined}
              >
                <Image src={image} alt="" fill className="object-cover object-center" sizes="72px" />
              </button>
            );
          })}

          {hasVideo && (
            <button
              type="button"
              onClick={() => setMode("video")}
              className={cn(
                "relative flex h-[72px] w-[72px] shrink-0 flex-col items-center justify-center overflow-hidden border bg-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rich-gold",
                mode === "video" ? "border-rich-gold" : "border-border hover:border-rich-gold/50",
              )}
              aria-label="Play product video"
              aria-current={mode === "video" ? "true" : undefined}
            >
              {videoPoster && (
                <Image
                  src={videoPoster}
                  alt=""
                  fill
                  className="object-cover object-center opacity-50"
                  sizes="72px"
                />
              )}
              <Play className="relative z-[1] h-5 w-5 text-white" fill="currentColor" />
              <span className="relative z-[1] mt-1 font-manrope text-[8px] font-semibold tracking-[0.14em] text-white uppercase">
                Video
              </span>
            </button>
          )}
        </div>
      </div>

      {fullscreen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed product image"
        >
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rich-gold"
            aria-label="Close zoom"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative h-full w-full max-h-[90vh] max-w-5xl">
            <Image
              src={galleryImages[safeIndex]}
              alt={title}
              fill
              className="object-contain object-center"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
