import { stitchImages } from "@/config/stitch-images";
import { heroSlides } from "@/data/hero-slides";

export interface LandingHeroSlide {
  id: string;
  alt: string;
  images: {
    desktop: string;
    tablet: string;
    mobile: string;
  };
}

function fromHeroSlide(index: number): LandingHeroSlide {
  const slide = heroSlides[index];
  return {
    id: slide.id,
    alt: slide.alt,
    images: slide.images,
  };
}

/** Three hero backgrounds for the landing page slideshow. */
export const landingHeroSlides: LandingHeroSlide[] = [
  {
    id: "stitch-jewelry",
    alt: "Sapphire and diamond ring on natural stone",
    images: {
      desktop: stitchImages.hero,
      tablet: stitchImages.hero,
      mobile: stitchImages.hero,
    },
  },
  fromHeroSlide(0),
  fromHeroSlide(1),
];
