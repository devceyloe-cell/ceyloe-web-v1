import type { Metadata } from "next";
import { EducationPage } from "@/components/journal/education-page";

export const metadata: Metadata = {
  title: "Gemstone Education — Ceyloe",
  description:
    "Learn about sapphire colours, gemstone treatments, certifications, birthstones, and jewellery care.",
};

export default function JournalPage() {
  return <EducationPage />;
}
