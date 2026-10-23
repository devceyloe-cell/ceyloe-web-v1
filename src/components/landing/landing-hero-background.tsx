"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LandingHeroBackgroundProps {
  images: string[];
  overlay?: "black" | "none";
  intervalMs?: number;
}

export function LandingHeroBackground({
  images,
  overlay = "black",
  intervalMs = 5500,
}: LandingHeroBackgroundProps) {
  const slides = images.filter(Boolean);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [slides.length, intervalMs]);

  if (slides.length === 0) return null;

  const current = slides[Math.min(index, slides.length - 1)];

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      <div className="sticky top-0 h-full w-full">
        <div className="relative h-full w-full">
          {slides.length === 1 ? (
            <Image
              src={current}
              alt=""
              fill
              priority
              quality={95}
              sizes="100vw"
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <AnimatePresence mode="sync">
              <motion.div
                key={current + index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={current}
                  alt=""
                  fill
                  priority={index === 0}
                  quality={95}
                  sizes="100vw"
                  className="h-full w-full object-cover object-center"
                />
              </motion.div>
            </AnimatePresence>
          )}

          {overlay === "black" ? (
            <div
              className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent"
              aria-hidden
            />
          ) : null}
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="pointer-events-auto absolute bottom-4 right-4 z-20 flex gap-1.5 md:bottom-6 md:right-6">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show banner image ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition sm:h-2 sm:w-2",
                i === index ? "bg-white" : "bg-white/40 hover:bg-white/70",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
