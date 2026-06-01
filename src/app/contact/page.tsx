import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/contact/contact-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Ceyloe for gemstone inquiries, custom orders, and consultations.",
};

export default function ContactPage() {
  return (
    <Container className="py-12 md:py-20">
      <SectionHeading
        eyebrow="Get in Touch"
        title="Contact Us"
        description="Whether you're seeking a specific stone or planning a bespoke piece, we're here to help."
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
        <ContactForm />

        <aside className="space-y-8">
          <div className="border border-border bg-surface p-8">
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Contact Details
            </h3>
            <ul className="mt-6 space-y-5">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-sm text-muted hover:text-gold"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div>
                  <p className="text-sm font-medium text-foreground">Phone</p>
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="text-sm text-muted hover:text-gold"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div>
                  <p className="text-sm font-medium text-foreground">Location</p>
                  <p className="text-sm text-muted">{siteConfig.contact.address}</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="border border-border bg-surface p-8">
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Consultation Hours
            </h3>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Mon – Fri</dt>
                <dd className="text-foreground">9:00 AM – 6:00 PM</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Saturday</dt>
                <dd className="text-foreground">10:00 AM – 4:00 PM</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Sunday</dt>
                <dd className="text-foreground">By appointment</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </Container>
  );
}
