import Link from "next/link";
import { siteConfig } from "@/config/site";
import { landingNavigation } from "@/config/navigation";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";

const footerLink =
  "font-manrope text-sm text-white/70 transition-colors duration-300 hover:text-rich-gold";

const customerCare = [
  { label: "FAQ", href: "/faq" },
  { label: "Shipping & Delivery", href: "/transparency" },
  { label: "Returns", href: "/contact" },
  { label: "Care Guide", href: "/certifications" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const { contact } = siteConfig;

  return (
    <footer className="border-t border-white/10 bg-[#111111] pt-16 pb-8 text-white">
      <Container>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div>
            <Logo size="lg" className="mb-6 brightness-0 invert" />
            <p className="font-manrope max-w-xs text-sm leading-relaxed text-white/60">
              Fine Ceylon gemstones and bespoke jewellery — ethically sourced, certified, and
              curated for collectors worldwide.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-rich-gold hover:text-rich-gold"
                aria-label="Facebook"
              >
                <span className="material-symbols-outlined text-base">thumb_up</span>
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-rich-gold hover:text-rich-gold"
                aria-label="Instagram"
              >
                <span className="material-symbols-outlined text-base">photo_camera</span>
              </a>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-rich-gold hover:text-rich-gold"
                aria-label="WhatsApp"
              >
                <span className="material-symbols-outlined text-base">chat</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-manrope mb-6 text-[11px] font-bold uppercase tracking-[0.18em] text-rich-gold">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {landingNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-manrope mb-6 text-[11px] font-bold uppercase tracking-[0.18em] text-rich-gold">
              Customer Care
            </h4>
            <ul className="space-y-3">
              {customerCare.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-manrope mb-6 text-[11px] font-bold uppercase tracking-[0.18em] text-rich-gold">
              Contact
            </h4>
            <address className="font-manrope space-y-3 text-sm not-italic leading-relaxed text-white/70">
              <p>
                <a href={`tel:${contact.phoneInternational.replace(/\s/g, "")}`} className={footerLink}>
                  {contact.phoneInternational}
                </a>
              </p>
              <p>
                <a href="mailto:info@ceyloe.com" className={footerLink}>
                  info@ceyloe.com
                </a>
              </p>
              <p>{contact.headOffice.lines.join(", ")}</p>
              <p className="pt-2">{contact.miningOffice.lines.join(", ")}</p>
            </address>

            <div className="mt-8 inline-flex items-center gap-2 rounded border border-white/15 px-3 py-2">
              <span className="font-manrope text-[10px] font-bold uppercase tracking-[0.14em] text-rich-gold">
                AGTA Member
              </span>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center md:flex-row md:text-left">
          <p className="font-manrope text-xs uppercase tracking-widest text-white/40">
            &copy; {year} {siteConfig.name.toUpperCase()}. All rights reserved.
          </p>
          <p className="font-manrope text-xs text-white/40">Website by Ceyloe</p>
        </div>
      </Container>
    </footer>
  );
}
