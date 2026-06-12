import { StitchHero } from "@/components/home/stitch-hero";
import { StitchBentoGrid } from "@/components/home/stitch-bento-grid";
import { StitchFeaturedProducts } from "@/components/home/stitch-featured-products";
import { StitchBespoke } from "@/components/home/stitch-bespoke";
import { StitchFounder } from "@/components/home/stitch-founder";
import { StitchJournal } from "@/components/home/stitch-journal";
import { NewsletterSignup } from "@/components/layout/newsletter-signup";
import { blogPosts } from "@/data/blog-posts";
import { getFeaturedProductsByCategory } from "@/services/product-service";

export default async function HomePage() {
  const jewelleryProducts = await getFeaturedProductsByCategory("jewellery", 3);

  const journalPosts = blogPosts.slice(0, 3).map((p) => ({
    title: p.title,
    excerpt: p.excerpt,
    href: `/journal/${p.slug}`,
    image: p.image,
    category: p.category,
    readTime: p.readTime,
  }));

  return (
    <>
      <StitchHero />
      <StitchBentoGrid />
      <StitchFeaturedProducts products={jewelleryProducts} />
      <StitchBespoke />
      <StitchFounder />
      <StitchJournal posts={journalPosts} />
      <NewsletterSignup />
    </>
  );
}
