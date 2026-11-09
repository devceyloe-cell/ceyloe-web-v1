import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Gemstones in Perth | Ceylon Sapphires & Bespoke Jewellery",
  description:
    "Ceyloe supplies certified Ceylon gemstones to Perth and Western Australia — sapphires, spinel and bespoke jewellery, with private appointments and secure Australia-wide delivery.",
  keywords: [
    "gemstones Perth",
    "sapphire dealer Perth",
    "Ceylon sapphire Perth",
    "buy gemstones Perth WA",
    "bespoke jewellery Perth",
    "unheated blue sapphire Perth",
  ],
  alternates: {
    canonical: `${siteConfig.url.replace(/\/$/, "")}/perth`,
  },
  openGraph: {
    title: "Gemstones in Perth | Ceyloe",
    description:
      "Certified Ceylon gemstones for Perth & WA — private appointments, curated sapphires, and bespoke jewellery.",
    url: `${siteConfig.url.replace(/\/$/, "")}/perth`,
    type: "website",
    locale: siteConfig.locale,
  },
};

const faqs = [
  {
    q: "Do you have a gemstone store in Perth?",
    a: "Our head office is in Kalgoorlie, WA. We serve Perth clients with private appointments by arrangement, secure Australia-wide shipping, and remote consultations via phone or WhatsApp.",
  },
  {
    q: "Can I buy a Ceylon sapphire and have it delivered in Perth?",
    a: "Yes. We ship certified natural gemstones securely across Perth and Western Australia, with insured delivery options.",
  },
  {
    q: "Can I book a private viewing for a Perth engagement ring?",
    a: "Yes. Book an appointment to select a stone and discuss bespoke jewellery design — including engagement rings set with Ceylon sapphires or other natural gems.",
  },
] as const;

const links = [
  { href: "/gemstones", label: "Browse natural gemstones", desc: "Sapphires, spinel, garnet and more" },
  { href: "/custom-jewelry", label: "Bespoke jewellery", desc: "Design a piece around your stone" },
  { href: "/book", label: "Book an appointment", desc: "Private consultation for Perth & WA" },
  { href: "/contact", label: "Contact Ceyloe", desc: "Phone, WhatsApp or email" },
] as const;

export default function PerthGemstonesPage() {
  const base = siteConfig.url.replace(/\/$/, "");
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
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      { "@type": "ListItem", position: 2, name: "Gemstones in Perth", item: `${base}/perth` },
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
          <p className="subheading-caps mb-4 tracking-[0.2em] text-rich-gold">Perth & Western Australia</p>
          <h1 className="font-caslon max-w-3xl text-4xl font-light text-foreground sm:text-5xl">
            Ceylon gemstones for Perth
          </h1>
          <p className="font-manrope mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            Ceyloe sources fine natural gemstones from Sri Lanka and curates them for collectors and
            jewellery lovers in Perth and across WA — certified stones, transparent origin, and
            personal service from our Kalgoorlie head office.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/gemstones"
              className="inline-flex items-center justify-center rounded-sm bg-[#004B69] px-6 py-3 font-manrope text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Shop gemstones
            </Link>
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-sm border border-[#004B69] px-6 py-3 font-manrope text-sm font-semibold text-[#004B69] transition-colors hover:bg-[#004B69]/5"
            >
              Book appointment
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-14 md:py-20">
        <SectionHeading
          eyebrow="Why Perth clients choose Ceyloe"
          title="Natural stones. Local service."
          description="Whether you are searching for an unheated blue sapphire, a padparadscha, or a bespoke setting, we help Perth buyers choose with confidence."
          align="left"
        />
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Certified Ceylon gems",
              body: "Ethically sourced stones from our Sri Lanka mining and production network — selected for colour, clarity and cut.",
            },
            {
              title: "Perth & WA delivery",
              body: "Secure, insured shipping across Perth and Western Australia, plus Australia-wide delivery for collectors further afield.",
            },
            {
              title: "Private appointments",
              body: "View stones and discuss custom jewellery by appointment. Call or WhatsApp to arrange a consultation that suits you.",
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
            title="Start your search"
            description="Popular paths for Perth gemstone and jewellery buyers."
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
          title="Gemstones in Perth — common questions"
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
          Head office: {siteConfig.contact.headOffice.lines.join(", ")}. Serving{" "}
          {siteConfig.contact.serviceAreas.join(", ")}.{" "}
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
