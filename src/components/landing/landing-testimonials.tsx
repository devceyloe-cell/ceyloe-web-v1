"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Star, Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { Testimonial } from "@/types";

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  pageUrl: string;
}

interface LandingTestimonialsProps {
  testimonials: Testimonial[];
  stats?: ReviewStats;
}

const INTERVAL_MS = 5000;
const VISIBLE_DESKTOP = 3;

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article className="flex h-full flex-col border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <Quote className="h-7 w-7 text-rich-gold/40 md:h-8 md:w-8" strokeWidth={1.25} />
      <blockquote className="font-manrope mt-5 flex-1 text-sm leading-relaxed text-white/85 md:mt-6">
        &ldquo;{item.quote}&rdquo;
      </blockquote>
      <div className="mt-6 flex gap-1 md:mt-8">
        {Array.from({ length: item.rating }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-rich-gold text-rich-gold" />
        ))}
      </div>
      <p className="font-manrope mt-4 text-xs font-bold uppercase tracking-[0.12em] text-rich-gold">
        {item.name}
      </p>
      <p className="font-manrope mt-1 text-xs text-white/50">{item.location}</p>
    </article>
  );
}

export function LandingTestimonials({ testimonials, stats }: LandingTestimonialsProps) {
  const items = testimonials.length > 0 ? testimonials : [];
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(VISIBLE_DESKTOP);

  useEffect(() => {
    const update = () => {
      setVisibleCount(window.innerWidth >= 768 ? VISIBLE_DESKTOP : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, items.length - visibleCount);

  useEffect(() => {
    if (items.length <= visibleCount) return;
    const timer = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [items.length, visibleCount, maxIndex]);

  const visible = items.slice(index, index + visibleCount);
  const padded =
    visible.length < visibleCount
      ? [...visible, ...items.slice(0, visibleCount - visible.length)]
      : visible;

  return (
    <section className="bg-black py-[var(--section-padding)] text-white">
      <Container>
        <div className="mb-12 text-center md:mb-14">
          <p className="font-manrope text-[11px] font-semibold uppercase tracking-[0.28em] text-rich-gold">
            Testimonials
          </p>
          <h2 className="font-caslon mt-4 text-4xl font-normal !text-white md:text-5xl">
            What Our Clients Say
          </h2>
          {stats ? (
            <div className="mt-5 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(stats.averageRating)
                          ? "fill-rich-gold text-rich-gold"
                          : "text-white/25"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-manrope text-sm font-semibold text-white">
                  {stats.averageRating.toFixed(1)}
                </span>
              </div>
              <p className="font-manrope text-xs text-white/55">
                Based on {stats.totalReviews} Google reviews
              </p>
              <a
                href={stats.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-manrope inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-rich-gold transition-opacity hover:opacity-80"
              >
                View on Google
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ) : null}
        </div>

        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              className="grid gap-6 md:grid-cols-3"
            >
              {padded.map((item) => (
                <TestimonialCard key={`${index}-${item.id}`} item={item} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {items.length > visibleCount && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show testimonial set ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-rich-gold" : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
