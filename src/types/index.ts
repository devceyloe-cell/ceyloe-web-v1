export interface GemstoneSpec {
  carat?: string;
  color?: string;
  clarity?: string;
  cut?: string;
  origin?: string;
  treatment?: string;
  certification?: string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  image: string;
  images: string[];
  featured?: boolean;
  specs: GemstoneSpec;
  certificationUrl?: string;
  inStock: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  product?: string;
}

export interface Certification {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface BrandStory {
  title: string;
  paragraphs: string[];
  image: string;
}

export interface SiteContent {
  hero: HeroContent;
  brandStory: BrandStory;
  testimonials: Testimonial[];
  certifications: Certification[];
}

export interface CatalogFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price-asc" | "price-desc" | "newest" | "featured";
  search?: string;
}
