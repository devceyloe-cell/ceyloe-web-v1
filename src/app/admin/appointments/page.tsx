import { AppointmentsDashboard } from "@/components/admin/appointments-dashboard";
import { isMongoConfigured } from "@/config/env";
import { getAllAppointments } from "@/lib/mongodb/appointments";

export default async function AdminAppointmentsPage() {
  const appointments = isMongoConfigured() ? await getAllAppointments() : [];

  return (
    <AppointmentsDashboard appointments={appointments} mongoConfigured={isMongoConfigured()} />
  );
}
