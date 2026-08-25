import Link from "next/link";
import Image from "next/image";
import { webCovers } from "@/config/web-covers";

export function LandingAppointmentCta() {
  const cover = webCovers.showroom;

  return (
    <section className="relative isolate overflow-hidden bg-[#141414]">
      <div className="absolute inset-0">
        <Image
          src={cover.image}
          alt=""
          fill
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 px-[var(--margin-mobile)] py-14 md:flex-row md:items-center md:px-[var(--margin-desktop)] md:py-16">
        <div className="max-w-xl">
          <p className="font-poppins text-[10px] font-semibold uppercase tracking-[0.28em] text-rich-gold">
            Private Appointments
          </p>
          <h2 className="font-bell mt-2 text-2xl font-bold uppercase !text-[#C09A4A] md:text-3xl">
            View our gemstones in person
          </h2>
          <p className="font-poppins mt-2 text-sm leading-relaxed text-white/85">
            {cover.description}
          </p>
        </div>
        <Link
          href="/book"
          className="font-poppins shrink-0 bg-[#C09A4A] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#d0ab5c]"
        >
          Book Appointment
        </Link>
      </div>
    </section>
  );
}
