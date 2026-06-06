"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { heroSlides } from "@/data/hero-slides";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const current = heroSlides[index];

  return (
    <section className="relative min-h-[calc(85vh-var(--site-header-height))] overflow-hidden bg-transparent">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <picture>
            <source media="(max-width: 767px)" srcSet={current.images.mobile} type="image/webp" />
            <source media="(max-width: 1199px)" srcSet={current.images.tablet} type="image/webp" />
            <source srcSet={current.images.desktop} type="image/webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.images.desktop}
              alt={current.alt}
              className="h-full w-full object-cover object-center"
              fetchPriority={index === 0 ? "high" : "auto"}
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/50 to-white/20" />
        </motion.div>
      </AnimatePresence>

      <Container className="relative z-10 flex min-h-[calc(85vh-var(--site-header-height))] flex-col justify-center pb-12 pt-6 md:pb-16 md:pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-gold">
              {current.eyebrow}
            </p>
            <h1 className="font-display text-4xl font-light leading-tight tracking-tight text-heading sm:text-5xl md:text-6xl">
              {current.title}
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              {current.subtitle}
            </p>
            <div className="mt-8">
              <Link href={current.ctaHref}>
                <Button size="lg">{current.ctaLabel}</Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {heroSlides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${i + 1}: ${slide.title}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-gold" : "w-1.5 bg-heading/25"
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
