import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import {
  deleteAppointment,
  updateAppointmentStatus,
} from "@/lib/mongodb/appointments";
import type { AppointmentStatus } from "@/types/appointment";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const validStatuses: AppointmentStatus[] = ["new", "confirmed", "completed", "cancelled"];

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB is not configured" }, { status: 503 });
  }

  const { id } = await context.params;
  const { status } = await request.json();

  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const appointment = await updateAppointmentStatus(id, status);
  if (!appointment) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  return NextResponse.json({ appointment });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB is not configured" }, { status: 503 });
  }

  const { id } = await context.params;
  const deleted = await deleteAppointment(id);
  if (!deleted) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
