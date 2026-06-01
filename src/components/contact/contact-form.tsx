"use client";

import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

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

  const inputClass =
    "w-full border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-sapphire focus:outline-none";

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-widest text-muted">
              Name
            </label>
            <input id="name" name="name" required className={inputClass} placeholder="Your name" />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-widest text-muted">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="mb-2 block text-xs uppercase tracking-widest text-muted">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            className={inputClass}
            placeholder="Gemstone inquiry, custom order..."
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-widest text-muted">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className={inputClass}
            placeholder="Tell us about the gemstone you're looking for..."
          />
        </div>

        <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
          <Send className="h-4 w-4" />
          {status === "loading" ? "Sending..." : "Send Message"}
        </Button>

        {status === "success" && (
          <p className="text-sm text-success">Thank you! We&apos;ll be in touch shortly.</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-400">Something went wrong. Please try again.</p>
        )}
      </form>

      <div className="border-t border-border pt-8">
        <p className="mb-4 text-sm text-muted">Prefer a direct conversation?</p>
        <a
          href={`https://wa.me/${siteConfig.contact.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline">
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </Button>
        </a>
      </div>
    </div>
  );
}
