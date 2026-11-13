import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";

const base = () => siteConfig.url.replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Kalgoorlie Gems & Jewellery | Ceylon Gemstones Ceyloe",
  description:
    "Kalgoorlie gems and jewellery from Ceyloe — certified Ceylon sapphires, spinel and bespoke jewellery at our Hannan Street head office. Private appointments in Kalgoorlie, WA.",
  keywords: [
    "Kalgoorlie gems",
    "Kalgoorlie jewellery",
    "Kalgoorlie jewelry",
    "gemstones Kalgoorlie",
    "sapphire Kalgoorlie",
    "jewellery shop Kalgoorlie",
    "Ceylon gemstones Kalgoorlie",
    "bespoke jewellery Kalgoorlie WA",
  ],
  alternates: {
    canonical: `${base()}/kalgoorlie`,
  },
  openGraph: {
    title: "Kalgoorlie Gems & Jewellery | Ceyloe",
    description:
      "Buy Kalgoorlie gems and jewellery from Ceyloe — certified Ceylon stones, bespoke design, private appointments on Hannan Street.",
    url: `${base()}/kalgoorlie`,
    type: "website",
    locale: siteConfig.locale,
  },
};

const faqs = [
  {
    q: "Where can I buy gems in Kalgoorlie?",
    a: "Ceyloe’s head office is at 273 Hannan Street, Kalgoorlie, WA. Book a private appointment to view certified Ceylon gemstones and discuss Kalgoorlie jewellery commissions.",
  },
  {
    q: "Do you sell jewellery in Kalgoorlie?",
    a: "Yes. We offer natural gemstones and bespoke jewellery design from our Kalgoorlie base — engagement rings, pendants, earrings and custom pieces set with Ceylon sapphires and other stones.",
  },
  {
    q: "Can I visit without an appointment?",
    a: "Viewings are by appointment so we can prepare the right stones for you. Call, WhatsApp or book online to arrange a Kalgoorlie gems consultation.",
  },
] as const;

const links = [
  { href: "/gemstones", label: "Browse Kalgoorlie gems", desc: "Sapphires, spinel, garnet and more" },
  { href: "/custom-jewelry", label: "Kalgoorlie jewellery", desc: "Bespoke rings and custom designs" },
  { href: "/book", label: "Book in Kalgoorlie", desc: "Private appointment at Hannan Street" },
  { href: "/perth", label: "Serving Perth too", desc: "Gemstones & delivery for Perth clients" },
  { href: "/contact", label: "Contact Ceyloe", desc: "Phone, WhatsApp or email" },
] as const;

export default function KalgoorlieGemsPage() {
  const site = base();
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site },
      { "@type": "ListItem", position: 2, name: "Kalgoorlie Gems & Jewellery", item: `${site}/kalgoorlie` },
    ],
  };

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <section className="border-b border-border bg-surface-elevated py-14 md:py-20">
        <Container>
          <p className="subheading-caps mb-4 tracking-[0.2em] text-rich-gold">Kalgoorlie, Western Australia</p>
          <h1 className="font-caslon max-w-3xl text-4xl font-light text-foreground sm:text-5xl">
            Kalgoorlie gems &amp; jewellery
          </h1>
          <p className="font-manrope mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            Looking for Kalgoorlie gems or Kalgoorlie jewellery? Ceyloe is based on Hannan Street —
            sourcing certified Ceylon gemstones from Sri Lanka and creating bespoke jewellery for
            collectors across the Goldfields and Western Australia.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/gemstones"
              className="inline-flex items-center justify-center rounded-sm bg-[#004B69] px-6 py-3 font-manrope text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Shop gems
            </Link>
            <Link
              href="/custom-jewelry"
              className="inline-flex items-center justify-center rounded-sm border border-[#004B69] px-6 py-3 font-manrope text-sm font-semibold text-[#004B69] transition-colors hover:bg-[#004B69]/5"
            >
              Kalgoorlie jewellery
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-14 md:py-20">
        <SectionHeading
          eyebrow="Ceyloe in Kalgoorlie"
          title="Gems and jewellery from Hannan Street"
          description="Our Kalgoorlie head office is the home of Ceyloe in Australia — natural stones, honest advice, and custom jewellery design."
          align="left"
        />
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Kalgoorlie gems",
              body: "Certified Ceylon sapphires, spinel, garnet and more — selected for colour and quality, available to view by appointment in Kalgoorlie.",
            },
            {
              title: "Kalgoorlie jewellery",
              body: "Bespoke engagement rings, pendants and earrings designed around your chosen stone, crafted for Goldfields and WA clients.",
            },
            {
              title: "Local appointments",
              body: "Private consultations at 273 Hannan Street, Kalgoorlie. We also serve Perth with delivery and remote viewings.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h2 className="font-caslon text-2xl text-foreground">{item.title}</h2>
              <p className="font-manrope mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </Container>

      <section className="border-y border-border bg-[#F7F4EF] py-14 md:py-20">
        <Container>
          <SectionHeading
            eyebrow="Explore"
            title="Start with Kalgoorlie gems or jewellery"
            description="Popular next steps for Goldfields buyers."
            align="left"
          />
          <ul className="grid gap-4 sm:grid-cols-2">
            {links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block border border-[#E8E2D8] bg-white px-5 py-5 transition-colors hover:border-rich-gold"
                >
                  <span className="font-caslon text-xl text-foreground">{item.label}</span>
                  <span className="font-manrope mt-1 block text-sm text-muted">{item.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container className="py-14 md:py-20">
        <SectionHeading
          eyebrow="FAQ"
          title="Kalgoorlie gems & jewellery — common questions"
          align="left"
        />
        <dl className="mx-auto max-w-3xl space-y-8">
          {faqs.map((item) => (
            <div key={item.q}>
              <dt className="font-caslon text-xl text-foreground">{item.q}</dt>
              <dd className="font-manrope mt-2 text-sm leading-relaxed text-muted">{item.a}</dd>
            </div>
          ))}
        </dl>
        <p className="font-manrope mt-12 max-w-2xl text-sm text-muted">
          {siteConfig.contact.headOffice.label}: {siteConfig.contact.headOffice.lines.join(", ")}.{" "}
          <a
            href={`tel:${siteConfig.contact.phoneInternational.replace(/\s/g, "")}`}
            className="text-[#004B69] underline-offset-2 hover:underline"
          >
            {siteConfig.contact.phoneInternational}
          </a>
        </p>
      </Container>
    </div>
  );
}
