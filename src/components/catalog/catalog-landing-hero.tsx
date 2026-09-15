import { Logo } from "@/components/layout/logo";
import { WhiteCoverHeroLayout } from "@/components/layout/white-cover-hero-layout";
import type { WebCoverContent } from "@/config/web-covers";

const NAVY = "#004B69";
const GOLD = "#C09A4A";

type CatalogLandingHeroProps = {
  cover: WebCoverContent;
  /** Product count line under the title */
  description?: string;
};

/**
 * Catalog collection hero — white cover layout matching marketing pages.
 */
export function CatalogLandingHero({ cover, description }: CatalogLandingHeroProps) {
  const titleId = "catalog-hero-title";
  const lines = cover.titleLines?.length
    ? cover.titleLines
    : cover.title
      ? [cover.title]
      : ["Collection"];
  const body = description ?? cover.description;

  return (
    <WhiteCoverHeroLayout image={cover.image} ariaLabelledBy={titleId}>
      <Logo size="hero" className="!w-[clamp(160px,12vw,200px)]" />

      {cover.eyebrow ? (
        <p
          className="font-poppins mt-5 text-[clamp(12px,0.8vw,14px)] font-normal uppercase leading-none tracking-[0.18em] lg:mt-6 xl:mt-5"
          style={{ color: NAVY }}
        >
          {cover.eyebrow}
        </p>
      ) : null}

      <h1
        id={titleId}
        className="font-bell mt-2 text-[clamp(30px,3.2vw,48px)] font-bold uppercase leading-[1.02] tracking-[0.01em] text-left lg:mt-2.5"
        style={{ color: GOLD }}
      >
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>

      {body ? (
        <p
          className="font-poppins mt-3 max-w-[460px] text-[clamp(13px,0.9vw,15px)] font-normal leading-[1.5] text-left lg:mt-3.5"
          style={{ color: NAVY }}
        >
          {body}
        </p>
      ) : null}
    </WhiteCoverHeroLayout>
  );
}
