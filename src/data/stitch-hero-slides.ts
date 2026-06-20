import { stitchImages } from "@/config/stitch-images";
import { heroSlides } from "@/data/hero-slides";

export interface StitchHeroSlide {
  id: string;
  alt: string;
  images: {
    desktop: string;
    tablet: string;
    mobile: string;
  };
}

const stitchJewelrySlide: StitchHeroSlide = {
  id: "stitch-jewelry",
  alt: "Handcrafted gold ring with moss agate on velvet",
  images: {
    desktop: stitchImages.hero,
    tablet: stitchImages.hero,
    mobile: stitchImages.hero,
  },
};

const heroSlideIndices = [0, 1, 3] as const;

export const stitchHeroSlides: StitchHeroSlide[] = [
  stitchJewelrySlide,
  ...heroSlideIndices.map((i) => {
    const slide = heroSlides[i];
    return {
      id: slide.id,
      alt: slide.alt,
      images: slide.images,
    };
  }),
];
