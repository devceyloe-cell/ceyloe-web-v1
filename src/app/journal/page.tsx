import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { blogPosts } from "@/data/blog-posts";

export const metadata: Metadata = {
  title: "Journal — Beyond The Facet",
  description: "Educational articles about sapphires, gemstone treatments, and Sri Lankan heritage.",
};

export default function JournalPage() {
  return (
    <div className="section-bg">
      <section className="border-b border-pale-gold/20 bg-surface py-16 md:py-24">
        <Container>
          <p className="subheading-caps mb-4 tracking-[0.28em] text-rich-gold">Educational Journal</p>
          <h1 className="font-caslon text-4xl md:text-5xl lg:text-[3.25rem]">
            BEYOND <span className="italic text-rich-gold">The Facet</span>
          </h1>
          <div className="mt-6 h-px w-16 bg-rich-gold" />
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-on-surface-variant md:text-lg">
            Gemology guides, collector insights, and stories from the world of fine Ceylon gemstones.
          </p>
        </Container>
      </section>

      <Container className="py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {blogPosts.map((post, index) => (
            <Link key={post.slug} href={`/journal/${post.slug}`} className="group flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden bg-deep-navy shadow-md">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/70 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 font-caslon text-4xl text-white/15">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-5 flex flex-1 flex-col">
                <p className="font-manrope text-[10px] font-semibold uppercase tracking-[0.18em] text-rich-gold">
                  {post.category} · {post.readTime}
                </p>
                <h2 className="mt-3 font-caslon text-2xl leading-snug transition-colors group-hover:text-rich-gold">
                  {post.title}
                </h2>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-on-surface-variant">
                  {post.excerpt}
                </p>
                <span className="link-stitch mt-5 inline-flex items-center gap-2 text-rich-gold">
                  Read More
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
