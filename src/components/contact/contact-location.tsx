"use client";

import { FadeIn } from "@/components/about/fade-in";
import { SectionTitle } from "@/components/about/section-title";
import { contactLocation } from "@/data/contact-content";
import { siteConfig } from "@/config/site";

export function ContactLocation() {
  const { contact } = siteConfig;

  return (
    <section
      className="border-t border-[#E8E2D8] bg-[#F7F4EF] px-[var(--margin-mobile)] py-12 md:px-[var(--margin-desktop)] md:py-14"
      aria-labelledby="contact-location-heading"
    >
      <div className="mx-auto max-w-[720px]">
        <FadeIn className="text-center">
          <SectionTitle
            as="h2"
            id="contact-location-heading"
            title={contactLocation.title}
            align="center"
            tone="dark"
            titleClassName="!text-[28px] md:!text-[32px]"
          />
          <p className="font-manrope mt-4 text-[14px] leading-[1.6] text-[#555555] md:text-[15px]">
            {contactLocation.description}
          </p>
          <div className="font-manrope mt-6 space-y-1 text-[13px] text-[#666666]">
            <p>{contact.headOffice.lines.join(", ")}</p>
            <p>
              <a
                href={`tel:${contact.phoneInternational.replace(/\s/g, "")}`}
                className="transition-colors hover:text-[#C89B3C]"
              >
                {contact.phoneInternational}
              </a>
              {" · "}
              <a
                href="mailto:info@ceyloe.com"
                className="transition-colors hover:text-[#C89B3C]"
              >
                info@ceyloe.com
              </a>
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
