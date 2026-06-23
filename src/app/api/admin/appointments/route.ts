import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import { getAllAppointments } from "@/lib/mongodb/appointments";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "MongoDB is not configured" },
      { status: 503 },
    );
  }

  const appointments = await getAllAppointments();
  return NextResponse.json({ appointments });
}
