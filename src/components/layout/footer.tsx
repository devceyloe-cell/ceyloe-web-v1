import Link from "next/link";
import { Phone } from "lucide-react";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";

export function Footer() {
  const year = new Date().getFullYear();
  const { contact } = siteConfig;

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo size="lg" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {siteConfig.description}
            </p>
            <div className="mt-6">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
                aria-label="Follow Ceyloe on Instagram"
              >
                <InstagramIcon />
                @ceyloegemstones
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Explore
            </h3>
            <ul className="space-y-3">
              {siteConfig.footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div>
                  <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-foreground">
                    {contact.phone}
                  </a>
                  <br />
                  <span className="text-xs">Overseas: </span>
                  <a
                    href={`tel:${contact.phoneInternational.replace(/\s/g, "")}`}
                    className="hover:text-foreground"
                  >
                    {contact.phoneInternational}
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted">
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            <Link href={siteConfig.links.terms} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
              Terms &amp; Conditions
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
