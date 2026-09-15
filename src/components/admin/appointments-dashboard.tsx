"use client";

import { useRouter } from "next/navigation";
import {
  Calendar,
  Check,
  CircleCheck,
  Mail,
  MapPin,
  Phone,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

const statusStyles: Record<AppointmentStatus, string> = {
  new: "bg-gold/15 text-gold",
  confirmed: "bg-emerald-500/15 text-emerald-700",
  completed: "bg-surface-elevated text-muted",
  cancelled: "bg-red-500/10 text-red-500",
};

const timeLabels = {
  morning: "Morning (9am–12pm)",
  afternoon: "Afternoon (12pm–5pm)",
  evening: "Evening (5pm–7pm)",
};

const typeLabels = {
  "in-person": "In-Person (Kalgoorlie)",
  video: "Video Call",
  phone: "Phone Call",
};

function TypeIcon({ type }: { type: Appointment["type"] }) {
  if (type === "in-person") return <MapPin className="h-4 w-4" />;
  if (type === "phone") return <Phone className="h-4 w-4" />;
  return <Video className="h-4 w-4" />;
}

interface AppointmentsDashboardProps {
  appointments: Appointment[];
  mongoConfigured: boolean;
}

export function AppointmentsDashboard({
  appointments: initial,
  mongoConfigured,
}: AppointmentsDashboardProps) {
  const router = useRouter();

  async function updateStatus(id: string, status: AppointmentStatus) {
    await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this appointment request?")) return;
    await fetch(`/api/admin/appointments/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const newCount = initial.filter((a) => a.status === "new").length;

  return (
    <>
      <AdminHeader title="Appointments" />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Bookings</p>
          <h1 className="mt-1 font-display text-3xl font-light tracking-tight">
            Appointments
          </h1>
          <p className="mt-1 text-sm text-muted">
            Requests from the Book an Appointment page
            {newCount > 0 ? (
              <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
                {newCount} new
              </span>
            ) : null}
          </p>
        </div>

        {!mongoConfigured ? (
          <div className="mb-8 border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
            Set <code className="text-foreground">MONGODB_URI</code> to store appointment bookings.
          </div>
        ) : null}

        {initial.length === 0 ? (
          <div className="border border-dashed border-border bg-surface/50 px-6 py-14 text-center">
            <Calendar className="mx-auto h-8 w-8 text-muted" />
            <p className="mt-3 text-sm text-muted">No appointment requests yet.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {initial.map((appointment) => (
              <li
                key={appointment.id}
                className="border border-border bg-surface p-5 transition hover:border-gold/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-medium text-foreground">{appointment.name}</h2>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${statusStyles[appointment.status]}`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <a
                      href={`mailto:${appointment.email}`}
                      className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-muted hover:text-gold"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {appointment.email}
                    </a>

                    <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
                          Preferred date
                        </p>
                        <p className="mt-1 font-medium">{appointment.date}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Time</p>
                        <p className="mt-1 font-medium">{timeLabels[appointment.time]}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Type</p>
                        <p className="mt-1 inline-flex items-center gap-1.5 font-medium">
                          <TypeIcon type={appointment.type} />
                          {typeLabels[appointment.type]}
                        </p>
                      </div>
                    </div>

                    {appointment.notes ? (
                      <p className="mt-4 border-l-2 border-gold/40 pl-3 text-sm leading-relaxed text-muted">
                        {appointment.notes}
                      </p>
                    ) : null}

                    <p className="mt-3 text-xs text-muted">
                      Received {new Date(appointment.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:items-end">
                    {appointment.status === "new" ? (
                      <Button
                        type="button"
                        size="sm"
                        className="inline-flex items-center gap-1.5"
                        onClick={() => updateStatus(appointment.id, "confirmed")}
                      >
                        <Check className="h-3.5 w-3.5" />
                        Confirm
                      </Button>
                    ) : null}
                    {appointment.status === "confirmed" ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="inline-flex items-center gap-1.5"
                        onClick={() => updateStatus(appointment.id, "completed")}
                      >
                        <CircleCheck className="h-3.5 w-3.5" />
                        Complete
                      </Button>
                    ) : null}
                    {appointment.status !== "cancelled" &&
                    appointment.status !== "completed" ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="inline-flex items-center gap-1.5"
                        onClick={() => updateStatus(appointment.id, "cancelled")}
                      >
                        <X className="h-3.5 w-3.5" />
                        Cancel
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300"
                      onClick={() => remove(appointment.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
