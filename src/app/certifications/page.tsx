import type { Metadata } from "next";
import { CertificationCards } from "@/components/certifications/certification-cards";
import { getSiteContent } from "@/services/content-service";

export const metadata: Metadata = {
  title: "Certifications",
  description:
    "Learn about Ceyloe's certification standards, ethical sourcing, and quality verification process.",
};

export default async function CertificationsPage() {
  const content = await getSiteContent();

  return <CertificationCards certifications={content.certifications} />;
}
