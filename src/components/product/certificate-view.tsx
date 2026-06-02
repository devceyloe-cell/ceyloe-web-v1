"use client";

import { useEffect } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

interface CertificatePageProps {
  product: Product;
}

export function CertificateView({ product }: CertificatePageProps) {
  useEffect(() => {
    document.title = `Certificate — ${product.title}`;
  }, [product.title]);

  const certNumber = product.specs.certificateNumber ?? `CEY-${product.id.padStart(6, "0")}`;
  const date = new Date().toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-surface-elevated py-12 print:bg-white print:py-0">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-6 flex gap-3 print:hidden">
          <Button onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Print / Save as PDF
          </Button>
        </div>

        <div className="border-2 border-foreground bg-white p-10 md:p-16">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Ceyloe Gemstones</p>
            <h1 className="mt-4 font-display text-3xl font-light">Gemstone Certificate</h1>
            <div className="mx-auto mt-6 h-px w-24 bg-brand-navy" />
          </div>

          <div className="mt-10 space-y-4 text-sm">
            <Row label="Certificate Number" value={certNumber} />
            <Row label="Date Issued" value={date} />
            <Row label="Gemstone" value={product.title} />
            <Row label="Laboratory" value={product.specs.certification ?? "Independent Assessment"} />
            {product.specs.carat && <Row label="Carat Weight" value={product.specs.carat} />}
            {product.specs.color && <Row label="Colour" value={product.specs.color} />}
            {product.specs.clarity && <Row label="Clarity" value={product.specs.clarity} />}
            {product.specs.cut && <Row label="Cut" value={product.specs.cut} />}
            {product.specs.origin && <Row label="Origin" value={product.specs.origin} />}
            {product.specs.treatment && <Row label="Treatment" value={product.specs.treatment} />}
          </div>

          <p className="mt-10 text-center text-xs leading-relaxed text-muted">
            This certificate confirms the gemstone details as listed by Ceyloe. For official laboratory
            reports (GIA, etc.), please contact us. Ceyloe — ethically sourced gemstones from Sri Lanka.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border py-2">
      <span className="text-muted">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
