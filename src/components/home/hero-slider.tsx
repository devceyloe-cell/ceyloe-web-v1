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
    <section className="relative min-h-[calc(100vh-var(--site-header-height))] overflow-hidden bg-heading">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
        </motion.div>
      </AnimatePresence>

      <Container className="relative z-10 flex min-h-[calc(100vh-var(--site-header-height))] flex-col justify-end pb-16 pt-10 md:pb-24 md:pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl text-white"
          >
            <h1 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-[3.75rem]">
              {current.title}
            </h1>
            {current.highlight ? (
              <>
                <p className="mt-4 text-sm font-medium uppercase tracking-[0.2em] text-white/80">
                  {current.eyebrow}
                </p>
                <p className="font-accent mt-1 text-4xl italic leading-none text-white sm:text-5xl md:text-6xl">
                  {current.highlight}
                </p>
              </>
            ) : (
              <p className="mt-4 text-sm font-medium uppercase tracking-[0.2em] text-white/80">
                {current.eyebrow}
              </p>
            )}
            <p className="mt-6 max-w-xl text-sm font-light leading-relaxed text-white/85 sm:text-base">
              {current.subtitle}
            </p>
            <div className="mt-8">
              <Link href={current.ctaHref}>
                <Button size="lg" variant="primary">
                  {current.ctaLabel}
                </Button>
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
              className={`h-1 rounded-full transition-all ${
                i === index ? "w-8 bg-white" : "w-1 bg-white/40"
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
