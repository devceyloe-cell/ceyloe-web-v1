import { images, getHeroSlideSrc } from "@/config/images";

export const homeEditorialBlocks = [
  {
    id: "loose-gemstones",
    eyebrow: "Loose Gemstones",
    title: "Natural Earth-Mined Gemstones",
    paragraphs: [
      "Browse our exquisite range of natural gemstones formed over thousands of years. Each stone is presented for its beauty, rarity, and highest quality — as close as possible to how they appear in natural light.",
      "From sapphires to spinel and garnet, our passion is to provide genuine, ethically sourced stones you can trust.",
    ],
    image: images.categories.sapphires,
    imagePosition: "right" as const,
    links: [
      { label: "Loose Gemstones", href: "/gemstones" },
      { label: "View Catalog", href: "/catalog" },
    ],
  },
  {
    id: "custom-jewellery",
    eyebrow: "Custom made",
    title: "Fine Gemstone Jewellery",
    paragraphs: [
      "Creating bespoke jewellery with a natural gemstone is an exhilarating experience. Select a stone from our collection and personalise the design to suit your individual taste.",
      "Our craftsmen work with certified gemstones sourced directly from Sri Lanka, offering exceptional value and quality you can pride now and in the future.",
    ],
    image: images.categories.jewellery,
    imagePosition: "left" as const,
    links: [
      { label: "Browse Jewellery", href: "/catalog?category=jewellery" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    id: "sapphire-rings",
    eyebrow: "Sapphire Rings",
    title: "Design Your Dream Piece",
    paragraphs: [
      "Sapphire is among the most durable coloured gemstones in the world, making it an ideal centrepiece in any jewellery item. We begin by selecting the natural gemstone, then tailoring the design around it.",
      "Serving clients worldwide from Australia, with mining and production rooted in Sri Lanka.",
    ],
    image: getHeroSlideSrc(images.hero.slides[2]),
    imagePosition: "right" as const,
    links: [
      { label: "Select a Sapphire", href: "/gemstones/sapphires" },
      { label: "About Us", href: "/about" },
    ],
  },
];

export const heritageContent = {
  eyebrow: "Gemstones are our heritage",
  title: "Sourced Directly from Sri Lanka",
  paragraphs: [
    "With our Sri Lankan heritage and direct sourcing, you can be confident your chosen gemstone is of the highest quality — offering great value to treasure now and in the future.",
    "From our mining and production office in Minuwangoda to our head office in Kalgoorlie, Ceyloe connects the source to you with full transparency.",
  ],
  image: images.about.main,
  cta: { label: "Our Story", href: "/about" },
};

export const trustItems = [
  {
    title: "Express shipping",
    description: "Insured worldwide delivery on all orders.",
  },
  {
    title: "Payment secured",
    description: "Trusted, secure checkout for every purchase.",
  },
  {
    title: "Money back guarantee",
    description: "Guaranteed refund if there is any issue with your order.",
  },
];

export const journalPosts = [
  {
    title: "The Art of Ceylon Sapphires",
    excerpt:
      "Discover why earth-mined Ceylon sapphires remain among the most sought-after gemstones in the world.",
    href: "/about",
  },
  {
    title: "From Mine to Market",
    excerpt:
      "How our Kalgoorlie and Minuwangoda teams ensure ethical sourcing and quality at every step.",
    href: "/about",
  },
  {
    title: "Choosing Your Perfect Stone",
    excerpt:
      "A guide to colour, clarity, cut, and certification when selecting a loose gemstone.",
    href: "/faq",
  },
];
