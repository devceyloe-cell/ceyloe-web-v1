"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-foreground/30 focus:outline-none";

export function WholesaleForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res = await fetch("/api/inquiries/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) e.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="mb-2 block text-xs uppercase tracking-widest text-muted">Company Name</label>
          <input id="company" name="company" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="contactName" className="mb-2 block text-xs uppercase tracking-widest text-muted">Contact Name</label>
          <input id="contactName" name="contactName" required className={inputClass} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-widest text-muted">Email</label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-xs uppercase tracking-widest text-muted">Phone</label>
          <input id="phone" name="phone" required className={inputClass} />
        </div>
      </div>
      <div>
        <label htmlFor="businessType" className="mb-2 block text-xs uppercase tracking-widest text-muted">Business Type</label>
        <select id="businessType" name="businessType" className={inputClass}>
          <option value="jeweler">Jeweler / Retailer</option>
          <option value="designer">Jewelry Designer</option>
          <option value="wholesaler">Wholesaler</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="country" className="mb-2 block text-xs uppercase tracking-widest text-muted">Country</label>
        <input id="country" name="country" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-widest text-muted">Tell us about your business</label>
        <textarea id="message" name="message" required rows={4} className={inputClass} />
      </div>
      <Button type="submit" disabled={status === "loading"}>
        <Send className="h-4 w-4" />
        {status === "loading" ? "Submitting..." : "Apply for Trade Access"}
      </Button>
      {status === "success" && <p className="text-sm text-success">Application received! We'll review and respond within 2 business days.</p>}
      {status === "error" && <p className="text-sm text-red-500">Submission failed. Please try again.</p>}
    </form>
  );
}
