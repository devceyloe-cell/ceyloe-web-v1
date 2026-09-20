"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product360ViewerProps {
  images: string[];
  title: string;
  className?: string;
}

/**
 * 360° spin using all available product gallery images as frames.
 * Drag horizontally (or autoplay) to rotate through photos.
 */
export function Product360Viewer({ images, title, className }: Product360ViewerProps) {
  const frames = images.filter(Boolean);
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const startX = useRef(0);
  const startIndex = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const frameCount = frames.length;
  const safeIndex = frameCount === 0 ? 0 : ((index % frameCount) + frameCount) % frameCount;

  useEffect(() => {
    if (!autoplay || frameCount < 2 || dragging) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % frameCount);
    }, 140);
    return () => window.clearInterval(id);
  }, [autoplay, dragging, frameCount]);

  const onPointerDown = useCallback(
    (clientX: number) => {
      if (frameCount < 2) return;
      setDragging(true);
      setAutoplay(false);
      startX.current = clientX;
      startIndex.current = safeIndex;
    },
    [frameCount, safeIndex],
  );

  const onPointerMove = useCallback(
    (clientX: number) => {
      if (!dragging || frameCount < 2) return;
      const width = containerRef.current?.clientWidth || 320;
      const delta = clientX - startX.current;
      const steps = Math.round((delta / width) * frameCount * 1.5);
      setIndex(startIndex.current - steps);
    },
    [dragging, frameCount],
  );

  const onPointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  if (frameCount === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted">
        No images for 360° view
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full cursor-grab select-none active:cursor-grabbing",
        className,
      )}
      onMouseDown={(e) => {
        e.preventDefault();
        onPointerDown(e.clientX);
      }}
      onMouseMove={(e) => onPointerMove(e.clientX)}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerUp}
      onTouchStart={(e) => onPointerDown(e.touches[0]?.clientX ?? 0)}
      onTouchMove={(e) => onPointerMove(e.touches[0]?.clientX ?? 0)}
      onTouchEnd={onPointerUp}
      role="img"
      aria-label={`${title} 360 degree view, frame ${safeIndex + 1} of ${frameCount}`}
    >
      <Image
        src={frames[safeIndex]}
        alt={`${title} — 360° frame ${safeIndex + 1}`}
        fill
        className="pointer-events-none object-cover object-center"
        sizes="(max-width: 1024px) 100vw, 55vw"
        priority
        draggable={false}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center bg-gradient-to-b from-black/50 to-transparent px-3 py-2.5">
        <span className="font-manrope text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
          360° · Drag to spin · {safeIndex + 1}/{frameCount}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/50 to-transparent px-3 py-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setAutoplay((v) => !v);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="pointer-events-auto inline-flex items-center gap-1.5 bg-white/90 px-3 py-1.5 font-manrope text-[10px] font-bold uppercase tracking-[0.14em] text-deep-navy transition hover:bg-white"
        >
          {autoplay ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Pause
            </>
          ) : (
            <>
              <RotateCcw className="h-3.5 w-3.5" />
              Auto spin
            </>
          )}
        </button>
      </div>
    </div>
  );
}
