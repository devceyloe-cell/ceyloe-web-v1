import { heroSlides, getHeroSlideImage } from "@/data/hero-slides";

export const images = {
  logo: "/images/Home/logo2.png",
  favicon: "/favicon.png",
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
    sapphires: "/images/Sapphires/14-2_web-1.jpg",
    spinel: "/images/Spinel/110423001-14.jpg",
    garnet: "/images/Garnet/1112023001-1.jpg",
    zircon: "/images/Zircon/110423001-24.jpg",
    jewellery: "/images/Jewellery/130723001-1.jpg",
  },
} as const;

/** Hero slide desktop image path for backward compatibility */
export function getHeroSlideSrc(slide: (typeof images.hero.slides)[number] | string): string {
  if (typeof slide === "string") return slide;
  return getHeroSlideImage(slide, "desktop");
}
