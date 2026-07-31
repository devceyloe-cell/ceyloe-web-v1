"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Headphones, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { productConsultation } from "@/data/product-detail-content";
import { siteConfig } from "@/config/site";

interface ConsultationBannerProps {
  productTitle: string;
  productUrl: string;
}

export function ConsultationBanner({ productTitle, productUrl }: ConsultationBannerProps) {
  const whatsappHref = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    `Hello, I would like more information about the ${productTitle}.\n${productUrl}`,
  )}`;

  return (
    <section className="relative overflow-hidden border-y border-border bg-[#f8f8f8]">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] lg:block">
        <Image
          src="/images/about/our-values-ring.webp"
          alt=""
          fill
          className="object-cover object-[center_35%] opacity-[0.22]"
          sizes="38vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f8f8f8] via-[#f8f8f8]/70 to-transparent" />
      </div>

      <Container className="relative z-10 py-12 md:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="flex max-w-2xl items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-rich-gold/40 text-rich-gold">
              <Headphones className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            </div>
            <div>
              <h2 className="font-caslon text-2xl leading-snug text-heading md:text-3xl">
                {productConsultation.title}
              </h2>
              <p className="font-manrope mt-2 max-w-xl text-sm leading-relaxed text-muted md:text-base">
                {productConsultation.description}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0">
            <Link
              href="/book"
              className="btn-stitch-gold inline-flex min-h-12 items-center justify-center gap-2 px-8"
            >
              <Calendar className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Book Appointment
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-stitch-outline inline-flex min-h-12 items-center justify-center gap-2 px-8"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
