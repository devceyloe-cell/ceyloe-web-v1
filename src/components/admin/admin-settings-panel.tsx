"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";

type SettingsState = {
  mfaEnabled: boolean;
  email: string;
  updatedAt: string | null;
};

export function AdminSettingsPanel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [form, setForm] = useState<SettingsState>({
    mfaEnabled: false,
    email: "",
    updatedAt: null,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setUsername(data.profile?.username || "");
        setForm({
          mfaEnabled: Boolean(data.security?.mfaEnabled),
          email: data.profile?.email || "",
          updatedAt: data.security?.updatedAt || null,
        });
      })
      .catch(() => setError("Could not load settings"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mfaEnabled: form.mfaEnabled,
        email: form.email.trim() || undefined,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Could not save settings");
      setSaving(false);
      return;
    }

    setForm({
      mfaEnabled: Boolean(data.security?.mfaEnabled),
      email: data.profile?.email || "",
      updatedAt: data.security?.updatedAt || null,
    });
    setMessage("Settings saved");
    setSaving(false);
  }

  return (
    <div>
      <AdminHeader title="Settings" />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Security</p>
        <h1 className="mt-2 font-display text-3xl font-light">Admin settings</h1>
        <p className="mt-2 text-sm text-muted">
          Configure multi-factor authentication for admin sign-in. When MFA is on, password
          login sends a one-time code to the admin email.
        </p>

        {loading ? (
          <p className="mt-8 text-sm text-muted">Loading…</p>
        ) : (
          <form onSubmit={handleSave} className="mt-8 space-y-6 border border-border bg-surface p-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">Signed in as</p>
              <p className="mt-1 text-sm font-medium">{username}</p>
            </div>

            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-xs uppercase tracking-widest text-muted"
              >
                MFA email
              </label>
              <input
                id="admin-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
                placeholder="admin@ceyloe.com"
                required={form.mfaEnabled}
              />
              <p className="mt-2 text-xs text-muted">
                OTP codes are sent here when MFA is enabled.
              </p>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-background p-4">
              <input
                type="checkbox"
                checked={form.mfaEnabled}
                onChange={(e) => setForm((s) => ({ ...s, mfaEnabled: e.target.checked }))}
                className="mt-1 h-4 w-4 accent-[var(--gold,#C09A4A)]"
              />
              <span>
                <span className="block text-sm font-medium">Require MFA (email OTP)</span>
                <span className="mt-1 block text-xs text-muted">
                  Defaults to on in production. Turn off only for trusted local/staging
                  environments.
                </span>
              </span>
            </label>

            {form.updatedAt ? (
              <p className="text-xs text-muted">
                Last updated {new Date(form.updatedAt).toLocaleString()}
              </p>
            ) : null}

            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            {message ? <p className="text-sm text-emerald-500">{message}</p> : null}

            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save settings"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
