export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  alt: string;
  images: {
    desktop: string;
    tablet: string;
    mobile: string;
  };
}

export const heroSlides: HeroSlide[] = [
  {
    id: "hero-main",
    eyebrow: "Your kind of",
    title: "Precious Gemstones & Custom Jewellery",
    highlight: "Extraordinary",
    subtitle:
      "Bringing you some of Earth's finest precious gemstones — the ultimate one-of-a-kind luxury. Whether adding to your collection, searching for fine jewellery, or creating a custom piece, this is the place for you.",
    ctaLabel: "Explore Collection",
    ctaHref: "/catalog",
    alt: "Fine gemstone and jewellery collection",
    images: {
      desktop: "/images/hero/slide-1-desktop.webp",
      tablet: "/images/hero/slide-1-tablet.webp",
      mobile: "/images/hero/slide-1-mobile.webp",
    },
  },
  {
    id: "ruby-pendant",
    eyebrow: "Fine jewellery",
    title: "Ruby & Diamond Pendant",
    subtitle:
      "A vivid oval ruby surrounded by a brilliant diamond halo — timeless luxury on a fine gold chain.",
    ctaLabel: "Shop Pendants",
    ctaHref: "/catalog?category=jewellery",
    alt: "Gold ruby and diamond halo pendant necklace on green satin",
    images: {
      desktop: "/images/hero/slide-2-desktop.webp",
      tablet: "/images/hero/slide-2-tablet.webp",
      mobile: "/images/hero/slide-2-mobile.webp",
    },
  },
  {
    id: "gemstone-rings",
    eyebrow: "Coloured gemstones",
    title: "Coloured Gemstone Rings",
    subtitle:
      "Emerald, aquamarine and ruby set in artisan gold — bold colour, distinctive design, and lasting craftsmanship.",
    ctaLabel: "Shop Rings",
    ctaHref: "/catalog?category=jewellery",
    alt: "Three oval gemstone rings in emerald green, aquamarine and ruby red",
    images: {
      desktop: "/images/hero/slide-3-desktop.webp",
      tablet: "/images/hero/slide-3-tablet.webp",
      mobile: "/images/hero/slide-3-mobile.webp",
    },
  },
  {
    id: "gem-collection",
    eyebrow: "Natural gemstones",
    title: "Exceptional Natural Gems",
    subtitle:
      "Sapphires, emeralds, rubies and more — a curated spectrum of earth-mined stones in every cut and colour.",
    ctaLabel: "Explore Collection",
    ctaHref: "/catalog",
    alt: "Assorted faceted gemstones in blue, green, red and purple displayed in a seashell",
    images: {
      desktop: "/images/hero/slide-4-desktop.webp",
      tablet: "/images/hero/slide-4-tablet.webp",
      mobile: "/images/hero/slide-4-mobile.webp",
    },
  },
  {
    id: "raw-aquamarine",
    eyebrow: "Raw & natural",
    title: "Raw Aquamarine Beauty",
    subtitle:
      "Uncut aquamarine in its natural form — the raw elegance of Ceylon's finest stones before they become masterpieces.",
    ctaLabel: "Shop Aquamarine",
    ctaHref: "/catalog",
    alt: "Large raw translucent aquamarine crystal on smooth river stones",
    images: {
      desktop: "/images/hero/slide-5-desktop.webp",
      tablet: "/images/hero/slide-5-tablet.webp",
      mobile: "/images/hero/slide-5-mobile.webp",
    },
  },
  {
    id: "teal-bracelet",
    eyebrow: "Bespoke creations",
    title: "Teal Gemstone Bracelet",
    subtitle:
      "Polished teal and seafoam stones in sterling silver — a one-of-a-kind bracelet crafted for the discerning collector.",
    ctaLabel: "View Portfolio",
    ctaHref: "/portfolio",
    alt: "Teal and green gemstone bracelet with silver settings draped on a white lace mask",
    images: {
      desktop: "/images/hero/slide-7-desktop.webp",
      tablet: "/images/hero/slide-7-tablet.webp",
      mobile: "/images/hero/slide-7-mobile.webp",
    },
  },
];

export function getHeroSlideImage(slide: HeroSlide, variant: keyof HeroSlide["images"] = "desktop") {
  return slide.images[variant];
}
