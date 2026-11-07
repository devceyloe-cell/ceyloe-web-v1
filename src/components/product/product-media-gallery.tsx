"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Images, Maximize2, Play, X } from "lucide-react";
import { ProductVideo } from "@/components/product/product-video";
import { ProductStatusBanner } from "@/components/product/product-status-banner";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductMediaGalleryProps {
  images: string[];
  title: string;
  videoUrl?: string;
  poster?: string;
  product?: Pick<Product, "availability" | "inStock">;
}

type MediaTab = "photos" | "video";

export function ProductMediaGallery({
  images,
  title,
  videoUrl,
  poster,
  product,
}: ProductMediaGalleryProps) {
  const galleryImages = images.length > 0 ? images : poster ? [poster] : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [tab, setTab] = useState<MediaTab>("photos");
  const [fullscreen, setFullscreen] = useState(false);

  const hasVideo = Boolean(videoUrl);
  const videoPoster = poster ?? galleryImages[0];
  const safeIndex = Math.min(activeIndex, Math.max(galleryImages.length - 1, 0));

  const showPrev = useCallback(() => {
    if (galleryImages.length < 2) return;
    setTab("photos");
    setActiveIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  const showNext = useCallback(() => {
    if (galleryImages.length < 2) return;
    setTab("photos");
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

  const tabs: { id: MediaTab; label: string; icon: typeof Images | typeof Play; show: boolean }[] = [
    { id: "photos", label: "Photos", icon: Images, show: true },
    { id: "video", label: "Video", icon: Play, show: true },
  ];

  return (
    <>
      <div className="w-full min-w-0 space-y-3">
        <div
          role="tablist"
          aria-label="Product media"
          className="flex w-full min-w-0 border border-border bg-surface-elevated"
        >
          {tabs
            .filter((t) => t.show)
            .map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 px-2 py-2.5 font-manrope text-[10px] font-bold uppercase tracking-[0.12em] transition sm:gap-2 sm:px-3 sm:text-[11px] sm:tracking-[0.14em]",
                    active
                      ? "bg-deep-navy text-white"
                      : "bg-transparent text-muted hover:bg-white hover:text-deep-navy",
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {t.label}
                </button>
              );
            })}
        </div>

        <div
          className="product-gallery-frame border border-border"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "100%",
            aspectRatio: "1 / 1",
            overflow: "hidden",
            contain: "inline-size",
          }}
        >
          {product ? <ProductStatusBanner product={product} /> : null}
          {tab === "video" ? (
            <ProductVideo
              variant="gallery"
              videoUrl={hasVideo ? videoUrl : undefined}
              poster={videoPoster}
              title={title}
            />
          ) : (
            <>
              {/* Native img: Next/Image fill paints at intrinsic size before CSS, which stretches mobile. */}
              <img
                src={galleryImages[safeIndex]}
                alt={title}
                width={800}
                height={800}
                decoding="async"
                fetchPriority="high"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              <button
                type="button"
                onClick={() => setFullscreen(true)}
                className="absolute top-3 right-3 z-20 flex h-10 w-10 items-center justify-center bg-black/55 text-white transition-colors hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rich-gold"
                aria-label="Zoom image"
              >
                <Maximize2 className="h-4 w-4" />
              </button>

              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrev}
                    className="absolute top-1/2 left-2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-black/40 text-white/90 transition-colors hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rich-gold sm:h-11 sm:w-11"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    className="absolute top-1/2 right-2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-black/40 text-white/90 transition-colors hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rich-gold sm:h-11 sm:w-11"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {tab === "photos" && (
          <div className="-mx-1 flex gap-2 overflow-x-auto overscroll-x-contain px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {galleryImages.map((image, index) => {
              const active = index === safeIndex;
              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "product-gallery-thumb h-14 w-14 shrink-0 border bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rich-gold sm:h-[72px] sm:w-[72px]",
                    active ? "border-rich-gold" : "border-border hover:border-rich-gold/50",
                  )}
                  style={{ position: "relative", overflow: "hidden" }}
                  aria-label={`View image ${index + 1}`}
                  aria-current={active ? "true" : undefined}
                >
                  <img
                    src={image}
                    alt=""
                    width={72}
                    height={72}
                    loading="lazy"
                    decoding="async"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "cover",
                    }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {fullscreen && tab === "photos" && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-black/95 p-3 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed product image"
        >
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="absolute top-3 right-3 z-10 flex h-11 w-11 items-center justify-center text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rich-gold sm:top-4 sm:right-4"
            aria-label="Close zoom"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "100%",
              height: "90dvh",
              overflow: "hidden",
            }}
          >
            <img
              src={galleryImages[safeIndex]}
              alt={title}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
