import { getAllPages } from "@/lib/cms/local-store";
import { getAdminSession } from "@/lib/admin/auth";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminHomePage() {
  const [pages, session] = await Promise.all([getAllPages(true), getAdminSession()]);
  return <AdminDashboard pages={pages} session={session} />;
}
