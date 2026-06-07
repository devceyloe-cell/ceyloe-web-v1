import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

interface EditorialLink {
  label: string;
  href: string;
}

interface EditorialBlockProps {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image: string;
  imagePosition?: "left" | "right";
  links?: EditorialLink[];
}

export function EditorialBlock({
  eyebrow,
  title,
  paragraphs,
  image,
  imagePosition = "right",
  links = [],
}: EditorialBlockProps) {
  const imageLeft = imagePosition === "left";

  return (
    <section className="border-b border-border py-16 md:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className={cn("relative aspect-[4/3] overflow-hidden bg-surface-elevated", imageLeft && "lg:order-1")}>
            <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>

          <div className={cn(imageLeft && "lg:order-2")}>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted">{eyebrow}</p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight text-heading sm:text-3xl md:text-4xl">
              {title}
            </h2>
            <div className="mt-6 space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-sm font-light leading-relaxed text-muted sm:text-base">
                  {p}
                </p>
              ))}
            </div>
            {links.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-6">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className="link-arrow text-heading">
                    {link.label} →
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
