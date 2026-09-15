"use client";

import { useRouter } from "next/navigation";
import { Mail, Trash2, Users } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/mongodb/users";

interface UsersDashboardProps {
  users: User[];
  mongoConfigured: boolean;
}

export function UsersDashboard({ users: initial, mongoConfigured }: UsersDashboardProps) {
  const router = useRouter();

  async function remove(id: string, email: string) {
    if (!confirm(`Delete user "${email}"? Their saved cart will also be removed.`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Could not delete user");
      return;
    }
    router.refresh();
  }

  const verifiedCount = initial.filter((u) => u.emailVerified).length;

  return (
    <>
      <AdminHeader title="Users" />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Accounts</p>
          <h1 className="mt-1 font-display text-3xl font-light tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-muted">
            Shopper accounts from Login / Create account
            {initial.length > 0 ? (
              <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
                {initial.length} total · {verifiedCount} verified
              </span>
            ) : null}
          </p>
        </div>

        {!mongoConfigured ? (
          <div className="mb-8 border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
            Set <code className="text-foreground">MONGODB_URI</code> to manage users.
          </div>
        ) : null}

        {initial.length === 0 ? (
          <div className="border border-dashed border-border bg-surface/50 px-6 py-14 text-center">
            <Users className="mx-auto h-8 w-8 text-muted" />
            <p className="mt-3 text-sm text-muted">No users yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden border border-border">
            <div className="hidden grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-border bg-surface px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] text-muted sm:grid">
              <span>Email</span>
              <span>Status</span>
              <span>Created</span>
              <span className="text-right">Actions</span>
            </div>
            <ul className="divide-y divide-border">
              {initial.map((user) => (
                <li
                  key={user.id}
                  className="flex flex-col gap-3 bg-background px-4 py-4 sm:grid sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-4"
                >
                  <a
                    href={`mailto:${user.email}`}
                    className="inline-flex min-w-0 items-center gap-1.5 truncate font-medium text-foreground hover:text-gold"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0 text-muted" />
                    <span className="truncate">{user.email}</span>
                  </a>
                  <div>
                    {user.emailVerified ? (
                      <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted sm:text-right">
                    {new Date(user.createdAt).toLocaleString()}
                  </p>
                  <div className="flex sm:justify-end">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300"
                      onClick={() => remove(user.id, user.email)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
