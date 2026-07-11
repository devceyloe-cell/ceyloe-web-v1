import type { Metadata } from "next";
import { ContactCta } from "@/components/contact/contact-cta";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactLocation } from "@/components/contact/contact-location";
import { ContactOptions } from "@/components/contact/contact-options";

export const metadata: Metadata = {
  title: "Contact — Ceyloe",
  description:
    "Connect with Ceyloe for natural gemstones, bespoke jewellery, private appointments, and enquiries.",
};

export default function ContactPage() {
  return (
    <div className="bg-[#F7F4EF]">
      <ContactHero />
      <ContactOptions />
      <ContactForm />
      <ContactLocation />
      <ContactCta />
    </div>
  );
}
