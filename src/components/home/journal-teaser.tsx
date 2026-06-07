import Link from "next/link";
import { Container } from "@/components/ui/container";

interface JournalPost {
  title: string;
  excerpt: string;
  href: string;
}

interface JournalTeaserProps {
  posts: JournalPost[];
}

export function JournalTeaser({ posts }: JournalTeaserProps) {
  return (
    <section className="border-t border-border bg-surface py-16 md:py-24">
      <Container>
        <div className="mb-10 text-center md:mb-14">
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted">
            Beyond The Facet
          </p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight text-heading sm:text-3xl md:text-4xl">
            Education &amp; Stories
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-light text-muted">
            Gemology articles and adventure stories from the world of fine gemstones.
          </p>
          <Link href="/journal" className="link-arrow mt-6 text-heading">
            Explore the blog →
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.href + post.title} href={post.href} className="group border border-border p-6">
              <h3 className="text-lg font-medium text-heading transition-opacity group-hover:opacity-70">
                {post.title}
              </h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-muted">{post.excerpt}</p>
              <span className="link-arrow mt-5 text-heading">Read more →</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
