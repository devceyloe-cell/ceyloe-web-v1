"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Play, X } from "lucide-react";
import { AboutContainer } from "@/components/about/about-container";
import { FadeIn, Stagger, StaggerItem } from "@/components/about/fade-in";
import { SectionTitle } from "@/components/about/section-title";
import { aboutJourney } from "@/data/about-content";

function JourneyVideo() {
  const [playing, setPlaying] = useState(false);
  const { src, poster, caption } = aboutJourney.video;

  return (
    <FadeIn delay={0.08}>
      <figure className="overflow-hidden">
        <div className="relative aspect-[16/9] bg-neutral-900">
          {playing ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={src}
              poster={poster}
              controls
              autoPlay
              playsInline
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B3C] focus-visible:ring-offset-2"
              aria-label="Play journey video"
            >
              <Image
                src={poster}
                alt={caption}
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.02]"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-[#004B69] shadow-lg transition group-hover:scale-105">
                  <Play className="ml-0.5 h-6 w-6 fill-current" />
                </span>
              </span>
              <span className="absolute bottom-4 left-4 right-4 font-manrope text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 md:bottom-5 md:left-5">
                Watch the journey
              </span>
            </button>
          )}
        </div>
        <figcaption className="font-manrope mt-2.5 text-[12px] leading-relaxed text-[#777]">
          {caption}
        </figcaption>
      </figure>
    </FadeIn>
  );
}

function JourneyLightbox({
  index,
  onClose,
  onPrev,
  onNext,
}: {
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const gallery = aboutJourney.gallery;
  const photo = gallery[index];

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onPrev, onNext]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center text-white transition hover:text-[#C89B3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B3C]"
        aria-label="Close zoom"
      >
        <X className="h-6 w-6" />
      </button>

      {gallery.length > 1 ? (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white/90 transition hover:text-white md:left-4"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white/90 transition hover:text-white md:right-4"
            aria-label="Next photo"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </>
      ) : null}

      <div
        className="relative h-full w-full max-h-[88vh] max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          className="object-contain object-center"
          sizes="100vw"
          priority
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-5 text-center">
        {photo.caption ? (
          <p className="font-manrope text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">
            {photo.caption}
          </p>
        ) : null}
        <p className="font-manrope mt-1 text-[11px] text-white/50">
          {index + 1} / {gallery.length}
        </p>
      </div>
    </div>
  );
}

export function AboutJourney() {
  const gallery = aboutJourney.gallery;
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);

  const closeZoom = useCallback(() => setZoomIndex(null), []);
  const showPrev = useCallback(() => {
    setZoomIndex((i) => (i === null ? i : (i - 1 + gallery.length) % gallery.length));
  }, [gallery.length]);
  const showNext = useCallback(() => {
    setZoomIndex((i) => (i === null ? i : (i + 1) % gallery.length));
  }, [gallery.length]);

  return (
    <section
      id="our-journey"
      className="scroll-mt-28 bg-[#F8F6F2] py-10 md:py-14 lg:py-16"
      aria-labelledby="journey-heading"
    >
      <AboutContainer>
        <FadeIn>
          <SectionTitle as="h2" id="journey-heading" title={aboutJourney.title} />
          <p className="font-manrope mt-4 max-w-2xl text-[14px] leading-[1.65] text-[#555555] md:text-[15px]">
            {aboutJourney.description}
          </p>
        </FadeIn>

        <div className="mt-8 md:mt-10">
          <JourneyVideo />
        </div>

        <FadeIn delay={0.04} className="mt-10 md:mt-12">
          <p className="font-manrope text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C89B3C]">
            From pit to palm
          </p>
          <p className="font-manrope mt-2 max-w-xl text-[14px] leading-relaxed text-[#555]">
            Real moments from our mines in Sri Lanka — the labour, the wash, and the first glimpse
            of a stone. Click any photo to zoom.
          </p>
        </FadeIn>

        <Stagger className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 md:gap-3">
          {gallery.map((photo, index) => (
            <StaggerItem key={photo.src}>
              <button
                type="button"
                onClick={() => setZoomIndex(index)}
                className="group relative aspect-square w-full overflow-hidden bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B3C] focus-visible:ring-offset-2"
                aria-label={`Zoom: ${photo.alt}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <span className="pointer-events-none absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-black/45 text-white opacity-0 transition group-hover:opacity-100">
                  <Maximize2 className="h-3.5 w-3.5" />
                </span>
                {photo.caption ? (
                  <span className="font-manrope absolute bottom-2.5 left-2.5 right-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-white md:bottom-3 md:left-3 md:text-[11px]">
                    {photo.caption}
                  </span>
                ) : null}
              </button>
            </StaggerItem>
          ))}
        </Stagger>
      </AboutContainer>

      {zoomIndex !== null ? (
        <JourneyLightbox
          index={zoomIndex}
          onClose={closeZoom}
          onPrev={showPrev}
          onNext={showNext}
        />
      ) : null}
    </section>
  );
}
