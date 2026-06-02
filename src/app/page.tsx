import { HeroSlider } from "@/components/home/hero-slider";
import { DualCta } from "@/components/home/dual-cta";
import { SpecialistsIntro } from "@/components/home/specialists-intro";
import { EditorialBlock } from "@/components/home/editorial-block";
import { HeritageSection } from "@/components/home/heritage-section";
import { CategoryShopGrid } from "@/components/home/category-shop-grid";
import { RecentlyAdded } from "@/components/home/recently-added";
import { FeaturedCollection } from "@/components/home/featured-collection";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { JournalTeaser } from "@/components/home/journal-teaser";
import {
  homeEditorialBlocks,
  heritageContent,
} from "@/data/home-content";
import { blogPosts } from "@/data/blog-posts";
import { getSiteContent } from "@/services/content-service";
import {
  getFeaturedProductsByCategory,
  getRecentlyAddedProducts,
} from "@/services/product-service";

export default async function HomePage() {
  const [content, sapphireProducts, jewelleryProducts, recentProducts] = await Promise.all([
    getSiteContent(),
    getFeaturedProductsByCategory("sapphires", 4),
    getFeaturedProductsByCategory("jewellery", 4),
    getRecentlyAddedProducts(4),
  ]);

  const journalPosts = blogPosts.slice(0, 3).map((p) => ({
    title: p.title,
    excerpt: p.excerpt,
    href: `/journal/${p.slug}`,
  }));

  return (
    <>
      <HeroSlider />
      <DualCta />
      <SpecialistsIntro />
      <RecentlyAdded products={recentProducts} />
      {homeEditorialBlocks.map((block) => (
        <EditorialBlock key={block.id} {...block} />
      ))}
      <HeritageSection {...heritageContent} />
      <CategoryShopGrid />
      <FeaturedCollection
        eyebrow="Featured collection"
        title="Exceptional Sapphires"
        products={sapphireProducts}
        viewAllHref="/catalog?category=sapphires"
      />
      <FeaturedCollection
        eyebrow="Featured collection"
        title="Fine Gemstone Jewellery"
        products={jewelleryProducts}
        viewAllHref="/catalog?category=jewellery"
      />
      <TestimonialsSection testimonials={content.testimonials} />
      <JournalTeaser posts={journalPosts} />
    </>
  );
}
