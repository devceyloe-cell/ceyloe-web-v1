import type { Metadata } from "next";
import { EducationPage } from "@/components/journal/education-page";
import { getHeroImages } from "@/lib/mongodb/hero-images";

export const metadata: Metadata = {
  title: "Gemstone Education — Ceyloe",
  description:
    "Learn about sapphire colours, gemstone treatments, certifications, birthstones, and jewellery care.",
};

export default async function JournalPage() {
  const heroImages = await getHeroImages();
  return <EducationPage contentOverride={heroImages.journal} />;
}
