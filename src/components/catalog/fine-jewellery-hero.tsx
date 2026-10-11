import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";

/**
 * Full-width hero banner for the Fine Jewellery catalog page.
 * Uses the project's existing typography classes (font-caslon, font-manrope)
 * and button style (btn-stitch-gold) for visual consistency.
 */
export function FineJewelleryHero() {
  return (
    <section
      aria-labelledby="fine-jewellery-hero-title"
      className="relative w-full overflow-hidden bg-[#F6F0E7]"
      style={{ minHeight: "465px" }}
    >
      {/* ── Hero image — right half on desktop, full bg on mobile ─────── */}
      <div className="absolute inset-0 lg:left-[42%]">
        <Image
          src="/images/fine-jewellery/hero-jewellery.png"
          alt="Ceylon Blue Sapphire Ring, Ruby Earrings and Teal Sapphire Pendant on marble"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover object-center"
        />
        {/* Desktop: cream gradient fade so text on the left reads clearly */}
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(to right, #F6F0E7 0%, #F6F0E7 6%, rgba(246,240,231,0.55) 28%, transparent 52%)",
          }}
        />
        {/* Mobile: strong overlay so text has contrast against the image */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{ background: "rgba(246,240,231,0.88)" }}
        />
      </div>

      {/* ── Text panel ────────────────────────────────────────────────── */}
      <Container className="relative z-10">
        <div className="flex min-h-[465px] flex-col justify-center py-14 lg:py-20 lg:max-w-[46%]">

          {/* Eyebrow — matches catalog-landing-hero eyebrow style */}
          <p className="font-manrope text-[11px] font-semibold uppercase tracking-[0.28em] text-rich-gold">
            Ready to Wear
          </p>

          {/* H1 — uses project serif font (Caslon) same as product headings */}
          <h1
            id="fine-jewellery-hero-title"
            className="font-caslon mt-2 text-[clamp(38px,5vw,72px)] font-bold leading-[1.0] tracking-tight text-black"
          >
            Fine Jewellery
          </h1>

          {/* Subtitle — same Caslon, medium weight for strong contrast */}
          <p className="font-caslon mt-3 text-[clamp(17px,2vw,28px)] font-semibold leading-snug text-black lg:mt-4">
            Natural gemstones. Timeless jewellery.
            <br />
            Ready to become yours.
          </p>

          {/* Description — Manrope body text */}
          <p className="font-manrope mt-4 max-w-[420px] text-[clamp(13px,1vw,16px)] leading-relaxed text-muted lg:mt-5">
            Discover our collection of finished jewellery, featuring natural
            gemstones carefully selected for their beauty, character and
            individuality. Each piece is thoughtfully crafted and available to
            purchase without the wait of a bespoke order.
          </p>

          {/* CTA — project's standard gold button */}
          <div className="mt-7 lg:mt-8">
            <Link href="#jewellery-collection" className="btn-stitch-gold inline-flex">
              Shop Jewellery →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
