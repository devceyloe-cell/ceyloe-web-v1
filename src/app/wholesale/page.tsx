import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { WholesaleForm } from "@/components/forms/wholesale-form";

export const metadata: Metadata = {
  title: "Trade & Wholesale Registration",
  description: "Apply for trade access and wholesale pricing on Ceyloe gemstones.",
};

export default function WholesalePage() {
  return (
    <div className="section-bg">
      <section className="border-b border-border bg-surface-elevated py-12 md:py-16">
        <Container>
          <h1 className="font-display text-4xl font-light sm:text-5xl">Trade & Wholesale</h1>
          <p className="mt-4 max-w-xl text-muted">
            We welcome jewelry artists and retailers from around the world. Apply for trade access to receive wholesale pricing and priority support.
          </p>
        </Container>
      </section>
      <Container className="py-12 md:py-20">
        <div className="mx-auto max-w-2xl">
          <WholesaleForm />
        </div>
      </Container>
    </div>
  );
}
