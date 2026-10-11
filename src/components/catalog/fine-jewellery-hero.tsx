import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";

/**
 * Fine Jewellery hero banner — Ceyloe brand typography style guide.
 * Fonts: Playfair Display (serif) + Montserrat (sans).
 * Both are loaded via next/font/google in layout.tsx and available
 * as CSS variables --font-playfair / --font-montserrat on <html>.
 */

const PLAYFAIR = "var(--font-playfair), Georgia, serif";
const MONTSERRAT = "var(--font-montserrat), Arial, sans-serif";

export function FineJewelleryHero() {
  return (
    <section
      aria-labelledby="fine-jewellery-hero-title"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#F6F0E7", minHeight: "465px" }}
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
              "linear-gradient(to right, #F6F0E7 0%, #F6F0E7 8%, rgba(246,240,231,0.6) 30%, transparent 55%)",
          }}
        />
        {/* Mobile: strong overlay so text has contrast against the image */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{ background: "rgba(246,240,231,0.90)" }}
        />
      </div>

      {/* ── Text panel ────────────────────────────────────────────────── */}
      <Container className="relative z-10">
        <div className="flex min-h-[465px] flex-col justify-center py-14 lg:py-20 lg:max-w-[46%]">

          {/* Eyebrow — Montserrat 15px / 400 / #A58A60 / 3px tracking */}
          <p
            style={{
              fontFamily: MONTSERRAT,
              fontSize: "15px",
              fontWeight: 400,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#A58A60",
              marginBottom: "8px",
            }}
          >
            Ready to Wear
          </p>

          {/* H1 — Playfair Display clamp(40px→76px) / 400 / #111111 / -1.5px tracking */}
          <h1
            id="fine-jewellery-hero-title"
            style={{
              fontFamily: PLAYFAIR,
              fontSize: "clamp(40px, 5vw, 76px)",
              lineHeight: 1.08,
              fontWeight: 400,
              letterSpacing: "-1.5px",
              color: "#111111",
              margin: "0 0 10px",
            }}
          >
            Fine Jewellery
          </h1>

          {/* Subtitle — Playfair Display clamp(22px→30px) / 400 / #111111 */}
          <p
            style={{
              fontFamily: PLAYFAIR,
              fontSize: "clamp(22px, 2.1vw, 30px)",
              fontWeight: 400,
              lineHeight: 1.2,
              color: "#111111",
              margin: "0 0 20px",
            }}
          >
            Natural gemstones. Timeless jewellery.
            <br />
            Ready to become yours.
          </p>

          {/* Description — Montserrat 18px / 400 / #252525 */}
          <p
            style={{
              fontFamily: MONTSERRAT,
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: 1.38,
              color: "#252525",
              maxWidth: "490px",
              margin: "0 0 22px",
            }}
          >
            Discover our collection of finished jewellery, featuring natural
            gemstones carefully selected for their beauty, character and
            individuality. Each piece is thoughtfully crafted and available to
            purchase without the wait of a bespoke order.
          </p>

          {/* CTA — Montserrat 14px / 600 / #B58B42 bg / #111111 text */}
          <Link
            href="#jewellery-collection"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "18px",
              minHeight: "53px",
              padding: "15px 32px",
              backgroundColor: "#B58B42",
              color: "#111111",
              fontFamily: MONTSERRAT,
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
              textDecoration: "none",
              alignSelf: "flex-start",
            }}
          >
            Shop Jewellery
          </Link>
        </div>
      </Container>
    </section>
  );
}
