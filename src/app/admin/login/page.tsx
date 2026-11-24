"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type Step = "password" | "otp" | "forgot" | "reset";

/** Admin sign-in — accounts are created with scripts/create-admin.mjs */
export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("password");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [emailHint, setEmailHint] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    setDevOtp("");
    setAttemptsRemaining(null);

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
      if (typeof data.attemptsRemaining === "number") {
        setAttemptsRemaining(data.attemptsRemaining);
      }
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
    setAttemptsRemaining(null);

    const res = await fetch("/api/admin/resend-otp", { method: "POST" });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Could not resend code");
      setLoading(false);
      return;
    }

    if (data.emailHint) setEmailHint(data.emailHint);
    if (data.devOtp) setDevOtp(data.devOtp);
    setInfo("A new code was sent.");
    setLoading(false);
  }

  async function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    setDevOtp("");

    const res = await fetch("/api/admin/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Could not start password reset");
      setLoading(false);
      return;
    }

    setInfo(data.message || "If that account exists, a reset code was sent.");
    if (data.devOtp) setDevOtp(data.devOtp);
    setStep("reset");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setLoading(false);
  }

  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAttemptsRemaining(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/admin/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, otp, newPassword }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Could not reset password");
      if (typeof data.attemptsRemaining === "number") {
        setAttemptsRemaining(data.attemptsRemaining);
      }
      setLoading(false);
      return;
    }

    setStep("password");
    setPassword("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setDevOtp("");
    setInfo("Password updated. Sign in with your new password.");
    setLoading(false);
  }

  function backToPassword() {
    setStep("password");
    setOtp("");
    setDevOtp("");
    setEmailHint("");
    setError("");
    setAttemptsRemaining(null);
  }

  const titles: Record<Step, string> = {
    password: "Sign in",
    otp: "Enter code",
    forgot: "Forgot password",
    reset: "Set new password",
  };

  const subtitles: Record<Step, string> = {
    password: "Admin username must be an email address.",
    otp: `We sent a 6-digit code${emailHint ? ` to ${emailHint}` : ""}.`,
    forgot: "Enter your admin username email. We’ll send a reset code there.",
    reset: "Enter the code from your email and choose a new password (min 12 characters).",
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md border border-border bg-surface p-8">
        <p className="text-xs tracking-[0.2em] text-gold uppercase">Ceyloe Admin</p>
        <h1 className="font-display mt-2 text-3xl font-light">{titles[step]}</h1>
        <p className="mt-2 text-sm text-muted">{subtitles[step]}</p>

        {info ? <p className="mt-4 text-sm text-emerald-700">{info}</p> : null}

        {step === "password" ? (
          <form onSubmit={handlePasswordSubmit} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-xs tracking-widest text-muted uppercase"
              >
                Username (email)
              </label>
              <input
                id="username"
                type="email"
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
                className="mb-2 block text-xs tracking-widest text-muted uppercase"
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
            <button
              type="button"
              onClick={() => {
                setStep("forgot");
                setError("");
                setInfo("");
                setPassword("");
              }}
              className="w-full text-center text-sm text-muted transition hover:text-gold"
            >
              Forgot password?
            </button>
          </form>
        ) : null}

        {step === "otp" ? (
          <form onSubmit={handleOtpSubmit} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="otp"
                className="mb-2 block text-xs tracking-widest text-muted uppercase"
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
            {attemptsRemaining !== null ? (
              <p className="text-xs text-muted">
                {attemptsRemaining === 0
                  ? "No attempts left — go back or resend a new code."
                  : `${attemptsRemaining} attempt${attemptsRemaining === 1 ? "" : "s"} remaining`}
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
        ) : null}

        {step === "forgot" ? (
          <form onSubmit={handleForgotSubmit} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="forgot-username"
                className="mb-2 block text-xs tracking-widest text-muted uppercase"
              >
                Username (email)
              </label>
              <input
                id="forgot-username"
                type="email"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
                required
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Sending…" : "Send reset code"}
            </Button>
            <button
              type="button"
              onClick={backToPassword}
              className="w-full text-center text-sm text-muted transition hover:text-gold"
            >
              Back to sign in
            </button>
          </form>
        ) : null}

        {step === "reset" ? (
          <form onSubmit={handleResetSubmit} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="reset-otp"
                className="mb-2 block text-xs tracking-widest text-muted uppercase"
              >
                Reset code
              </label>
              <input
                id="reset-otp"
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full border border-border bg-background px-4 py-3 text-center text-lg tracking-[0.35em] focus:border-gold focus:outline-none"
                required
              />
            </div>
            {devOtp ? (
              <p className="rounded border border-border bg-background px-3 py-2 text-xs text-muted">
                Dev OTP: <span className="font-semibold tracking-widest text-gold">{devOtp}</span>
              </p>
            ) : null}
            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-xs tracking-widest text-muted uppercase"
              >
                New password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-border bg-background px-4 py-3 pr-12 text-sm focus:border-gold focus:outline-none"
                  required
                  minLength={12}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted transition hover:text-gold"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-xs tracking-widest text-muted uppercase"
              >
                Confirm password
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
                required
                minLength={12}
              />
            </div>
            {attemptsRemaining !== null ? (
              <p className="text-xs text-muted">
                {attemptsRemaining} attempt{attemptsRemaining === 1 ? "" : "s"} remaining
              </p>
            ) : null}
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button
              type="submit"
              disabled={loading || otp.length !== 6 || newPassword.length < 12}
              className="w-full"
            >
              {loading ? "Updating…" : "Update password"}
            </Button>
            <button
              type="button"
              onClick={() => {
                setStep("forgot");
                setError("");
                setAttemptsRemaining(null);
              }}
              className="w-full text-center text-sm text-muted transition hover:text-gold"
            >
              Resend code
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
