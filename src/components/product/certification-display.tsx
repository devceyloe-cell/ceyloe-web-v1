import { Shield, Download, FileCheck } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/types";

interface CertificationDisplayProps {
  product: Product;
}

export function CertificationDisplay({ product }: CertificationDisplayProps) {
  const { specs, certificationUrl } = product;

  if (!specs.certification) return null;

  return (
    <div className="mt-10 border border-border bg-surface-elevated p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary text-white">
          <Shield className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg font-light">{specs.certification} Certified</h3>
          <p className="mt-1 text-sm text-muted">
            This gemstone has been independently graded and certified for authenticity, quality, and treatment
            disclosure.
          </p>
          {specs.certificateNumber && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
              <FileCheck className="h-3.5 w-3.5" />
              Certificate No. {specs.certificateNumber}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            {certificationUrl && (
              <Link
                href={certificationUrl}
                target="_blank"
                className="inline-flex items-center gap-2 border border-primary px-4 py-2 text-xs uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-white"
              >
                <Download className="h-3.5 w-3.5" />
                Download Certificate
              </Link>
            )}
            <Link
              href="/certifications"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest text-muted underline-offset-4 hover:underline"
            >
              Learn about our certifications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
