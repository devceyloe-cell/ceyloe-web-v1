import { getAllPages } from "@/lib/cms/local-store";
import { getAdminSession } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import { getAllProductsFromDb } from "@/lib/mongodb/products";
import { getAllAppointments } from "@/lib/mongodb/appointments";
import { getAllUsers } from "@/lib/mongodb/users";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminHomePage() {
  const mongo = isMongoConfigured();
  const [pages, session, products, appointments, users] = await Promise.all([
    getAllPages(true),
    getAdminSession(),
    mongo ? getAllProductsFromDb() : Promise.resolve([]),
    mongo ? getAllAppointments() : Promise.resolve([]),
    mongo ? getAllUsers() : Promise.resolve([]),
  ]);

  const newAppointments = appointments.filter((a) => a.status === "new").length;

  return (
    <AdminDashboard
      pages={pages}
      session={session}
      stats={{
        products: products.length,
        appointments: appointments.length,
        newAppointments,
        users: users.length,
        pages: pages.length,
      }}
    />
  );
}
