import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb/client";
import type {
  Appointment,
  AppointmentStatus,
  AppointmentTime,
  AppointmentType,
  CreateAppointmentInput,
} from "@/types/appointment";

const COLLECTION = "appointments";

type StoredAppointment = Omit<Appointment, "id">;

function toAppointment(doc: StoredAppointment & { _id: ObjectId }): Appointment {
  const { _id, ...rest } = doc;
  return { ...rest, id: _id.toString() };
}

function normalizeTime(value?: string): AppointmentTime {
  if (value === "morning" || value === "afternoon" || value === "evening") return value;
  return "morning";
}

function normalizeType(value?: string): AppointmentType {
  if (value === "in-person" || value === "video" || value === "phone") return value;
  return "video";
}

export async function createAppointment(input: CreateAppointmentInput): Promise<Appointment> {
  const db = await getDb();
  if (!db) throw new Error("MongoDB is not configured");

  const now = new Date().toISOString();
  const doc: StoredAppointment = {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    date: input.date,
    time: normalizeTime(input.time),
    type: normalizeType(input.type),
    notes: input.notes?.trim() || undefined,
    status: "new",
    createdAt: now,
  };

  const result = await db.collection<StoredAppointment>(COLLECTION).insertOne(doc);
  const inserted = await db.collection<StoredAppointment>(COLLECTION).findOne({ _id: result.insertedId });
  if (!inserted) throw new Error("Appointment not found after insert");
  return toAppointment(inserted as StoredAppointment & { _id: ObjectId });
}

export async function getAllAppointments(): Promise<Appointment[]> {
  const db = await getDb();
  if (!db) return [];

  const docs = await db
    .collection<StoredAppointment>(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map((doc) => toAppointment(doc as StoredAppointment & { _id: ObjectId }));
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<Appointment | null> {
  const db = await getDb();
  if (!db || !ObjectId.isValid(id)) return null;

  const collection = db.collection<StoredAppointment>(COLLECTION);
  await collection.updateOne({ _id: new ObjectId(id) }, { $set: { status } });
  const updated = await collection.findOne({ _id: new ObjectId(id) });
  return updated ? toAppointment(updated as StoredAppointment & { _id: ObjectId }) : null;
}

export async function deleteAppointment(id: string): Promise<boolean> {
  const db = await getDb();
  if (!db || !ObjectId.isValid(id)) return false;

  const result = await db.collection<StoredAppointment>(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
