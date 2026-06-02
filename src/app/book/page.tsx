import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { AppointmentForm } from "@/components/forms/appointment-form";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Schedule a consultation with Ceyloe for gemstone selection or custom jewelry design.",
};

export default function BookPage() {
  return (
    <div className="section-bg">
      <section className="border-b border-border bg-surface-elevated py-12 md:py-16">
        <Container>
          <h1 className="font-display text-4xl font-light sm:text-5xl">Book an Appointment</h1>
          <p className="mt-4 max-w-xl text-muted">
            Schedule an in-person consultation in Kalgoorlie, or a video/phone call at your convenience.
          </p>
        </Container>
      </section>
      <Container className="py-12 md:py-20">
        <div className="mx-auto max-w-xl">
          <AppointmentForm />
        </div>
      </Container>
    </div>
  );
}
