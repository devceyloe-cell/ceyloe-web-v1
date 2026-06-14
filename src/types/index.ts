export interface GemstoneSpec {
  carat?: string;
  caratWeight?: number;
  color?: string;
  clarity?: string;
  cut?: string;
  shape?: string;
  origin?: string;
  treatment?: string;
  certification?: string;
  certificateNumber?: string;
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
  videoUrl?: string;
  featured?: boolean;
  isNew?: boolean;
  createdAt?: string;
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
  date?: string;
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
  color?: string;
  shape?: string;
  origin?: string;
  minPrice?: number;
  maxPrice?: number;
  minCarat?: number;
  maxCarat?: number;
  sort?: "price-asc" | "price-desc" | "newest" | "featured";
  search?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  image: string;
  content: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  stone?: string;
  metal?: string;
}

export interface RecommendRequest {
  budget?: number;
  color?: string;
  shape?: string;
  minCarat?: number;
  occasion?: string;
}

export interface RecommendResult {
  products: Product[];
  message: string;
}
