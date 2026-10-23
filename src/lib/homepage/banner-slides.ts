export type HomepageBannerSlide = {
  id: string;
  image: string;
  alt?: string;
};

export type HomepageBannerSlides = {
  slides: HomepageBannerSlide[];
  updatedAt?: string;
};

export const MIN_BANNER_SLIDES = 3;
export const MAX_BANNER_SLIDES = 5;

export const DEFAULT_BANNER_IMAGE = "/images/covers/hero-image.webp";

/** Default 3 slides — same artwork until admin uploads more. */
export const DEFAULT_HOMEPAGE_BANNER_SLIDES: HomepageBannerSlides = {
  slides: [
    {
      id: "slide-1",
      image: DEFAULT_BANNER_IMAGE,
      alt: "Natural Ceylon gemstones",
    },
    {
      id: "slide-2",
      image: "/images/covers/all-sapphires.webp",
      alt: "Ceylon sapphires",
    },
    {
      id: "slide-3",
      image: "/images/covers/gemstones-hero.webp",
      alt: "Fine gemstone collection",
    },
  ],
};

export function normalizeHomepageBannerSlides(
  input: Partial<HomepageBannerSlides> | null | undefined,
): HomepageBannerSlides {
  const base = DEFAULT_HOMEPAGE_BANNER_SLIDES;
  const slides = Array.isArray(input?.slides)
    ? input!.slides
        .map((item, index) => ({
          id: String(item?.id || `slide-${index + 1}`),
          image: String(item?.image || "").trim(),
          alt: item?.alt ? String(item.alt).trim() : undefined,
        }))
        .filter((item) => item.image)
        .slice(0, MAX_BANNER_SLIDES)
    : base.slides.map((s) => ({ ...s }));

  // Ensure at least default set if empty
  const ensured = slides.length > 0 ? slides : base.slides.map((s) => ({ ...s }));

  return {
    slides: ensured,
    updatedAt: input?.updatedAt,
  };
}

export function validateBannerSlideCount(slides: HomepageBannerSlide[]): string | null {
  if (slides.length < MIN_BANNER_SLIDES) {
    return `Add at least ${MIN_BANNER_SLIDES} banner images.`;
  }
  if (slides.length > MAX_BANNER_SLIDES) {
    return `You can use at most ${MAX_BANNER_SLIDES} banner images.`;
  }
  if (slides.some((s) => !s.image)) {
    return "Every slide needs an image.";
  }
  return null;
}
