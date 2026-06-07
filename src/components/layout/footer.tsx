import Link from "next/link";
import { Phone } from "lucide-react";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { TrustBar } from "@/components/home/trust-bar";
import { NewsletterSignup } from "@/components/layout/newsletter-signup";
import { trustItems } from "@/data/home-content";

const footerLink =
  "text-sm font-light text-muted transition-opacity hover:opacity-70 hover:text-heading";

export function Footer() {
  const year = new Date().getFullYear();
  const { contact } = siteConfig;

  return (
    <footer className="mt-auto">
      <TrustBar items={trustItems} />
      <NewsletterSignup />

      <div className="border-t border-border bg-surface text-foreground">
        <Container className="py-16">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <Logo size="lg" />
              <div className="mt-6 space-y-1 text-sm font-light leading-relaxed text-muted">
                <p className="font-medium text-heading">{siteConfig.name}</p>
                <p>{contact.headOffice.lines.join(", ")}</p>
                <p>{contact.miningOffice.lines.join(", ")}</p>
                <p className="pt-2">
                  <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className={footerLink}>
                    {contact.phone}
                  </a>
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(footerLink, "inline-flex items-center gap-2")}
                  aria-label="Follow Ceyloe on Instagram"
                >
                  <InstagramIcon />
                  @ceyloegemstones
                </a>
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLink}
                  aria-label="Follow Ceyloe on Facebook"
                >
                  Facebook · @ceyloegemstone
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.12em] text-heading">
                Company
              </h3>
              <ul className="space-y-3">
                {siteConfig.footerNav.company.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className={footerLink}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.12em] text-heading">
                Service
              </h3>
              <ul className="space-y-3">
                {siteConfig.footerNav.service.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className={footerLink}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <h3 className="mb-4 mt-8 text-[11px] font-medium uppercase tracking-[0.12em] text-heading">
                Contact
              </h3>
              <ul className="space-y-3 text-sm font-light text-muted">
                <li className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className={footerLink}>
                      {contact.phone}
                    </a>
                    <br />
                    <span className="text-xs">Overseas: </span>
                    <a
                      href={`tel:${contact.phoneInternational.replace(/\s/g, "")}`}
                      className={footerLink}
                    >
                      {contact.phoneInternational}
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
            <p className="text-xs font-light text-muted">
              &copy; {year} {siteConfig.name}. All content copyright {siteConfig.name}.
            </p>
            <p className="text-xs font-light text-muted">
              <Link href={siteConfig.links.terms} target="_blank" rel="noopener noreferrer" className={footerLink}>
                Terms &amp; Conditions
              </Link>
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
