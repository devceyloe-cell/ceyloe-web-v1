import Link from "next/link";
import { Calendar } from "lucide-react";
import { Container } from "@/components/ui/container";

export function LandingAppointmentCta() {
  return (
    <section className="border-y border-border bg-[#f8f8f8] py-12 md:py-14">
      <Container>
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-12">
          <div className="flex items-start gap-5 md:max-w-2xl">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-rich-gold/30 text-rich-gold">
              <Calendar className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-caslon text-2xl text-heading md:text-3xl">
                Looking for something truly exceptional?
              </h2>
              <p className="font-manrope mt-2 text-sm leading-relaxed text-muted">
                Book a private appointment — in person or by video — and let our experts guide you
                to the perfect gemstone or bespoke design.
              </p>
            </div>
          </div>

          <Link href="/book" className="btn-stitch-gold shrink-0 px-10 py-4">
            Book an Appointment
          </Link>
        </div>
      </Container>
    </section>
  );
}
