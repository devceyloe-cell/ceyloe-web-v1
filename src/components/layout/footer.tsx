import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { landingNavigation } from "@/config/navigation";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { PaymentMethods } from "@/components/ui/payment-icons";
import { InstagramIcon } from "@/components/ui/instagram-icon";

const memberships = [
  {
    name: "GIA Member",
    href: "https://www.gia.edu/",
    logo: "/images/memberships/gia-logo.svg",
    width: 100,
    height: 34,
  },
  {
    name: "GAA WA Member",
    href: "https://www.gem.org.au/western-australia/",
    logo: "/images/memberships/gaa-logo.png",
    width: 100,
    height: 40,
  },
] as const;

const footerLink =
  "font-manrope text-sm text-white/70 transition-colors duration-300 hover:text-rich-gold";

const socialBtn =
  "flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-rich-gold hover:text-rich-gold";

const customerCare = [
  { label: "FAQ", href: "/faq" },
  { label: "Shipping & Delivery", href: "/transparency" },
  { label: "Returns", href: "/returns" },
  { label: "Care Guide", href: "/certifications" },
];

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14 13.5h2.5l.5-3H14V8.5c0-.8.2-1.3 1.4-1.3H17V4.1C16.7 4.1 15.7 4 14.6 4 12.2 4 10.5 5.5 10.5 8.2V10.5H8v3h2.5V20h3.5v-6.5z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const { contact } = siteConfig;

  return (
    <footer className="site-footer border-t border-white/10 bg-[#111111] pt-8 pb-8 text-white md:pt-10">
      <Container>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div>
            <Logo size="lg" variant="white" className="mb-6" />
            <p className="font-manrope max-w-xs text-sm leading-relaxed text-white/60">
              Fine Ceylon gemstones and bespoke jewellery — ethically sourced, certified, and
              curated for collectors worldwide.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={socialBtn}
                aria-label="Facebook"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={socialBtn}
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className={socialBtn}
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-manrope mb-6 text-[11px] font-bold uppercase tracking-[0.18em] !text-[#C89B3C]">
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
            <h4 className="font-manrope mb-6 text-[11px] font-bold uppercase tracking-[0.18em] !text-[#C89B3C]">
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
            <h4 className="font-manrope mb-6 text-[11px] font-bold uppercase tracking-[0.18em] !text-[#C89B3C]">
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
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-rich-gold">
                  {contact.headOffice.label}
                </p>
                <div className="space-y-0.5">
                  {contact.headOffice.lines.map((line) => (
                    <p key={line} className="font-bold text-white">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5 pt-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-rich-gold">
                  {contact.miningOffice.label}
                </p>
                <div className="space-y-0.5">
                  {contact.miningOffice.lines.map((line) => (
                    <p key={line} className="font-bold text-white">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </address>

            <div className="mt-8">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-rich-gold">
                Memberships
              </p>
              <ul className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                {memberships.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded border border-white/15 bg-white px-3 py-2.5 transition hover:border-rich-gold"
                      aria-label={`${item.name} (opens in a new tab)`}
                    >
                      <Image
                        src={item.logo}
                        alt=""
                        width={item.width}
                        height={item.height}
                        unoptimized
                        className="h-8 w-auto object-contain"
                      />
                      <span className="font-manrope text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-800">
                        {item.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-6 border-t border-white/10 pt-8">
          <PaymentMethods />
          <div className="flex w-full flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <p className="font-manrope text-xs uppercase tracking-widest text-white/40">
              &copy; {year} {siteConfig.name.toUpperCase()}. All rights reserved.
            </p>
            <p className="font-manrope text-xs text-white/40">Website by Ceyloe</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
