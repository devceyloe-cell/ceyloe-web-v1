import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  aboutCta,
  aboutHero,
  aboutJourney,
  aboutTeam,
  aboutTeamIntro,
  aboutValues,
  aboutValuesImage,
} from "@/data/about-content";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Ceyloe was founded with a passion for sharing the beauty of natural Sri Lankan gemstones with Australia — quality, honesty, transparency and personalised service.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero — full-bleed image with text overlay (matches mockup) */}
      <section className="relative min-h-[calc(100vh-var(--site-header-height))] min-h-[560px] overflow-hidden bg-black">
        <Image
          src={aboutHero.image}
          alt={aboutHero.imageAlt}
          fill
          priority
          className="object-cover object-center md:object-right"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/25 md:via-black/70 md:to-transparent" />

        <Container className="relative z-10 flex min-h-[calc(100vh-var(--site-header-height))] min-h-[560px] items-center py-16 md:py-24">
          <div className="max-w-xl lg:max-w-lg">
            <h1 className="font-caslon text-5xl font-normal leading-tight !text-white md:text-6xl lg:text-7xl">
              {aboutHero.title}
            </h1>
            <p className="font-manrope mt-6 text-sm leading-relaxed !text-white/95 md:text-base md:leading-relaxed">
              {aboutHero.introduction}
            </p>
          </div>
        </Container>
      </section>

      {/* Our Journey */}
      <section className="bg-[#f7f5f2] py-16 md:py-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="max-w-lg">
              <h2 className="font-caslon text-3xl font-normal text-heading md:text-4xl lg:text-[2.75rem]">
                {aboutJourney.title}
              </h2>
              <p className="font-manrope mt-6 text-sm leading-relaxed text-[#4a4a4a] md:text-base">
                {aboutJourney.description}
              </p>
            </div>

            <div className="relative aspect-[5/4] w-full overflow-hidden">
              <Image
                src={aboutJourney.image}
                alt={aboutJourney.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Soft fade on left edge like the mockup */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#f7f5f2] to-transparent" />
            </div>
          </div>
        </Container>
      </section>

      {/* Our Team */}
      <section className="bg-white py-16 md:py-24">
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <h2 className="font-caslon text-3xl font-normal text-heading md:text-4xl lg:text-[2.75rem]">
              Our <span className="italic text-rich-gold">Team</span>
            </h2>
            <p className="font-manrope mt-4 text-sm leading-relaxed text-[#4a4a4a] md:text-base">
              {aboutTeamIntro}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
            {aboutTeam.map((member) => (
              <article key={member.id} className="text-center">
                <div className="relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-sm bg-[#ece8e2]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 80vw, (max-width: 1280px) 40vw, 25vw"
                  />
                </div>
                <h3 className="font-caslon mt-5 text-2xl text-rich-gold">{member.name}</h3>
                <p className="font-manrope mt-1 text-sm font-semibold text-heading">{member.role}</p>
                <p className="font-manrope mt-3 text-sm leading-relaxed text-[#5a5a5a]">{member.bio}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Values + CTA (continuous dark band like mockup) */}
      <section className="bg-[#111111] py-16 md:py-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden lg:mx-0 lg:max-w-none">
              <Image
                src={aboutValuesImage.src}
                alt={aboutValuesImage.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>

            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
              {aboutValues.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.id} className="text-center xl:text-left">
                    <span className="mx-auto flex h-11 w-11 items-center justify-center text-rich-gold xl:mx-0">
                      <Icon className="h-7 w-7" strokeWidth={1.25} />
                    </span>
                    <h3 className="font-caslon mt-4 text-xl !text-rich-gold">{value.title}</h3>
                    <p className="font-manrope mt-2 text-sm leading-relaxed !text-white/85">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-2xl border-t border-white/10 pt-16 text-center md:mt-24 md:pt-20">
            <h2 className="font-caslon text-3xl font-normal !text-white md:text-4xl lg:text-[2.75rem]">
              {aboutCta.title}
            </h2>
            <p className="font-manrope mt-4 text-sm leading-relaxed !text-white/85 md:text-base">
              {aboutCta.description}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/gemstones"
                className="inline-flex min-w-[210px] items-center justify-center bg-[#b38b3f] px-8 py-4 font-manrope text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-black"
              >
                Explore Gemstones
              </Link>
              <Link
                href="/book"
                className="inline-flex min-w-[210px] items-center justify-center border border-white/80 px-8 py-4 font-manrope text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:border-rich-gold hover:text-rich-gold"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
