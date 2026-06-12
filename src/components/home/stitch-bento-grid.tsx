import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { stitchImages } from "@/config/stitch-images";

const gemTiles = [
  {
    title: "Sapphire",
    subtitle: "Ceylon blues & cornflower hues",
    href: "/catalog?category=sapphires",
    image: stitchImages.sapphire,
    bg: "bg-sapphire-blue",
    span: "md:col-span-2 md:row-span-1",
    cta: "Discover More",
  },
  {
    title: "Ruby",
    subtitle: "Vivid reds & pigeon blood",
    href: "/catalog?category=ruby",
    image: stitchImages.ruby,
    bg: "bg-ruby-red",
    span: "md:col-span-1",
    cta: "Explore",
  },
  {
    title: "Emerald",
    subtitle: "Forest greens & rare cuts",
    href: "/catalog",
    image: stitchImages.emerald,
    bg: "bg-emerald-green",
    span: "md:col-span-1",
    cta: "Explore",
  },
];

export function StitchBentoGrid() {
  return (
    <section className="bg-stone-gray py-[var(--section-padding)]">
      <Container>
        {/* Section header */}
        <div className="mb-16 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="subheading-caps mb-4 tracking-[0.28em] text-rich-gold">
              Ceylon Gemstones
            </p>
            <h2 className="font-caslon text-4xl font-normal leading-tight text-heading md:text-5xl lg:text-[3.25rem]">
              Explore <span className="italic text-rich-gold">Collections</span>
            </h2>
            <div className="gold-divider mt-6 !mx-0" />
            <p className="font-manrope mt-6 text-base leading-relaxed text-on-surface-variant md:text-lg">
              Sourced from across the globe, we bring you the world&apos;s finest sapphires, rubies,
              emeralds and other precious gemstones. Millions of years in the making, curated for
              today.
            </p>
          </div>

          <Link
            href="/catalog"
            className="link-stitch group inline-flex shrink-0 items-center gap-2 text-rich-gold hover:text-deep-navy"
          >
            View All Gemstones
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Gem category grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4 md:grid-rows-2 md:gap-6 md:min-h-[520px]">
          {gemTiles.map((tile) => (
            <Link
              key={tile.title}
              href={tile.href}
              className={`group relative min-h-[280px] overflow-hidden ${tile.bg} ${tile.span} md:min-h-0`}
            >
              <Image
                src={tile.image}
                alt={`${tile.title} collection`}
                fill
                className="object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-colors duration-500 group-hover:from-black/85" />

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="font-manrope text-[10px] font-semibold uppercase tracking-[0.2em] text-pale-gold/90">
                  {tile.subtitle}
                </p>
                <h3 className="font-caslon mt-2 text-3xl text-white md:text-4xl">{tile.title}</h3>
                <span className="label-caps mt-4 inline-flex items-center gap-2 text-pale-gold opacity-70 transition-all duration-300 group-hover:gap-3 group-hover:opacity-100">
                  {tile.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="pointer-events-none absolute inset-3 border border-white/0 transition-colors duration-500 group-hover:border-white/20" />
            </Link>
          ))}

          {/* All Precious Gemstones — featured banner */}
          <Link
            href="/catalog"
            className="group relative min-h-[360px] overflow-hidden bg-deep-navy md:col-span-4 md:min-h-[240px]"
          >
            <Image
              src={stitchImages.allGems}
              alt="All precious gemstones collection"
              fill
              className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-deep-navy/95 via-deep-navy/75 to-deep-navy/40" />

            <div className="relative flex h-full flex-col justify-center px-8 py-12 md:flex-row md:items-center md:justify-between md:gap-12 md:px-14 md:py-16">
              <div className="max-w-xl">
                <p className="font-manrope text-[10px] font-semibold uppercase tracking-[0.28em] text-rich-gold">
                  The Full Collection
                </p>
                <h3 className="font-caslon mt-3 text-3xl leading-tight text-white md:text-4xl lg:text-5xl">
                  All Precious <span className="italic text-pale-gold">Gemstones</span>
                </h3>
                <div className="mt-5 h-px w-14 bg-rich-gold/70" />
                <p className="font-manrope mt-5 max-w-md text-sm leading-relaxed text-pale-gold/90 md:text-base">
                  An unrivalled collection of spinels, garnets, zircons and rare finds — curated by
                  world-class experts and sourced directly from Sri Lanka.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row md:mt-0 md:flex-col md:items-stretch">
                <span className="btn-stitch-ghost inline-flex items-center justify-center gap-2 px-8 py-4 text-center">
                  View Full Catalogue
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="font-manrope text-center text-xs font-bold uppercase tracking-[0.12em] text-white/50 md:text-left">
                  500+ certified stones
                </span>
              </div>
            </div>

            <div className="pointer-events-none absolute left-6 top-6 h-16 w-16 border-l border-t border-rich-gold/40 md:left-10 md:top-10" />
            <div className="pointer-events-none absolute bottom-6 right-6 h-16 w-16 border-b border-r border-rich-gold/40 md:bottom-10 md:right-10" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
