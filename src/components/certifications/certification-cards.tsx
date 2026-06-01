import { Shield, Leaf, Eye, Package } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Certification } from "@/types";

const iconMap = {
  shield: Shield,
  leaf: Leaf,
  eye: Eye,
  package: Package,
};

interface CertificationCardsProps {
  certifications: Certification[];
}

export function CertificationCards({ certifications }: CertificationCardsProps) {
  return (
    <Container className="py-20 md:py-28">
      <SectionHeading
        eyebrow="Our Promise"
        title="Certification & Standards"
        description="We believe transparency is the foundation of trust in luxury gemstones."
      />

      <div className="grid gap-8 md:grid-cols-2">
        {certifications.map((cert) => {
          const Icon = iconMap[cert.icon as keyof typeof iconMap] ?? Shield;
          return (
            <div
              key={cert.id}
              className="flex gap-6 border border-border bg-surface p-8 transition-colors hover:border-gold/30"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-gold/20 bg-gold/5">
                <Icon className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h3 className="font-display text-xl font-light text-foreground">
                  {cert.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {cert.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 border border-border bg-surface-elevated p-8 md:p-12">
        <h3 className="font-display text-2xl font-light text-foreground">
          Verification Process
        </h3>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Expert Selection",
              desc: "Each stone is hand-selected by our gemologists at source in Sri Lanka.",
            },
            {
              step: "02",
              title: "Independent Certification",
              desc: "Premium stones are sent to GIA or equivalent labs for full grading reports.",
            },
            {
              step: "03",
              title: "Secure Delivery",
              desc: "Certified stones are shipped in tamper-evident, fully insured packaging.",
            },
          ].map((item) => (
            <div key={item.step}>
              <span className="text-3xl font-light text-gold/30">{item.step}</span>
              <h4 className="mt-2 font-medium text-foreground">{item.title}</h4>
              <p className="mt-2 text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
