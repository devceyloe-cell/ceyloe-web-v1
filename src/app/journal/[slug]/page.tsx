import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { blogPosts, getBlogPost } from "@/data/blog-posts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Not Found" };
  return { title: post.title, description: post.excerpt };
}

export default async function JournalPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <div className="section-bg">
      <Container className="py-12 md:py-20">
        <nav className="mb-8 text-sm text-muted">
          <Link href="/journal" className="hover:text-foreground">Education</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{post.title}</span>
        </nav>
        <div className="mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-muted">{post.category} · {post.readTime}</p>
          <h1 className="mt-4 font-display text-4xl font-light sm:text-5xl">{post.title}</h1>
          <div className="relative mt-8 aspect-[16/9] overflow-hidden bg-surface-elevated">
            <Image src={post.image} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
          </div>
          <div className="mt-10 space-y-6">
            {post.content.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-muted">{paragraph}</p>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
