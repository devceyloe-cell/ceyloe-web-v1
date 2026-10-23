import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    slug: "sapphire-colours",
    title: "Sapphire Colours",
    excerpt: "Explore the full spectrum of sapphire colours beyond classic blue.",
    category: "Education",
    readTime: "6 min read",
    publishedAt: "2025-05-01",
    image: "/images/journal/education-sapphire-colours.webp",
    content: [
      "Sapphires are celebrated for their classic deep blue, but the sapphire family spans a remarkable range of hues — from soft pink and vivid yellow to teal, purple, and rare padparadscha.",
      "Colour is judged by hue, tone, and saturation. The most sought-after blues show a velvety cornflower character, while fancy-colour sapphires are valued for purity and balance of colour.",
      "Lighting matters when assessing colour. Natural daylight reveals a stone's true personality, which is why we present gemstones as close as possible to how they appear in person.",
      "Whether you prefer a timeless blue or a distinctive fancy colour, understanding the spectrum helps you choose a sapphire with lasting beauty and meaning.",
    ],
  },
  {
    slug: "gemstone-treatments",
    title: "Gemstone Treatments",
    excerpt: "Understand heat treatment and other common gemstone enhancements.",
    category: "Education",
    readTime: "7 min read",
    publishedAt: "2025-04-18",
    image: "/images/journal/education-treatments.webp",
    content: [
      "Most gemstones undergo some form of treatment to enhance appearance. Heat treatment of sapphires is an industry-standard practice that can improve colour and clarity.",
      "Other treatments may include diffusion or fracture filling. Untreated stones command premiums because of their rarity, and laboratory reports disclose treatment status clearly.",
      "At Ceyloe, we disclose treatments transparently. Untreated stones are clearly marked and priced accordingly so you can make an informed decision.",
      "When comparing prices, always factor in treatment history. Disclosure protects both beauty and long-term value.",
    ],
  },
  {
    slug: "certification-guide",
    title: "Certification at Ceyloe",
    excerpt:
      "Every Ceyloe gemstone is accompanied by a laboratory certificate, with optional GIA reports available upon request.",
    category: "Education",
    readTime: "3 min read",
    publishedAt: "2025-04-02",
    image: "/images/journal/education-certification.webp",
    content: [
      "Every Ceyloe gemstone is accompanied by a laboratory certificate, providing independent documentation of the gemstone’s identity and characteristics and greater confidence in your purchase. For clients who would also like a GIA laboratory report, Ceyloe is happy to arrange submission to GIA upon request. The applicable GIA laboratory, handling and associated costs are payable by the customer. We are committed to transparency and are always happy to help our clients understand the information provided in their gemstone reports.",
    ],
  },
  {
    slug: "birthstones",
    title: "Birthstones",
    excerpt: "Discover the meaning and beauty of traditional birthstones.",
    category: "Education",
    readTime: "5 min read",
    publishedAt: "2025-03-15",
    image: "/images/journal/education-birthstones.webp",
    content: [
      "Birthstones connect personal milestones with the beauty of natural gemstones. Each month carries a traditional stone with its own colour story and symbolism.",
      "From January garnet to September sapphire and December turquoise or zircon, birthstone jewellery offers a meaningful way to mark birthdays, anniversaries, and family heritage.",
      "Modern wearers often choose birthstones for colour preference as much as tradition — a blue sapphire or vivid spinel can feel both personal and timeless.",
      "Whether set in a ring, pendant, or kept as a loose stone, a birthstone gift carries meaning that lasts beyond fashion.",
    ],
  },
  {
    slug: "jewellery-care",
    title: "Jewellery Care",
    excerpt: "Tips to keep your gemstone jewellery beautiful for years.",
    category: "Jewellery",
    readTime: "5 min read",
    publishedAt: "2025-02-28",
    image: "/images/journal/education-jewellery-care.webp",
    content: [
      "Fine gemstone jewellery rewards gentle, regular care. Store pieces separately in soft pouches or padded boxes to avoid scratches from harder stones like sapphire and diamond.",
      "Clean with lukewarm water, mild soap, and a soft brush. Avoid harsh chemicals, ultrasonic cleaners for fragile settings, and extreme heat.",
      "Remove rings for heavy housework, gym sessions, and gardening. Prongs and settings should be checked periodically by a jeweller.",
      "With thoughtful care, your Ceyloe jewellery will keep its brilliance and remain ready to wear for years to come.",
    ],
  },
  {
    slug: "faq",
    title: "Frequently Asked Questions",
    excerpt: "Answers to common questions about buying gemstones.",
    category: "Education",
    readTime: "8 min read",
    publishedAt: "2025-02-10",
    image: "/images/journal/education-faq.webp",
    content: [
      "Are your gemstones natural? Yes — we specialise in natural, earth-mined gemstones with transparent sourcing and treatment disclosure.",
      "Do you provide certification? Premium stones are accompanied by independent laboratory documentation where applicable, and we explain what each report means.",
      "Can I create custom jewellery? Absolutely. Choose a gemstone and work with our team on a bespoke design through our custom jewellery process.",
      "How do I book advice? Contact us or book a private appointment to discuss colour, budget, certification, and setting options with our specialists.",
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
