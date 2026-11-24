import { redirect } from "next/navigation";
import { AdminAdminsPanel } from "@/components/admin/admin-admins-panel";
import { getAdminSession } from "@/lib/admin/auth";

export default async function AdminAdminsPage() {
  const session = await getAdminSession();
  if (!session || session.adminRole !== "owner") {
    redirect("/admin");
  }

  return <AdminAdminsPanel />;
}
