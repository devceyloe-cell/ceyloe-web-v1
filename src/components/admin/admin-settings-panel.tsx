"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";

const MAX_MFA_EMAILS = 5;

type SettingsForm = {
  mfaEnabled: boolean;
  emails: string[];
  updatedAt: string | null;
};

export function AdminSettingsPanel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [form, setForm] = useState<SettingsForm>({
    mfaEnabled: false,
    emails: [""],
    updatedAt: null,
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setUsername(data.profile?.username || "");
        const emails: string[] =
          Array.isArray(data.profile?.emails) && data.profile.emails.length > 0
            ? data.profile.emails
            : data.profile?.email
              ? [data.profile.email]
              : [""];
        setForm({
          mfaEnabled: Boolean(data.security?.mfaEnabled),
          emails,
          updatedAt: data.security?.updatedAt || null,
        });
      })
      .catch(() => setError("Could not load settings"))
      .finally(() => setLoading(false));
  }, []);

  function updateEmail(index: number, value: string) {
    setForm((s) => {
      const emails = [...s.emails];
      emails[index] = value;
      return { ...s, emails };
    });
  }

  function addEmail() {
    setForm((s) => {
      if (s.emails.length >= MAX_MFA_EMAILS) return s;
      return { ...s, emails: [...s.emails, ""] };
    });
  }

  function removeEmail(index: number) {
    setForm((s) => {
      const emails = s.emails.filter((_, i) => i !== index);
      return { ...s, emails: emails.length > 0 ? emails : [""] };
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const cleanedEmails = form.emails.map((e) => e.trim()).filter(Boolean);

    if (form.mfaEnabled && cleanedEmails.length === 0) {
      setError("Add at least one MFA email before enabling MFA");
      setSaving(false);
      return;
    }

    const changingPassword = Boolean(currentPassword || newPassword || confirmPassword);
    if (changingPassword) {
      if (!currentPassword || !newPassword) {
        setError("Enter current and new password to change password");
        setSaving(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("New password and confirmation do not match");
        setSaving(false);
        return;
      }
    }

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mfaEnabled: form.mfaEnabled,
        emails: cleanedEmails,
        ...(changingPassword
          ? { currentPassword, newPassword }
          : {}),
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Could not save settings");
      setSaving(false);
      return;
    }

    const emails: string[] =
      Array.isArray(data.profile?.emails) && data.profile.emails.length > 0
        ? data.profile.emails
        : [""];

    setForm({
      mfaEnabled: Boolean(data.security?.mfaEnabled),
      emails,
      updatedAt: data.security?.updatedAt || null,
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage(
      data.passwordChanged ? "Settings and password saved" : "Settings saved",
    );
    setSaving(false);
  }

  return (
    <div>
      <AdminHeader title="Settings" />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Security</p>
        <h1 className="mt-2 font-display text-3xl font-light">Admin settings</h1>
        <p className="mt-2 text-sm text-muted">
          Change your password and configure MFA. When MFA is on, the one-time code is
          sent to every listed email.
        </p>

        {loading ? (
          <p className="mt-8 text-sm text-muted">Loading…</p>
        ) : (
          <form onSubmit={handleSave} className="mt-8 space-y-8">
            <section className="space-y-4 border border-border bg-surface p-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">Signed in as</p>
                <p className="mt-1 text-sm font-medium">{username}</p>
              </div>

              <h2 className="font-display text-xl font-light">Change password</h2>
              <p className="text-xs text-muted">
                Leave blank to keep your current password. New password must be at least 12
                characters with mixed character types.
              </p>

              <PasswordField
                id="current-password"
                label="Current password"
                value={currentPassword}
                onChange={setCurrentPassword}
                show={showCurrent}
                onToggle={() => setShowCurrent((v) => !v)}
                autoComplete="current-password"
              />
              <PasswordField
                id="new-password"
                label="New password"
                value={newPassword}
                onChange={setNewPassword}
                show={showNew}
                onToggle={() => setShowNew((v) => !v)}
                autoComplete="new-password"
              />
              <PasswordField
                id="confirm-password"
                label="Confirm new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                show={showNew}
                onToggle={() => setShowNew((v) => !v)}
                autoComplete="new-password"
              />
            </section>

            <section className="space-y-4 border border-border bg-surface p-6">
              <h2 className="font-display text-xl font-light">MFA emails</h2>
              <p className="text-xs text-muted">
                OTP codes are delivered to all addresses below (up to {MAX_MFA_EMAILS}).
              </p>

              <div className="space-y-3">
                {form.emails.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => updateEmail(index, e.target.value)}
                      className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
                      placeholder={`admin${index + 1}@ceyloe.com`}
                      required={form.mfaEnabled && index === 0}
                    />
                    <button
                      type="button"
                      onClick={() => removeEmail(index)}
                      className="inline-flex shrink-0 items-center justify-center border border-border px-3 text-muted transition hover:border-red-400/50 hover:text-red-400"
                      aria-label={`Remove email ${index + 1}`}
                      disabled={form.emails.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addEmail}
                disabled={form.emails.length >= MAX_MFA_EMAILS}
                className="inline-flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add email
              </Button>

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
            </section>

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

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  autoComplete: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs uppercase tracking-widest text-muted">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className="w-full border border-border bg-background px-4 py-3 pr-12 text-sm focus:border-gold focus:outline-none"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted transition hover:text-gold"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
