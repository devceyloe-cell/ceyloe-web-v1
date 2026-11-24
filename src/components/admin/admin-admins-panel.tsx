"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { formatAdminRole, type AdminRole } from "@/lib/admin/roles";

type AdminRow = {
  id: string;
  email: string;
  role: AdminRole;
  mfaEnabled: boolean;
  active: boolean;
  createdAt: string;
};

export function AdminAdminsPanel() {
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("staff");
  const [mfaEnabled, setMfaEnabled] = useState(true);

  const load = useCallback(async () => {
    setError("");
    const res = await fetch("/api/admin/admins");
    if (res.status === 403) {
      setError("Only owners can manage admin accounts.");
      setAdmins([]);
      setLoading(false);
      return;
    }
    if (!res.ok) {
      setError("Could not load admins");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setAdmins(Array.isArray(data.admins) ? data.admins : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load().catch(() => {
      setError("Could not load admins");
      setLoading(false);
    });
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role, mfaEnabled }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Could not create admin");
      setCreating(false);
      return;
    }

    setEmail("");
    setPassword("");
    setRole("staff");
    setMfaEnabled(true);
    setMessage(`Created ${data.admin?.email || "admin"}`);
    setCreating(false);
    await load();
  }

  async function patchAdmin(id: string, body: Record<string, unknown>) {
    setError("");
    setMessage("");
    const res = await fetch(`/api/admin/admins/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Could not update admin");
      return;
    }
    setMessage("Admin updated");
    await load();
  }

  return (
    <div>
      <AdminHeader title="Admins" />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Access</p>
        <h1 className="mt-2 font-display text-3xl font-light">Admin accounts</h1>
        <p className="mt-2 text-sm text-muted">
          Owners can create Staff or Owner accounts. Each admin has their own MFA emails and
          personal MFA toggle.
        </p>

        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
        {message ? <p className="mt-4 text-sm text-emerald-500">{message}</p> : null}

        <form
          onSubmit={handleCreate}
          className="mt-8 space-y-4 border border-border bg-surface p-6"
        >
          <h2 className="font-display text-xl font-light">Add admin</h2>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted">
              Temporary password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
              minLength={12}
              required
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AdminRole)}
                className="border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
              >
                <option value="staff">Staff</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            <label className="flex items-end gap-2 pb-3 text-sm">
              <input
                type="checkbox"
                checked={mfaEnabled}
                onChange={(e) => setMfaEnabled(e.target.checked)}
                className="h-4 w-4 accent-[var(--gold,#C09A4A)]"
              />
              Enable MFA for this account
            </label>
          </div>
          <Button type="submit" disabled={creating}>
            {creating ? "Creating…" : "Create admin"}
          </Button>
        </form>

        <section className="mt-8 space-y-3">
          <h2 className="font-display text-xl font-light">Existing admins</h2>
          {loading ? (
            <p className="text-sm text-muted">Loading…</p>
          ) : admins.length === 0 ? (
            <p className="text-sm text-muted">No admin accounts found.</p>
          ) : (
            admins.map((admin) => (
              <div
                key={admin.id}
                className="flex flex-col gap-3 border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{admin.email}</p>
                  <p className="mt-1 text-xs text-muted">
                    {formatAdminRole(admin.role)}
                    {" · "}
                    {admin.active ? "Active" : "Inactive"}
                    {" · "}
                    MFA {admin.mfaEnabled ? "on" : "off"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={admin.role}
                    onChange={(e) =>
                      patchAdmin(admin.id, { role: e.target.value as AdminRole })
                    }
                    className="border border-border bg-background px-3 py-2 text-xs focus:border-gold focus:outline-none"
                    aria-label={`Role for ${admin.email}`}
                  >
                    <option value="owner">Owner</option>
                    <option value="staff">Staff</option>
                  </select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      patchAdmin(admin.id, { mfaEnabled: !admin.mfaEnabled })
                    }
                  >
                    MFA {admin.mfaEnabled ? "off" : "on"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => patchAdmin(admin.id, { active: !admin.active })}
                  >
                    {admin.active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
