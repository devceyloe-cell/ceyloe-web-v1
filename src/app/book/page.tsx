import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { BookLandingHero } from "@/components/book/book-landing-hero";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Schedule a consultation with Ceyloe for gemstone selection or custom jewelry design.",
};

export default function BookPage() {
  return (
    <div className="bg-white">
      <BookLandingHero />
      <Container id="appointment-form" className="scroll-mt-28 py-12 md:py-20">
        <div className="mx-auto max-w-xl">
          <AppointmentForm />
        </div>
      </Container>
    </div>
  );
}
