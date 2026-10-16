import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";

/**
 * Fine Jewellery hero banner — fonts and colours matched to /gemstones hero.
 * Heading  → font-bell (Bell MT Bold), uppercase, gold #C09A4A
 * Body     → font-poppins, navy #004B69
 * Button   → btn-stitch-primary (deep navy, matches "Browse Collection")
 */

const GOLD = "#C09A4A";
const NAVY = "#004B69";

export function FineJewelleryHero({ imageOverride }: { imageOverride?: string }) {
  return (
    <section
      aria-labelledby="fine-jewellery-hero-title"
      className="relative w-full overflow-hidden bg-white"
      style={{ minHeight: "465px" }}
    >
      {/* ── Hero image — right half on desktop, full bg on mobile ─────── */}
      <div className="absolute inset-0 lg:left-[42%]">
        <Image
          src={imageOverride || "/images/fine-jewellery/hero-jewellery.jpg"}
          alt="Fine jewellery collection — sapphire, ruby, emerald and spinel rings, earrings and pendants on marble"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover object-center"
        />
        {/* Desktop: white gradient fade so text on the left reads clearly */}
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(to right, #ffffff 0%, #ffffff 8%, rgba(255,255,255,0.6) 30%, transparent 55%)",
          }}
        />
        {/* Mobile: strong white overlay so text has contrast against the image */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{ background: "rgba(255,255,255,0.90)" }}
        />
      </div>

      {/* ── Text panel ────────────────────────────────────────────────── */}
      <Container className="relative z-10">
        <div className="flex min-h-[465px] flex-col justify-center py-14 lg:py-20 lg:max-w-[46%]">

          {/* Eyebrow — font-poppins, navy, uppercase, matches "Explore Our" */}
          <p
            className="font-poppins text-[clamp(12px,0.8vw,14px)] font-normal uppercase leading-none tracking-[0.18em]"
            style={{ color: NAVY }}
          >
            Ready to Wear
          </p>

          {/* H1 — font-bell, bold, uppercase, gold — matches "GEMSTONES" */}
          <h1
            id="fine-jewellery-hero-title"
            className="font-bell mt-2 text-[clamp(30px,3.2vw,48px)] font-bold uppercase leading-[1.02] tracking-[0.01em] text-left lg:mt-2.5"
            style={{ color: GOLD }}
          >
            Fine Jewellery
          </h1>

          {/* Subtitle — font-poppins, navy */}
          <p
            className="font-poppins mt-3 text-[clamp(13px,0.9vw,15px)] font-normal leading-[1.5] text-left lg:mt-3.5"
            style={{ color: NAVY }}
          >
            Natural gemstones. Timeless jewellery. Ready to become yours.
          </p>

          {/* Description — font-poppins, slightly darker for readability */}
          <p
            className="font-poppins mt-4 max-w-[460px] text-[clamp(13px,0.9vw,15px)] font-normal leading-[1.6] lg:mt-4"
            style={{ color: "#1b1b1d" }}
          >
            Discover our collection of finished jewellery, featuring natural
            gemstones carefully selected for their beauty, character and
            individuality. Each piece is thoughtfully created and available to
            purchase without the wait of a bespoke order.
          </p>

          {/* CTA — btn-stitch-primary matches "Browse Collection" on /gemstones */}
          <div className="mt-6 lg:mt-7">
            <Link href="#jewellery-collection" className="btn-stitch-primary inline-flex">
              Shop Jewellery
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
