import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { WebCoverHero } from "@/components/layout/web-cover-hero";
import { siteConfig } from "@/config/site";
import { webCovers } from "@/config/web-covers";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

const ctaBase =
  "inline-flex min-h-14 w-full items-center justify-center gap-2 px-6 text-center font-manrope text-sm font-semibold uppercase tracking-wider transition-colors";

const nextSteps = [
  "You will receive a payment confirmation by email from Stripe.",
  "Our team will contact you within 1–2 business days to confirm delivery and certification.",
  "Your gemstone will be prepared with insured, secure shipping.",
];

export default function CheckoutSuccessPage() {
  return (
    <div className="section-bg">
      <WebCoverHero id="thank-you-hero" {...webCovers.thankYou} compact />
      <Container className="flex items-center py-16 md:py-24">
        <div className="mx-auto w-full max-w-lg border border-border bg-surface-elevated p-8 md:p-12">
          <p className="text-xs uppercase tracking-[0.28em] text-rich-gold">Order confirmed</p>

          <h1 className="font-caslon mt-4 text-3xl font-normal leading-tight text-heading md:text-4xl">
            Thank you for your <span className="italic text-rich-gold">order</span>
          </h1>

          <div className="mt-6 h-px w-14 bg-rich-gold/40" aria-hidden />

          <p className="mt-6 text-base leading-relaxed text-muted">
            Your payment was processed securely. We are honoured you chose {siteConfig.name} for
            your next treasured piece.
          </p>

          <div className="mt-8 space-y-4 border-t border-border pt-8">
            <p className="text-xs uppercase tracking-[0.2em] text-rich-gold">What happens next</p>
            <ul className="space-y-3 text-sm leading-relaxed text-muted">
              {nextSteps.map((step) => (
                <li key={step} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rich-gold" aria-hidden />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 space-y-3">
            <Link href="/catalog" className={`${ctaBase} btn-stitch-gold`}>
              Continue shopping
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/contact" className={`${ctaBase} btn-stitch-primary`}>
                <Mail className="h-4 w-4 shrink-0" />
                Contact us
              </Link>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent("Hi, I just placed an order on Ceyloe and have a question.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${ctaBase} btn-stitch-outline`}
              >
                WhatsApp
              </a>
            </div>
          </div>

          <p className="mt-8 text-center text-[10px] uppercase tracking-[0.18em] text-muted">
            Questions? Call {siteConfig.contact.phone}
          </p>
        </div>
      </Container>
    </div>
  );
}
