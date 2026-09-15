import { UsersDashboard } from "@/components/admin/users-dashboard";
import { isMongoConfigured } from "@/config/env";
import { getAllUsers } from "@/lib/mongodb/users";

export default async function AdminUsersPage() {
  const users = isMongoConfigured() ? await getAllUsers() : [];

  return <UsersDashboard users={users} mongoConfigured={isMongoConfigured()} />;
}
