import type { Metadata } from "next";
import Link from "next/link";
import { Phone, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/contact/contact-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Ceyloe — head office in Australia, mining and production in Sri Lanka.",
};

export default function ContactPage() {
  const { contact } = siteConfig;

  return (
    <>
      <section className="border-b border-border bg-surface py-12 md:py-16">
        <Container>
          <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-gold">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Contact</span>
          </nav>
          <h1 className="font-display text-4xl font-light tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Get in touch.
          </h1>
        </Container>
      </section>

      <Container className="py-12 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
          <ContactForm />

          <aside className="space-y-6">
            <div className="border border-border bg-surface p-8">
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
                {contact.headOffice.label}
              </h3>
              <address className="mt-4 flex gap-3 not-italic">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div className="text-sm leading-relaxed text-muted">
                  {contact.headOffice.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </div>
              </address>
            </div>

            <div className="border border-border bg-surface p-8">
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
                {contact.miningOffice.label}
              </h3>
              <address className="mt-4 flex gap-3 not-italic">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div className="text-sm leading-relaxed text-muted">
                  {contact.miningOffice.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </div>
              </address>
            </div>

            <div className="border border-border bg-surface p-8">
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
                Phone
              </h3>
              <ul className="mt-4 space-y-3">
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-gold" />
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="text-sm text-muted hover:text-gold"
                  >
                    {contact.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-gold" />
                  <div>
                    <p className="text-xs text-muted">Overseas</p>
                    <a
                      href={`tel:${contact.phoneInternational.replace(/\s/g, "")}`}
                      className="text-sm text-muted hover:text-gold"
                    >
                      {contact.phoneInternational}
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <p className="text-center text-sm">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                Follow us on Instagram @ceyloegemstones
              </a>
            </p>
          </aside>
        </div>
      </Container>
    </>
  );
}
