import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Instagram",
  description: "Follow Ceyloe on Instagram for exquisite gemstones, new arrivals, and behind-the-scenes from Sri Lanka.",
};

export default function InstagramPage() {
  const instagramUrl = siteConfig.social.instagram;

  return (
    <>
      <section className="border-b border-border bg-surface py-12 md:py-16">
        <Container>
          <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-gold">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Instagram</span>
          </nav>
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center border border-gold/30 bg-gold/5">
              <InstagramIcon className="h-7 w-7 text-gold" />
            </span>
            <div>
              <h1 className="font-display text-4xl font-light tracking-tight text-foreground sm:text-5xl">
                @ceyloegemstones
              </h1>
              <p className="mt-2 text-muted">Follow us for gems, stories, and new arrivals</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="max-w-2xl text-center">
          <p className="text-lg leading-relaxed text-muted">
            See our latest Ceylon sapphires, spinels, and fine jewellery on Instagram. Get
            inspiration for your next piece and connect with our team directly.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg">
                <InstagramIcon className="h-5 w-5" />
                Follow on Instagram
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
            <Link href="/catalog">
              <Button variant="outline" size="lg">
                Browse Catalog
              </Button>
            </Link>
          </div>

          <p className="mt-12 text-sm text-muted">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              {instagramUrl}
            </a>
          </p>
        </Container>
      </section>
    </>
  );
}
