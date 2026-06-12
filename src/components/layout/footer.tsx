import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { PaymentMethods } from "@/components/ui/payment-icons";

const footerLink =
  "font-manrope text-sm text-on-surface-variant transition-colors duration-300 hover:text-rich-gold";

export function Footer() {
  const year = new Date().getFullYear();
  const { contact } = siteConfig;

  return (
    <footer className="site-footer border-t border-border bg-[#f5f5f5] pt-20 pb-10 text-on-surface-variant">
      <Container>
        <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-[var(--gutter)]">
          <div>
            <Logo size="lg" className="mb-8" />
            <address className="font-manrope space-y-2 text-sm not-italic leading-relaxed opacity-80">
              <p className="font-semibold text-rich-gold">{contact.headOffice.label}</p>
              <p>{contact.headOffice.lines.join(", ")}</p>
              <p className="pt-2 font-semibold text-rich-gold">{contact.miningOffice.label}</p>
              <p>{contact.miningOffice.lines.join(", ")}</p>
              <p className="pt-2">
                <a href={`tel:${contact.phoneInternational.replace(/\s/g, "")}`} className={footerLink}>
                  {contact.phoneInternational}
                </a>
              </p>
            </address>
          </div>

          <div>
            <h4 className="label-caps mb-8 text-rich-gold">Company</h4>
            <ul className="space-y-4">
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
            <h4 className="label-caps mb-8 text-rich-gold">Service</h4>
            <ul className="space-y-4">
              {siteConfig.footerNav.service.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="label-caps mb-8 text-rich-gold">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-surface-dim transition-all duration-300 hover:border-rich-gold hover:bg-rich-gold hover:text-white"
                aria-label="Facebook"
              >
                <span className="material-symbols-outlined text-lg">thumb_up</span>
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-on-surface-variant transition-all duration-300 hover:border-rich-gold hover:bg-rich-gold hover:text-white"
                aria-label="Instagram"
              >
                <span className="material-symbols-outlined text-lg">photo_camera</span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-border pt-10 md:flex-row">
          <p className="font-manrope text-xs uppercase tracking-widest text-on-surface-variant/70">
            &copy; {year} {siteConfig.name.toUpperCase()}. All rights reserved.
          </p>
          <PaymentMethods />
        </div>
      </Container>
    </footer>
  );
}
