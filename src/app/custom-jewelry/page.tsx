import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { CustomJewelryForm } from "@/components/forms/custom-jewelry-form";

export const metadata: Metadata = {
  title: "Custom Jewelry Inquiry",
  description: "Request a bespoke gemstone jewelry design from Ceyloe.",
};

export default function CustomJewelryPage() {
  return (
    <div className="section-bg">
      <section className="border-b border-border bg-surface-elevated py-12 md:py-16">
        <Container>
          <nav className="mb-6 text-sm text-muted">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Custom Jewelry</span>
          </nav>
          <h1 className="font-display text-4xl font-light sm:text-5xl">Custom Jewelry Inquiry</h1>
          <p className="mt-4 max-w-xl text-muted">
            Select your gemstone, share your vision, and our team will guide you through creating a one-of-a-kind piece.
          </p>
        </Container>
      </section>
      <Container className="py-12 md:py-20">
        <div className="mx-auto max-w-2xl">
          <CustomJewelryForm />
        </div>
      </Container>
    </div>
  );
}
