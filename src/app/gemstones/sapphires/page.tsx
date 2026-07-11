import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CategoryCardGrid } from "@/components/gemstones/category-card-grid";
import { sapphireLandingCategories } from "@/data/gemstone-categories";

export const metadata: Metadata = {
  title: "Sapphires",
  description:
    "Discover Ceylon sapphires by colour — blue, pink, yellow, padparadscha, teal and more.",
};

export default function SapphiresLandingPage() {
  return (
    <div className="section-bg">
      <Container className="py-12 md:py-20">
        <Link
          href="/gemstones"
          className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All Gemstones
        </Link>

        <SectionHeading
          eyebrow="Sapphires"
          title="Sapphire Collection"
          description="Explore our sapphire varieties by colour. Each collection features natural stones selected for beauty, rarity and quality — ready for collectors or bespoke jewellery."
          align="left"
        />

        <CategoryCardGrid categories={sapphireLandingCategories} />
      </Container>
    </div>
  );
}
