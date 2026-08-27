import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";

/** Same palette / layout shell as prior white cover heroes */
const NAVY = "#004B69";
const GOLD = "#C09A4A";
const HERO_ART = "/images/covers/contact.webp";

/**
 * /contact hero — white cover (Get In Touch), matched to prior white heroes.
 */
export function ContactHero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-white"
      aria-labelledby="contact-hero-title"
    >
      <div className="relative h-[clamp(300px,32vw,520px)] w-full">
        <div className="absolute inset-0 z-0" aria-hidden>
          <Image
            src={HERO_ART}
            alt=""
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-right"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[58%] bg-gradient-to-r from-white via-white/95 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] items-start px-[var(--margin-mobile)] pt-8 pb-10 md:px-[var(--margin-desktop)] md:pt-10 lg:pt-12 xl:pt-14">
          <div className="max-w-[520px] text-left lg:pl-[2%]">
            <Logo size="hero" className="!w-[clamp(160px,12vw,200px)]" />

            <h1
              id="contact-hero-title"
              className="font-bell mt-5 text-[clamp(30px,3.2vw,48px)] font-bold uppercase leading-[1.02] tracking-[0.01em] text-left lg:mt-6 xl:mt-5"
              style={{ color: GOLD }}
            >
              Get In Touch
            </h1>

            <p
              className="font-poppins mt-3 max-w-[460px] text-[clamp(13px,0.9vw,15px)] font-normal leading-[1.5] text-left lg:mt-3.5"
              style={{ color: NAVY }}
            >
              We&apos;re here to help you find the perfect gemstone.
            </p>

            <Link
              href="#contact-form"
              className="font-poppins mt-5 inline-flex min-h-[44px] min-w-[220px] items-center justify-center rounded-none px-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90 lg:mt-6 lg:min-h-[48px] lg:min-w-[240px] xl:mt-5"
              style={{ backgroundColor: NAVY }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
