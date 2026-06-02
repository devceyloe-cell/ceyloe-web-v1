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
        <h2 className="mb-10 font-display text-2xl font-light tracking-tight text-foreground sm:text-3xl md:text-4xl">
          Journal
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.href + post.title} href={post.href} className="group">
              <h3 className="font-display text-lg font-light text-foreground transition-colors group-hover:text-gold">
                {post.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>
              <span className="mt-4 inline-block text-xs uppercase tracking-widest text-foreground underline-offset-4 group-hover:underline">
                Read more
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
