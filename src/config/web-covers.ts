export const COVER_GOLD = "#C09A4A";

export interface WebCoverCta {
  label: string;
  href: string;
  external?: boolean;
}

export interface WebCoverContent {
  image: string;
  eyebrow?: string;
  title?: string;
  titleLines?: string[];
  lead?: string;
  description?: string;
  tagline?: string;
  primaryCta?: WebCoverCta;
  secondaryCta?: WebCoverCta;
  /** Text panel tone — thank-you uses light */
  tone?: "dark" | "light";
  /** Background overlay — dark gradient (default) */
  overlay?: "dark";
  imagePosition?: string;
}

function coverPath(name: string) {
  return `/images/covers/${name}`;
}

const home: WebCoverContent = {
  image: coverPath("blue-s.webp"),
  eyebrow: "Sri Lanka's Finest Treasures",
  titleLines: ["Natural Ceylon", "Gemstones"],
  tagline: "Curated in Australia | Sourced in Sri Lanka",
  primaryCta: { label: "Explore Gemstones", href: "/gemstones" },
  secondaryCta: { label: "Book a Private Appointment", href: "/book" },
  overlay: "dark",
  imagePosition: "right center",
};

const ourGemstones: WebCoverContent = {
  image: coverPath("our-gemstones.webp"),
  eyebrow: "Explore Our",
  titleLines: ["Gemstones"],
  description: "Discover a world of rare, natural and exceptional beauty.",
  primaryCta: { label: "Browse Collection", href: "/gemstones#natural-gemstones-heading" },
  tone: "light",
  imagePosition: "right center",
};

const bespokeJewelry: WebCoverContent = {
  image: coverPath("bespoke-jewelry.webp"),
  titleLines: ["Bespoke", "Jewellery"],
  description: "Your vision. Our craftsmanship. Timeless jewellery, made just for you.",
  primaryCta: { label: "Design Your Piece", href: "/custom-jewelry#design-form" },
  tone: "light",
  imagePosition: "right center",
};

const ourStory: WebCoverContent = {
  image: coverPath("our-story.webp"),
  titleLines: ["Our Story"],
  description:
    "From our family mines in Sri Lanka to you in Australia. A journey of passion, heritage and trust.",
  primaryCta: { label: "Our Journey", href: "/about#journey-heading" },
  tone: "light",
  imagePosition: "right center",
};

const education: WebCoverContent = {
  image: coverPath("education.webp"),
  titleLines: ["Education"],
  description: "Learn, discover and be inspired by the world of gemstones.",
  primaryCta: { label: "Explore Articles", href: "/journal#education-topics" },
  tone: "light",
  imagePosition: "right center",
};

const contact: WebCoverContent = {
  image: coverPath("contact.webp"),
  titleLines: ["Get In Touch"],
  description: "We're here to help you find the perfect gemstone.",
  primaryCta: { label: "Contact Us", href: "/contact#contact-form" },
  tone: "light",
  imagePosition: "right center",
};

const bookAppointment: WebCoverContent = {
  image: coverPath("book-appointment.webp"),
  titleLines: ["Book Your", "Appointment"],
  description: "Experience our gemstones up close in a private setting.",
  primaryCta: { label: "Book Now", href: "/book#appointment-form" },
  tone: "light",
  imagePosition: "right center",
};

const showroom: WebCoverContent = {
  image: coverPath("showroom.webp"),
  eyebrow: "Showroom",
  titleLines: ["Visit Us"],
  description: "View our gemstones in person in a private setting.",
  primaryCta: { label: "Book Appointment", href: "/book" },
  overlay: "dark",
};

const sapphires: WebCoverContent = {
  image: coverPath("sapphires.webp"),
  titleLines: ["Sapphires"],
  description: "Explore our finest sapphire collection.",
  primaryCta: {
    label: "Explore Sapphires",
    href: "/gemstones/sapphires#sapphires-collection",
  },
  tone: "light",
  imagePosition: "right center",
};

const blueSapphires: WebCoverContent = {
  image: coverPath("blue-sapphires.webp"),
  titleLines: ["Blue", "Sapphires"],
  description: "Classic Ceylon blues — from soft cornflower to deep royal.",
  primaryCta: {
    label: "Browse Blue Sapphires",
    href: "/catalog?category=sapphires&color=blue",
  },
  overlay: "dark",
};

const blueSapphireCollection: WebCoverContent = {
  image: coverPath("blue-sapphire-collection.webp"),
  titleLines: ["Blue Sapphire", "Collection"],
  description: "Curated selection of fine blue Ceylon sapphires.",
  primaryCta: {
    label: "View Collection",
    href: "/catalog?category=sapphires&color=blue",
  },
  overlay: "dark",
};

const pinkSapphires: WebCoverContent = {
  image: coverPath("pink-sapphires.webp"),
  titleLines: ["Pink", "Sapphires"],
  description: "Romantic pinks from soft blush to vivid fuchsia.",
  primaryCta: {
    label: "Browse Pink Sapphires",
    href: "/catalog?category=sapphires&color=pink",
  },
  overlay: "dark",
};

const yellowSapphires: WebCoverContent = {
  image: coverPath("yellow-sapphires.webp"),
  titleLines: ["Yellow", "Sapphires"],
  description: "Warm golden and canary yellow Ceylon sapphires.",
  primaryCta: {
    label: "Browse Yellow Sapphires",
    href: "/catalog?category=sapphires&color=yellow",
  },
  overlay: "dark",
};

const tealSapphires: WebCoverContent = {
  image: coverPath("teal-sapphires.webp"),
  titleLines: ["Teal", "Sapphires"],
  description: "Distinctive blue-green tones unique to nature.",
  primaryCta: {
    label: "Browse Teal Sapphires",
    href: "/catalog?category=sapphires&color=teal",
  },
  overlay: "dark",
};

const partiSapphires: WebCoverContent = {
  image: coverPath("parti-sapphires.webp"),
  titleLines: ["Parti", "Sapphires"],
  description: "Multi-colour stones with striking colour zoning.",
  primaryCta: {
    label: "Browse Parti Sapphires",
    href: "/catalog?category=sapphires&color=parti",
  },
  overlay: "dark",
};

const padparadscha: WebCoverContent = {
  image: coverPath("padparadscha.webp"),
  titleLines: ["Padparadscha"],
  description: "Rare lotus-blossom pink-orange sapphires.",
  primaryCta: {
    label: "Browse Padparadscha",
    href: "/catalog?category=sapphires&color=padparadscha",
  },
  overlay: "dark",
};

const allSapphires: WebCoverContent = {
  image: coverPath("all-sapphires.webp"),
  titleLines: ["All", "Sapphires"],
  description: "Browse every sapphire in our curated collection.",
  primaryCta: { label: "View All Sapphires", href: "/catalog?category=sapphires" },
  overlay: "dark",
};

const spinels: WebCoverContent = {
  image: coverPath("spinels.webp"),
  titleLines: ["Spinels"],
  description: "Vibrant. Rare. Remarkable.",
  primaryCta: { label: "Browse Spinels", href: "/gemstones/spinel" },
  tone: "light",
  imagePosition: "right center",
};

const garnets: WebCoverContent = {
  image: coverPath("garnets.webp"),
  titleLines: ["Garnets"],
  description: "Rich colours. Timeless beauty.",
  primaryCta: { label: "Browse Garnets", href: "/gemstones/garnet" },
  tone: "light",
  imagePosition: "right center",
};

const topaz: WebCoverContent = {
  image: coverPath("topaz.webp"),
  titleLines: ["Topaz"],
  description: "Rich colours. Timeless beauty.",
  primaryCta: { label: "Browse Topaz", href: "/gemstones/topaz" },
  tone: "light",
  imagePosition: "right center",
};

const citrine: WebCoverContent = {
  image: coverPath("citrine.webp"),
  titleLines: ["Citrine"],
  description: "Warm golden and honey hues.",
  primaryCta: { label: "Browse Citrine", href: "/gemstones/citrine" },
  tone: "light",
  imagePosition: "right center",
};

const otherGemstones: WebCoverContent = {
  image: coverPath("other-gemstones.webp"),
  titleLines: ["Other", "Gemstones"],
  description: "Rare and exceptional finds beyond our core collections.",
  primaryCta: { label: "Browse Collection", href: "/gemstones/other" },
  tone: "light",
  imagePosition: "right center",
};

const allGemstones: WebCoverContent = {
  image: coverPath("all-gemstones.webp"),
  titleLines: ["All", "Gemstones"],
  description: "Browse the complete curated collection.",
  primaryCta: { label: "Browse Catalog", href: "/catalog" },
  overlay: "dark",
};

const cart: WebCoverContent = {
  image: coverPath("cart.webp"),
  titleLines: ["Your Cart"],
  description: "Review your selected gemstones.",
  primaryCta: { label: "Continue Shopping", href: "/catalog" },
  tone: "light",
  imagePosition: "right center",
};

const thankYou: WebCoverContent = {
  image: coverPath("thank-you.webp"),
  eyebrow: "Order Confirmed",
  titleLines: ["Thank", "You"],
  description: "We look forward to sharing your gemstone journey.",
  primaryCta: { label: "Continue Shopping", href: "/catalog" },
  tone: "light",
  overlay: "dark",
};

/** All web cover graphics keyed for pages and catalog filters. */
export const webCovers = {
  home,
  ourGemstones,
  bespokeJewelry,
  ourStory,
  education,
  contact,
  bookAppointment,
  showroom,
  sapphires,
  blueSapphires,
  blueSapphireCollection,
  pinkSapphires,
  yellowSapphires,
  tealSapphires,
  partiSapphires,
  padparadscha,
  allSapphires,
  spinels,
  garnets,
  topaz,
  citrine,
  otherGemstones,
  allGemstones,
  cart,
  thankYou,
} as const;

export type WebCoverKey = keyof typeof webCovers;

export function getWebCover(key: WebCoverKey): WebCoverContent {
  return webCovers[key];
}

/** Resolve catalog cover from category + optional color query. */
export function getCatalogCoverKey(
  category?: string | null,
  color?: string | null,
): WebCoverKey {
  const cat = (category ?? "").toLowerCase();
  const col = (color ?? "").toLowerCase();

  if (cat === "sapphires" || cat === "sapphire") {
    if (col === "blue") return "blueSapphireCollection";
    if (col === "pink") return "pinkSapphires";
    if (col === "yellow") return "yellowSapphires";
    if (col === "teal") return "tealSapphires";
    if (col === "parti") return "partiSapphires";
    if (col === "padparadscha") return "padparadscha";
    return "allSapphires";
  }

  if (cat === "spinel" || cat === "spinels") return "spinels";
  if (cat === "garnet" || cat === "garnets") return "garnets";
  if (cat === "topaz") return "topaz";
  if (cat === "citrine") return "citrine";
  if (cat === "other") return "otherGemstones";

  return "allGemstones";
}
