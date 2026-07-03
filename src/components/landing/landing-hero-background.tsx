"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { landingHeroSlides } from "@/data/landing-hero-slides";

const INTERVAL_MS = 6000;
const FADE_DURATION = 1.2;

export function LandingHeroBackground() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % landingHeroSlides.length);
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {landingHeroSlides.map((slide, i) => (
        <motion.div
          key={slide.id}
          initial={false}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: FADE_DURATION, ease: "easeInOut" }}
          className="absolute inset-0"
          aria-hidden={i !== index}
        >
          {slide.images.desktop.endsWith(".png") || slide.images.desktop.endsWith(".jpg") ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={slide.images.desktop}
              alt={slide.alt}
              className="h-full w-full object-cover object-center md:object-right"
              fetchPriority={i === 0 ? "high" : "auto"}
            />
          ) : (
            <picture>
              <source media="(max-width: 767px)" srcSet={slide.images.mobile} type="image/webp" />
              <source media="(max-width: 1199px)" srcSet={slide.images.tablet} type="image/webp" />
              <source srcSet={slide.images.desktop} type="image/webp" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.images.desktop}
                alt={slide.alt}
                className="h-full w-full object-cover object-center md:object-right"
                fetchPriority={i === 0 ? "high" : "auto"}
              />
            </picture>
          )}
        </motion.div>
      ))}

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {landingHeroSlides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Show slide ${i + 1}: ${slide.alt}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all ${
              i === index ? "w-8 bg-white" : "w-1 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </>
  );
}
