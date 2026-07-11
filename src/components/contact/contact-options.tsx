"use client";

import Link from "next/link";
import {
  Calendar,
  Mail,
  MapPin,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { FadeIn, Stagger, StaggerItem } from "@/components/about/fade-in";
import {
  contactOptions,
  type ContactOptionId,
} from "@/data/contact-content";
import { cn } from "@/lib/utils";

const iconMap: Record<ContactOptionId, LucideIcon> = {
  whatsapp: MessageCircle,
  email: Mail,
  appointment: Calendar,
  visit: MapPin,
};

export function ContactOptions() {
  return (
    <section
      className="bg-[#F7F4EF] px-[var(--margin-mobile)] py-12 md:px-[var(--margin-desktop)] md:py-14 lg:py-16"
      aria-labelledby="contact-options-heading"
    >
      <div className="mx-auto max-w-[1280px]">
        <FadeIn>
          <h2 id="contact-options-heading" className="sr-only">
            Contact Options
          </h2>
        </FadeIn>

        <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
          {contactOptions.map((option) => {
            const Icon = iconMap[option.id];
            const className = cn(
              "group flex h-full flex-col items-center border border-[#E8E2D8] bg-white px-6 py-8 text-center shadow-[0_8px_28px_rgba(0,0,0,0.04)] transition-transform duration-500 hover:-translate-y-1",
            );

            const content = (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#C89B3C] bg-[#141414]">
                  <Icon className="h-6 w-6 text-[#C89B3C]" strokeWidth={1.35} aria-hidden />
                </div>
                <p className="font-manrope mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C89B3C]">
                  {option.title}
                </p>
                <h3 className="font-caslon mt-2 text-[22px] leading-tight text-[#1a1a1a] md:text-[24px]">
                  {option.heading}
                </h3>
                <p className="font-manrope mt-3 flex-1 text-[13px] leading-[1.55] text-[#555555]">
                  {option.description}
                </p>
                <span className="font-manrope mt-6 inline-flex h-11 items-center justify-center border border-[#C89B3C] px-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#C89B3C] transition-colors duration-200 group-hover:bg-[#C89B3C] group-hover:text-white">
                  {option.buttonLabel}
                </span>
              </>
            );

            return (
              <StaggerItem key={option.id} className="h-full">
                {option.external ? (
                  <a
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {content}
                  </a>
                ) : (
                  <Link href={option.href} className={className}>
                    {content}
                  </Link>
                )}
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
