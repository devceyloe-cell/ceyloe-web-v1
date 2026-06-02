export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  alt: string;
  images: {
    desktop: string;
    tablet: string;
    mobile: string;
  };
  attribution?: {
    source: "Pexels" | "Unsplash";
    photographer: string;
    url: string;
  };
}

export const heroSlides: HeroSlide[] = [
  {
    id: "certified-sapphires",
    eyebrow: "Certified Ceylon Sapphires",
    title: "Certified Ceylon Sapphires",
    subtitle:
      "Close-up macro shots of ethically sourced blue sapphires — GIA certified, premium lighting, and the deep colour Sri Lanka is known for.",
    ctaLabel: "Shop Sapphires",
    ctaHref: "/catalog?category=sapphires",
    alt: "Close-up macro blue sapphire gemstone on a dark background with premium lighting",
    images: {
      desktop: "/images/hero/slide-1-desktop.webp",
      tablet: "/images/hero/slide-1-tablet.webp",
      mobile: "/images/hero/slide-1-mobile.webp",
    },
  },
  {
    id: "mine-to-masterpiece",
    eyebrow: "From Mine to Masterpiece",
    title: "From Mine to Masterpiece",
    subtitle:
      "Witness the gem cutting and polishing process — Sri Lankan craftsmanship that transforms raw stones into museum-quality treasures.",
    ctaLabel: "Our Heritage",
    ctaHref: "/heritage",
    alt: "Gem cutter polishing a gemstone, showcasing Sri Lankan craftsmanship",
    images: {
      desktop: "/images/hero/slide-2-desktop.webp",
      tablet: "/images/hero/slide-2-tablet.webp",
      mobile: "/images/hero/slide-2-mobile.webp",
    },
  },
  {
    id: "custom-jewelry",
    eyebrow: "Custom Jewelry Creations",
    title: "Custom Jewelry Creations",
    subtitle:
      "Luxury sapphire rings and bespoke engagement pieces — designed around your stone, your story, and your moment.",
    ctaLabel: "Design Your Ring",
    ctaHref: "/custom-jewelry",
    alt: "Luxury sapphire engagement ring with premium gold band",
    images: {
      desktop: "/images/hero/slide-3-desktop.webp",
      tablet: "/images/hero/slide-3-tablet.webp",
      mobile: "/images/hero/slide-3-mobile.webp",
    },
  },
  {
    id: "worldwide-shipping",
    eyebrow: "Worldwide Shipping",
    title: "Worldwide Shipping",
    subtitle:
      "Every gemstone ships with full certification and secure international delivery — trusted by collectors across the globe.",
    ctaLabel: "View Certificates",
    ctaHref: "/transparency",
    alt: "Gemstone with certification documentation, representing trusted worldwide shipping",
    images: {
      desktop: "/images/hero/slide-4-desktop.webp",
      tablet: "/images/hero/slide-4-tablet.webp",
      mobile: "/images/hero/slide-4-mobile.webp",
    },
    attribution: {
      source: "Pexels",
      photographer: "Karolina Grabowska",
      url: "https://www.pexels.com/photo/person-holding-white-printer-paper-3943743/",
    },
  },
];

export function getHeroSlideImage(slide: HeroSlide, variant: keyof HeroSlide["images"] = "desktop") {
  return slide.images[variant];
}
