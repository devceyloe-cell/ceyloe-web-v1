import type { Metadata } from "next";
import { ContactCta } from "@/components/contact/contact-cta";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactLocation } from "@/components/contact/contact-location";
import { ContactOptions } from "@/components/contact/contact-options";
import { getHeroImages } from "@/lib/mongodb/hero-images";

export const metadata: Metadata = {
  title: "Contact Ceyloe | Kalgoorlie Gems & Perth Jewellery",
  description:
    "Contact Ceyloe for Kalgoorlie gems, Kalgoorlie jewellery and Perth gems — private appointments on Hannan Street, WhatsApp and phone support across WA.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const heroImages = await getHeroImages();
  return (
    <div className="bg-[#F7F4EF]">
      <ContactHero contentOverride={heroImages.contact} />
      <ContactOptions />
      <ContactForm />
      <ContactLocation />
      <ContactCta />
    </div>
  );
}
