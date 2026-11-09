import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { BookLandingHero } from "@/components/book/book-landing-hero";
import { getHeroImages } from "@/lib/mongodb/hero-images";

export const metadata: Metadata = {
  title: "Book a Gemstone Appointment | Perth & WA",
  description:
    "Book a private Ceyloe consultation to view gemstones or plan bespoke jewellery — serving Perth and Western Australia clients by appointment.",
  alternates: { canonical: "/book" },
};

export default async function BookPage() {
  const heroImages = await getHeroImages();
  return (
    <div className="bg-white">
      <BookLandingHero contentOverride={heroImages.book} />
      <Container id="appointment-form" className="scroll-mt-28 py-12 md:py-20">
        <div className="mx-auto max-w-xl">
          <AppointmentForm />
        </div>
      </Container>
    </div>
  );
}
