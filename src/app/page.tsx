import { HeroVideo } from "@/components/home/hero-video";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { FeaturedProducts } from "@/components/home/featured-products";
import { BrandStorySection } from "@/components/home/brand-story";
import { CertificationsTeaser } from "@/components/home/certifications-teaser";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { getSiteContent } from "@/services/content-service";
import { getFeaturedProducts } from "@/services/product-service";

export default async function HomePage() {
  const [content, featuredProducts] = await Promise.all([
    getSiteContent(),
    getFeaturedProducts(4),
  ]);

  return (
    <>
      <HeroVideo content={content.hero} />
      <CategoryShowcase />
      <FeaturedProducts products={featuredProducts} />
      <BrandStorySection content={content.brandStory} />
      <CertificationsTeaser certifications={content.certifications} />
      <TestimonialsSection testimonials={content.testimonials} />
    </>
  );
}
