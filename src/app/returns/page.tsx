import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  returnsPolicyContact,
  returnsPolicyIntro,
  returnsPolicyMeta,
  returnsPolicySections,
} from "@/data/returns-policy-content";

export const metadata: Metadata = {
  title: returnsPolicyMeta.title,
  description:
    "Ceyloe Gemstones returns and refunds policy — change of mind, custom jewellery, natural gemstones, and your rights under Australian Consumer Law.",
};

export default function ReturnsPolicyPage() {
  const { businessName, address, title: contactTitle } = returnsPolicyContact;

  return (
    <>
      <section className="border-b border-border bg-surface py-12 md:py-16">
        <Container>
          <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-gold">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{returnsPolicyMeta.title}</span>
          </nav>
          <h1 className="font-display text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            {returnsPolicyMeta.title}
          </h1>
          <p className="mt-4 text-sm text-muted">Last updated: {returnsPolicyMeta.lastUpdated}</p>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="max-w-4xl">
          <div className="space-y-4 text-base leading-relaxed text-muted">
            {returnsPolicyIntro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 space-y-12">
            {returnsPolicySections.map((section) => (
              <article key={section.id} className="border-b border-border pb-12 last:border-b-0">
                <h2 className="font-display text-2xl font-light text-foreground">{section.title}</h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-muted">
                  {section.intro?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.listItems && (
                    <ul className="list-disc space-y-2 pl-6">
                      {section.listItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.outro?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}

            <article>
              <h2 className="font-display text-2xl font-light text-foreground">{contactTitle}</h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-muted">
                <address className="not-italic">
                  <p className="font-medium text-foreground">{businessName}</p>
                  {address.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </address>
              </div>
            </article>
          </div>

          <p className="mt-12 text-center text-sm text-muted">
            Need help with an order?{" "}
            <Link href="/contact" className="text-gold hover:underline">
              Contact us
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
