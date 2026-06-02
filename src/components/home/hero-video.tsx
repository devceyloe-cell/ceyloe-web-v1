"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { env } from "@/config/env";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { HeroContent } from "@/types";

interface HeroVideoProps {
  content: HeroContent;
}

export function HeroVideo({ content }: HeroVideoProps) {
  const hasVideo = Boolean(env.hero.videoUrl);

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden">
      <div className="absolute inset-0">
        {hasVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={env.hero.posterUrl}
            className="h-full w-full object-cover"
          >
            <source src={env.hero.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${env.hero.posterUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background/70 to-transparent" />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 shimmer opacity-30" />
      </div>

      <Container className="relative z-10 pb-20 pt-32 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-sapphire-light">
            Sparkle &amp; Shine
          </p>
          <h1 className="font-display text-4xl font-light leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="gold-gradient-text">{content.headline}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {content.subheadline}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href={content.ctaHref}>
              <Button size="lg" className="w-full sm:w-auto">
                {content.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/certifications">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Certifications
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted">Scroll</span>
            <div className="h-10 w-px bg-gradient-to-b from-gold to-transparent" />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
