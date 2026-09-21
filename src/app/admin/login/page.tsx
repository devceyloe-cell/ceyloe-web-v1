"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type Step = "password" | "otp";

/** Admin sign-in — accounts are created with scripts/create-admin.mjs */
export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("password");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailHint, setEmailHint] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDevOtp("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Login failed");
      setLoading(false);
      return;
    }

    if (data.needsOtp) {
      setStep("otp");
      setEmailHint(data.emailHint || "");
      if (data.devOtp) setDevOtp(data.devOtp);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
    setLoading(false);
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Invalid code");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
    setLoading(false);
  }

  async function handleResend() {
    setLoading(true);
    setError("");
    setDevOtp("");

    const res = await fetch("/api/admin/resend-otp", { method: "POST" });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Could not resend code");
      setLoading(false);
      return;
    }

    if (data.emailHint) setEmailHint(data.emailHint);
    if (data.devOtp) setDevOtp(data.devOtp);
    setLoading(false);
  }

  function backToPassword() {
    setStep("password");
    setOtp("");
    setDevOtp("");
    setEmailHint("");
    setError("");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md border border-border bg-surface p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Ceyloe Admin</p>
        <h1 className="mt-2 font-display text-3xl font-light">
          {step === "otp" ? "Enter code" : "Sign in"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {step === "otp"
            ? `We sent a 6-digit code${emailHint ? ` to ${emailHint}` : ""}.`
            : "Admin accounts are created manually. Contact your site owner if you need access."}
        </p>

        {step === "password" ? (
          <form onSubmit={handlePasswordSubmit} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-xs uppercase tracking-widest text-muted"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs uppercase tracking-widest text-muted"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border bg-background px-4 py-3 pr-12 text-sm focus:border-gold focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted transition hover:text-gold"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="otp"
                className="mb-2 block text-xs uppercase tracking-widest text-muted"
              >
                One-time code
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full border border-border bg-background px-4 py-3 text-center text-lg tracking-[0.35em] focus:border-gold focus:outline-none"
                placeholder="••••••"
                required
              />
            </div>
            {devOtp ? (
              <p className="rounded border border-border bg-background px-3 py-2 text-xs text-muted">
                Dev OTP: <span className="font-semibold tracking-widest text-gold">{devOtp}</span>
              </p>
            ) : null}
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" disabled={loading || otp.length !== 6} className="w-full">
              {loading ? "Verifying..." : "Verify code"}
            </Button>
            <div className="flex items-center justify-between gap-3 text-sm">
              <button
                type="button"
                onClick={backToPassword}
                className="text-muted transition hover:text-gold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-muted transition hover:text-gold"
              >
                Resend code
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
