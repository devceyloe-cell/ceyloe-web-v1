import Link from "next/link";
import { Shield, Leaf, Eye, Package, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Certification } from "@/types";

const iconMap = {
  shield: Shield,
  leaf: Leaf,
  eye: Eye,
  package: Package,
};

interface CertificationsTeaserProps {
  certifications: Certification[];
}

export function CertificationsTeaser({ certifications }: CertificationsTeaserProps) {
  const items = certifications.slice(0, 4);

  return (
    <section className="border-y border-border bg-surface py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Trust & Quality"
          title="Certified Excellence"
          description="Every gemstone meets the highest standards of authenticity, ethics, and quality."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((cert) => {
            const Icon = iconMap[cert.icon as keyof typeof iconMap] ?? Shield;
            return (
              <div
                key={cert.id}
                className="group border border-border bg-background p-6 transition-all duration-300 hover:border-gold/30"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center border border-gold/20 bg-gold/5">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="font-display text-lg font-light text-foreground">
                  {cert.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {cert.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/certifications"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-gold transition-colors hover:text-gold-light"
          >
            Learn About Our Standards
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
