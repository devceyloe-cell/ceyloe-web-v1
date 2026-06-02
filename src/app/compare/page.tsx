import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { CompareTable } from "@/components/compare/compare-table";
import { getProductByHandle } from "@/services/product-service";

interface ComparePageProps {
  searchParams: Promise<{ handles?: string }>;
}

export const metadata: Metadata = {
  title: "Compare Gemstones",
  description: "Side-by-side comparison of selected Ceyloe gemstones.",
};

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { handles: handlesParam } = await searchParams;
  const handles = handlesParam?.split(",").filter(Boolean) ?? [];
  const products = await Promise.all(handles.map((h) => getProductByHandle(h)));
  const valid = products.filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (valid.length === 0) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-3xl font-light">Compare Gemstones</h1>
        <p className="mt-4 text-muted">Select gemstones from the catalog to compare.</p>
        <Link href="/catalog" className="mt-6 inline-block text-xs uppercase tracking-widest underline">
          Browse catalog
        </Link>
      </Container>
    );
  }

  return (
    <div className="section-bg">
      <Container className="py-12 md:py-20">
        <h1 className="font-display text-3xl font-light sm:text-4xl">Compare Gemstones</h1>
        <CompareTable products={valid} />
      </Container>
    </div>
  );
}
