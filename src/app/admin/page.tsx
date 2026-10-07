import { getAllPages } from "@/lib/cms/local-store";
import { getAdminSession } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import { getAllProductsFromDb } from "@/lib/mongodb/products";
import { getAllAppointments } from "@/lib/mongodb/appointments";
import { getAllUsers } from "@/lib/mongodb/users";
import { getHomepageCollection } from "@/lib/mongodb/homepage-collection";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminHomePage() {
  const mongo = isMongoConfigured();
  const [pages, session, products, appointments, users, collection] = await Promise.all([
    getAllPages(true).catch(() => []),
    getAdminSession().catch(() => null),
    mongo ? getAllProductsFromDb().catch(() => []) : Promise.resolve([]),
    mongo ? getAllAppointments().catch(() => []) : Promise.resolve([]),
    mongo ? getAllUsers().catch(() => []) : Promise.resolve([]),
    getHomepageCollection().catch(() => ({ items: [] })),
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
        collectionItems: collection.items.length,
      }}
    />
  );
}
