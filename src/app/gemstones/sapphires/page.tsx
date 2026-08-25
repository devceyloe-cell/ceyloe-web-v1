import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CategoryCardGrid } from "@/components/gemstones/category-card-grid";
import { WebCoverHero } from "@/components/layout/web-cover-hero";
import { sapphireLandingCategories } from "@/data/gemstone-categories";
import { webCovers } from "@/config/web-covers";

export const metadata: Metadata = {
  title: "Sapphires",
  description:
    "Discover Ceylon sapphires by colour — blue, pink, yellow, padparadscha, teal and more.",
};

export default function SapphiresLandingPage() {
  return (
    <div className="section-bg">
      <WebCoverHero id="sapphires-hero" {...webCovers.sapphires} />
      <Container className="py-12 md:py-20">
        <Link
          href="/gemstones"
          className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All Gemstones
        </Link>
        <CategoryCardGrid categories={sapphireLandingCategories} />
      </Container>
    </div>
  );
}
