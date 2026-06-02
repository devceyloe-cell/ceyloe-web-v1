import type { SiteContent } from "@/types";
import { images } from "@/config/images";

export const mockSiteContent: SiteContent = {
  hero: {
    headline: "Specialists in Fine Natural Gemstones",
    subheadline:
      "Every bespoke creation begins with choosing an extraordinary natural gemstone — ethically sourced and certified from Sri Lanka.",
    ctaLabel: "Explore Collection",
    ctaHref: "/catalog",
  },
  brandStory: {
    title: "From Mother Earth to Your Jewellery",
    paragraphs: [
      "Each stone carries a unique story that begins far from store windows. Grown in the soils of Sri Lanka, our gemstones are collected with special trepidation — each one is not just a mineral, but part of a cultural heritage.",
      "These stones create a bond between those who mine them and those who wear them. Knowing that each product has been mined ethically and with respect for tradition, you can feel confident in your choices.",
    ],
    image: images.about.main,
  },
  testimonials: [
    {
      id: "1",
      name: "Sarah Mitchell",
      location: "London, UK",
      quote:
        "The padparadscha sapphire exceeded every expectation. The certification gave me complete confidence, and the stone's colour is breathtaking in natural light.",
      rating: 5,
      product: "Padparadscha Sapphire",
    },
    {
      id: "2",
      name: "James Chen",
      location: "Singapore",
      quote:
        "Ceyloe's transparency about sourcing and treatment history sets them apart. My blue sapphire is flawless and arrived with full GIA documentation.",
      rating: 5,
      product: "Blue Sapphire",
    },
    {
      id: "3",
      name: "Elena Rodriguez",
      location: "Madrid, Spain",
      quote:
        "Working with Ceyloe for a custom engagement ring was seamless. Their expertise in Ceylon gemstones is unmatched — truly a luxury experience.",
      rating: 5,
      product: "Yellow Sapphire",
    },
  ],
  certifications: [
    {
      id: "1",
      title: "GIA Certified",
      description:
        "Every premium gemstone is accompanied by a Gemological Institute of America report verifying authenticity, treatment, and quality.",
      icon: "shield",
    },
    {
      id: "2",
      title: "Ethical Sourcing",
      description:
        "Direct relationships with Sri Lankan miners ensure fair wages, responsible extraction, and full traceability from mine to market.",
      icon: "leaf",
    },
    {
      id: "3",
      title: "Treatment Disclosure",
      description:
        "Complete transparency on any treatments applied. Untreated stones are clearly marked and priced accordingly.",
      icon: "eye",
    },
    {
      id: "4",
      title: "Secure Shipping",
      description:
        "Fully insured, tamper-evident packaging with tracked international delivery to over 50 countries.",
      icon: "package",
    },
  ],
};
