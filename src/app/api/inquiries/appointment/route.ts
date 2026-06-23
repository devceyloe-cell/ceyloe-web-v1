import { NextRequest, NextResponse } from "next/server";
import { isMongoConfigured } from "@/config/env";
import { createAppointment } from "@/lib/mongodb/appointments";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!isMongoConfigured()) {
      console.log("[Appointment Booking]", body);
      return NextResponse.json({ success: true });
    }

    const appointment = await createAppointment({
      name: body.name,
      email: body.email,
      date: body.date,
      time: body.time,
      type: body.type,
      notes: body.notes,
    });

    return NextResponse.json({ success: true, id: appointment.id });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
