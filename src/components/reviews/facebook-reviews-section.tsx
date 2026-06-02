"use client";

import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import { facebookPageUrl, facebookReviewStats, facebookReviews } from "@/data/facebook-reviews";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

export function FacebookReviewsSection() {
  return (
    <section className="border-t border-border py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Facebook Reviews"
          title="What Our Customers Say"
          description="Real feedback from collectors and clients on our Facebook community."
        />

        <div className="mb-10 flex flex-wrap items-center gap-4 border border-border bg-surface px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-sm font-medium text-heading">
              {facebookReviewStats.averageRating.toFixed(1)} / 5
            </span>
          </div>
          <span className="text-sm text-muted">
            Based on {facebookReviewStats.totalReviews}+ reviews on Facebook
          </span>
          <a
            href={facebookPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-primary hover:text-gold"
          >
            View on Facebook
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {facebookReviews.map((review, index) => (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="flex flex-col border border-border bg-surface p-6"
            >
              <div className="mb-3 flex gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-muted">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <footer className="mt-5 border-t border-border pt-4">
                <p className="text-sm font-medium text-heading">{review.name}</p>
                <p className="text-xs text-muted">{review.location}</p>
                {review.product && (
                  <p className="mt-1 text-xs text-gold">{review.product}</p>
                )}
              </footer>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a href={facebookPageUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">Read All Reviews on Facebook</Button>
          </a>
        </div>

        <div className="mt-16 overflow-hidden border border-border bg-surface">
          <iframe
            title="Ceyloe Facebook Page"
            src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(facebookPageUrl)}&tabs=timeline&width=500&height=400&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true`}
            width="100%"
            height="400"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
            allow="encrypted-media"
            className="w-full"
          />
        </div>
      </Container>
    </section>
  );
}
