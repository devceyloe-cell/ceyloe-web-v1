import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { FacebookReviewsSection } from "@/components/reviews/facebook-reviews-section";
import { getSiteContent } from "@/services/content-service";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "Read what collectors and clients say about Ceyloe gemstones on Facebook and beyond.",
};

export default async function ReviewsPage() {
  const content = await getSiteContent();

  return (
    <div className="section-bg">
      <section className="border-b border-border bg-surface py-12 md:py-16">
        <Container>
          <h1 className="font-display text-4xl font-light sm:text-5xl">Customer Reviews</h1>
          <p className="mt-4 max-w-xl text-muted">
            Trusted by collectors and jewelry designers worldwide — see feedback from our Facebook
            community and valued clients.
          </p>
        </Container>
      </section>
      <FacebookReviewsSection />
      <TestimonialsSection testimonials={content.testimonials} />
    </div>
  );
}
