"use client";

import { FormEvent, useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <div className="border-b border-border bg-surface-elevated py-14 md:py-16">
      <Container className="max-w-2xl text-center">
        <h3 className="text-lg font-medium uppercase tracking-[0.12em] text-heading md:text-xl">
          Sign Up To Our Newsletter
        </h3>
        <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-muted">
          Insights into rare gemstones, exclusive arrivals, custom ring inspiration, and members-only offers.
        </p>
        {submitted ? (
          <p className="mt-8 text-sm text-heading">Thank you for subscribing.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="min-w-0 flex-1 border border-border bg-white px-4 py-3 text-sm text-heading outline-none focus:border-heading"
            />
            <Button type="submit" size="md" className="shrink-0">
              Subscribe
            </Button>
          </form>
        )}
      </Container>
    </div>
  );
}
