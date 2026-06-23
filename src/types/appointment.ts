export type AppointmentStatus = "new" | "confirmed" | "completed" | "cancelled";

export type AppointmentType = "in-person" | "video" | "phone";

export type AppointmentTime = "morning" | "afternoon" | "evening";

export interface Appointment {
  id: string;
  name: string;
  email: string;
  date: string;
  time: AppointmentTime;
  type: AppointmentType;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface CreateAppointmentInput {
  name: string;
  email: string;
  date: string;
  time?: string;
  type?: string;
  notes?: string;
}
