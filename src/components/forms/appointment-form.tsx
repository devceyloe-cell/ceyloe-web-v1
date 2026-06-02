"use client";

import { useState } from "react";
import { Calendar, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full border border-border bg-surface px-4 py-3 text-sm text-foreground focus:border-foreground/30 focus:outline-none";

export function AppointmentForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res = await fetch("/api/inquiries/appointment", {
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
          <label htmlFor="date" className="mb-2 block text-xs uppercase tracking-widest text-muted">Preferred Date</label>
          <input id="date" name="date" type="date" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="time" className="mb-2 block text-xs uppercase tracking-widest text-muted">Preferred Time</label>
          <select id="time" name="time" className={inputClass}>
            <option value="morning">Morning (9am–12pm)</option>
            <option value="afternoon">Afternoon (12pm–5pm)</option>
            <option value="evening">Evening (5pm–7pm)</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="type" className="mb-2 block text-xs uppercase tracking-widest text-muted">Consultation Type</label>
        <select id="type" name="type" className={inputClass}>
          <option value="in-person">In-Person (Kalgoorlie)</option>
          <option value="video">Video Call</option>
          <option value="phone">Phone Call</option>
        </select>
      </div>
      <div>
        <label htmlFor="notes" className="mb-2 block text-xs uppercase tracking-widest text-muted">Notes</label>
        <textarea id="notes" name="notes" rows={3} className={inputClass} placeholder="What would you like to discuss?" />
      </div>
      <Button type="submit" disabled={status === "loading"}>
        <Calendar className="h-4 w-4" />
        {status === "loading" ? "Booking..." : "Book Appointment"}
      </Button>
      {status === "success" && <p className="text-sm text-success">Appointment request received! We'll confirm via email.</p>}
      {status === "error" && <p className="text-sm text-red-500">Booking failed. Please try WhatsApp instead.</p>}
    </form>
  );
}
