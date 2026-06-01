import type { CmsPage } from "@/lib/cms/types";
import { cn } from "@/lib/utils";
import { CmsImage } from "@/components/cms/cms-image";

export function CmsPageView({ page }: { page: CmsPage }) {
  return (
    <article>
      {page.sections.map((section) => {
        switch (section.type) {
          case "hero":
            return (
              <section key={section.id} className="relative min-h-[50vh] flex items-end">
                {section.image && (
                  <CmsImage
                    src={section.image}
                    alt={section.imageAlt || section.heading || page.title}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-16 pt-32">
                  {section.heading && (
                    <h1 className="font-display text-4xl font-light md:text-5xl">{section.heading}</h1>
                  )}
                  {section.body && (
                    <p className="mt-4 max-w-2xl text-lg text-muted whitespace-pre-line">{section.body}</p>
                  )}
                </div>
              </section>
            );

          case "text":
            return (
              <section key={section.id} className="mx-auto max-w-3xl px-4 py-16">
                {section.heading && (
                  <h2 className="font-display text-2xl font-light text-gold md:text-3xl">{section.heading}</h2>
                )}
                {section.body && (
                  <div className="mt-4 space-y-4 text-muted leading-relaxed whitespace-pre-line">{section.body}</div>
                )}
              </section>
            );

          case "image":
            return section.image ? (
              <section key={section.id} className="px-4 py-8">
                <div className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden">
                  <CmsImage
                    src={section.image}
                    alt={section.imageAlt || page.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </section>
            ) : null;

          case "textImage": {
            const imageLeft = section.imagePosition === "left";
            return (
              <section key={section.id} className="mx-auto max-w-5xl px-4 py-16">
                <div className="grid items-center gap-10 md:grid-cols-2">
                  <div className={cn(imageLeft && "md:order-2")}>
                    {section.heading && (
                      <h2 className="font-display text-2xl font-light text-gold">{section.heading}</h2>
                    )}
                    {section.body && (
                      <p className="mt-4 text-muted leading-relaxed whitespace-pre-line">{section.body}</p>
                    )}
                  </div>
                  {section.image && (
                    <div className={cn("relative aspect-[4/3] overflow-hidden", imageLeft && "md:order-1")}>
                      <CmsImage
                        src={section.image}
                        alt={section.imageAlt || section.heading || page.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </section>
            );
          }

          default:
            return null;
        }
      })}
    </article>
  );
}
