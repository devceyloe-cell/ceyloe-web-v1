import { getAllPages } from "@/lib/cms/local-store";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminHomePage() {
  const pages = await getAllPages(true);
  return <AdminDashboard pages={pages} />;
}
