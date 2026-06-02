"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-foreground/30 focus:outline-none";

interface CustomJewelryFormProps {
  defaultStone?: string;
}

export function CustomJewelryForm({ defaultStone = "" }: CustomJewelryFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/inquiries/custom-jewelry", {
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
          <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-widest text-muted">Name</label>
          <input id="name" name="name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-widest text-muted">Email</label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-2 block text-xs uppercase tracking-widest text-muted">Phone</label>
          <input id="phone" name="phone" className={inputClass} />
        </div>
        <div>
          <label htmlFor="budget" className="mb-2 block text-xs uppercase tracking-widest text-muted">Budget (USD)</label>
          <input id="budget" name="budget" type="number" className={inputClass} placeholder="e.g. 5000" />
        </div>
      </div>
      <div>
        <label htmlFor="jewelryType" className="mb-2 block text-xs uppercase tracking-widest text-muted">Jewelry Type</label>
        <select id="jewelryType" name="jewelryType" className={inputClass}>
          <option value="ring">Ring</option>
          <option value="pendant">Pendant</option>
          <option value="earrings">Earrings</option>
          <option value="bracelet">Bracelet</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="preferredStone" className="mb-2 block text-xs uppercase tracking-widest text-muted">Preferred Gemstone</label>
        <input id="preferredStone" name="preferredStone" defaultValue={defaultStone} className={inputClass} placeholder="Sapphire, spinel, garnet..." />
      </div>
      <div>
        <label htmlFor="details" className="mb-2 block text-xs uppercase tracking-widest text-muted">Design Details</label>
        <textarea id="details" name="details" required rows={5} className={inputClass} placeholder="Describe your vision — metal preference, setting style, occasion..." />
      </div>
      <Button type="submit" disabled={status === "loading"}>
        <Send className="h-4 w-4" />
        {status === "loading" ? "Submitting..." : "Submit Inquiry"}
      </Button>
      {status === "success" && <p className="text-sm text-success">Thank you! Our team will contact you within 24 hours.</p>}
      {status === "error" && <p className="text-sm text-red-500">Something went wrong. Please try again or contact us via WhatsApp.</p>}
    </form>
  );
}
