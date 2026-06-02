import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { blogPosts } from "@/data/blog-posts";

export const metadata: Metadata = {
  title: "Journal — Gemstone Education",
  description: "Educational articles about sapphires, gemstone treatments, and Sri Lankan heritage.",
};

export default function JournalPage() {
  return (
    <div className="section-bg">
      <section className="border-b border-border bg-surface-elevated py-12 md:py-16">
        <Container>
          <h1 className="font-display text-4xl font-light sm:text-5xl">Journal</h1>
          <p className="mt-4 max-w-xl text-muted">
            Educational guides on gemstones, jewelry design, and the heritage of Sri Lankan mining.
          </p>
        </Container>
      </section>
      <Container className="py-12 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/journal/${post.slug}`} className="group">
              <div className="relative aspect-[16/10] overflow-hidden bg-surface-elevated">
                <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-widest text-muted">{post.category} · {post.readTime}</p>
                <h2 className="mt-2 font-display text-xl font-light group-hover:text-foreground/70">{post.title}</h2>
                <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
