import { NextRequest, NextResponse } from "next/server";
import { isMongoConfigured } from "@/config/env";
import { createAppointment } from "@/lib/mongodb/appointments";
import { AppointmentSchema } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = AppointmentSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "Invalid input" },
        { status: 400 },
      );
    }

    const { name, email, date, time, type, notes } = parsed.data;

    if (!isMongoConfigured()) {
      console.log("[Appointment Booking]", { name, email, date, time, type, notes });
      return NextResponse.json({ success: true });
    }

    const appointment = await createAppointment({
      name,
      email,
      date,
      time,
      type,
      notes,
    });

    return NextResponse.json({ success: true, id: appointment.id });
  } catch (error) {
    console.error("[Appointment Booking Error]", error);
    return NextResponse.json({ error: "Unable to process your request" }, { status: 500 });
  }
}
