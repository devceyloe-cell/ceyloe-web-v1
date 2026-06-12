import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";

interface JournalPost {
  title: string;
  excerpt: string;
  href: string;
  image: string;
  category?: string;
  readTime?: string;
}

interface StitchJournalProps {
  posts: JournalPost[];
}

export function StitchJournal({ posts }: StitchJournalProps) {
  const items = posts.slice(0, 3);

  return (
    <section className="bg-surface py-[var(--section-padding)]">
      <Container>
        <div className="mb-16 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="subheading-caps mb-4 tracking-[0.28em] text-rich-gold">Educational Journal</p>
            <h2 className="font-caslon text-4xl leading-tight md:text-5xl lg:text-[3.25rem]">
              BEYOND <span className="italic text-rich-gold">The Facet</span>
            </h2>
            <div className="mt-6 h-px w-16 bg-rich-gold" />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-on-surface-variant md:text-lg">
              Gemology articles and adventure stories from the world of fine gemstones — from Ceylon sourcing to
              bespoke design inspiration.
            </p>
          </div>

          <Link
            href="/journal"
            className="group hidden shrink-0 items-center gap-3 border border-rich-gold px-8 py-3.5 font-manrope text-xs font-semibold uppercase tracking-[0.2em] text-rich-gold transition-all hover:bg-rich-gold hover:text-white lg:inline-flex"
          >
            Visit The Blog
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8 lg:gap-12">
          {items.map((post, index) => (
            <Link key={post.href} href={post.href} className="group flex flex-col">
              <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-deep-navy shadow-lg">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/80 via-deep-navy/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-75" />
                <span className="absolute left-4 top-4 font-caslon text-5xl leading-none text-white/15">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {(post.category || post.readTime) && (
                  <p className="absolute bottom-4 left-4 right-4 font-manrope text-[10px] font-semibold uppercase tracking-[0.18em] text-pale-gold/90">
                    {[post.category, post.readTime].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>

              <h3 className="font-caslon text-2xl leading-snug transition-colors group-hover:text-rich-gold md:text-[1.65rem]">
                {post.title}
              </h3>
              <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-on-surface-variant md:text-base">
                {post.excerpt}
              </p>
              <span className="link-stitch mt-6 inline-flex items-center gap-2 text-rich-gold">
                Read More
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center lg:hidden">
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 border border-rich-gold px-8 py-3.5 font-manrope text-xs font-semibold uppercase tracking-[0.2em] text-rich-gold transition-all hover:bg-rich-gold hover:text-white"
          >
            Visit The Blog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
