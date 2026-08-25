import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { WebCoverHero } from "@/components/layout/web-cover-hero";
import { webCovers } from "@/config/web-covers";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Schedule a consultation with Ceyloe for gemstone selection or custom jewelry design.",
};

export default function BookPage() {
  return (
    <div className="section-bg">
      <WebCoverHero id="book-hero" {...webCovers.bookAppointment} />
      <Container className="py-12 md:py-20">
        <div className="mx-auto max-w-xl">
          <AppointmentForm />
        </div>
      </Container>
    </div>
  );
}
