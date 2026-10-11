import { heroSlides, getHeroSlideImage } from "@/data/hero-slides";

export const images = {
  logo: "/images/hero/ceyloe-logo.png",
  logoWhite: "/images/hero/ceyloe-logo-white.png",
  logoBlack: "/images/hero/ceyloe-logo-black.png",
  logoJewellery: "/images/hero/ceyloe-logo-jewellery.png",
  favicon: "/favicon.png",
  siteBackground: "/images/site-bg-sketch.jpg",
  hero: {
    poster: heroSlides[0].images.desktop,
    slides: heroSlides,
  },
  about: {
    main: "/images/about/pexels-shkrabaanthony-7167020-1320x880.jpg",
    secondary: "/images/about/3.jpg",
    team: "/images/about/2.jpg",
  },
  categories: {
    sapphires: "/images/covers/cards/sapphires.webp",
    spinel: "/images/covers/cards/spinels.webp",
    garnet: "/images/covers/cards/garnets.webp",
    zircon: "/images/covers/cards/other-gemstones.webp",
    jewellery: "/images/covers/bespoke-jewelry.webp",
  },
} as const;

/** Hero slide desktop image path for backward compatibility */
export function getHeroSlideSrc(slide: (typeof images.hero.slides)[number] | string): string {
  if (typeof slide === "string") return slide;
  return getHeroSlideImage(slide, "desktop");
}
