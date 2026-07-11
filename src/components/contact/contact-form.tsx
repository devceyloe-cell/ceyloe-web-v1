"use client";

import { useState } from "react";
import { ChevronDown, Send } from "lucide-react";
import { FadeIn } from "@/components/about/fade-in";
import { SectionTitle } from "@/components/about/section-title";
import { contactEnquiry, contactSubjects } from "@/data/contact-content";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        e.currentTarget.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const fieldClass =
    "font-manrope w-full border border-[#E0D9CE] bg-white px-4 py-3.5 text-[14px] text-[#222222] placeholder:text-[#999999] outline-none transition-colors focus:border-[#C89B3C]";
  const labelClass =
    "font-manrope mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#666666]";

  return (
    <section
      className="bg-white px-[var(--margin-mobile)] py-12 md:px-[var(--margin-desktop)] md:py-14 lg:py-16"
      aria-labelledby="enquiry-heading"
    >
      <div className="mx-auto max-w-[720px]">
        <FadeIn>
          <SectionTitle
            as="h2"
            id="enquiry-heading"
            title={contactEnquiry.title}
            align="center"
            tone="dark"
          />
        </FadeIn>

        <FadeIn delay={0.1} className="mt-8 md:mt-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  className={fieldClass}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={fieldClass}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>
                Phone Number <span className="normal-case tracking-normal text-[#999999]">(Optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className={fieldClass}
                placeholder="+61 ..."
              />
            </div>

            <div>
              <label htmlFor="subject" className={labelClass}>
                Subject
              </label>
              <div className="relative">
                <select
                  id="subject"
                  name="subject"
                  required
                  defaultValue=""
                  className={cn(fieldClass, "appearance-none pr-10")}
                >
                  <option value="" disabled>
                    Select a subject
                  </option>
                  {contactSubjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-[#666666]"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className={labelClass}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={7}
                className={cn(fieldClass, "resize-y min-h-[160px]")}
                placeholder="Tell us how we can help..."
              />
            </div>

            <div className="flex flex-col items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={status === "loading"}
                className="font-manrope inline-flex h-12 min-w-[200px] items-center justify-center gap-2 bg-[#C89B3C] px-8 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-all duration-200 hover:scale-[1.03] hover:bg-[#B8872F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B3C] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
              >
                <Send className="h-4 w-4" aria-hidden />
                {status === "loading" ? "Sending..." : "Send Enquiry"}
              </button>

              {status === "success" && (
                <p className="font-manrope text-[14px] text-[#2f6b4f]">
                  Thank you! We&apos;ll be in touch shortly.
                </p>
              )}
              {status === "error" && (
                <p className="font-manrope text-[14px] text-[#b42318]">
                  Something went wrong. Please try again.
                </p>
              )}
            </div>
          </form>
        </FadeIn>
      </div>
    </section>
  );
}
