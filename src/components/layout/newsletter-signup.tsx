"use client";

import { FormEvent, useState } from "react";
import { Container } from "@/components/ui/container";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <section className="newsletter-section bg-deep-navy py-24 text-white">
      <Container className="max-w-4xl text-center">
        <h2 className="font-caslon text-4xl font-normal leading-tight text-white md:text-5xl">
          Sign Up To Our <span className="italic text-pale-gold">Newsletter</span>
        </h2>

        <p className="font-manrope mx-auto mt-6 max-w-2xl text-base leading-7 text-surface-dim md:text-lg md:leading-8">
          Sign up to our newsletter for fascinating insights into rare and precious gemstones,
          exclusive access to our latest offerings, custom ring inspiration, and special
          members-only offers.
        </p>

        {submitted ? (
          <p className="font-manrope mt-10 text-sm font-semibold uppercase tracking-[0.12em] text-pale-gold">
            Thank you for subscribing.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 flex max-w-xl flex-col items-center justify-center gap-4 md:max-w-none md:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="font-manrope w-full border-b border-pale-gold/30 bg-white/10 px-0 py-4 text-white placeholder:text-surface-dim/60 focus:border-pale-gold focus:outline-none md:w-96"
            />
            <button
              type="submit"
              className="btn-stitch-gold w-full px-10 py-4 md:w-auto"
            >
              Subscribe
            </button>
          </form>
        )}
      </Container>
    </section>
  );
}
