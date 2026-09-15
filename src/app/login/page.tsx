"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { useUserAuth } from "@/contexts/user-auth-context";
import { getGuestCartSnapshot, clearGuestCartStorage } from "@/contexts/cart-context";

type Mode = "login" | "register";
type Step = "email" | "otp";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, refresh } = useUserAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [devVerifyUrl, setDevVerifyUrl] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const confirmed = searchParams.get("confirmed") === "1";
  const tokenError = searchParams.get("error");

  function switchMode(next: Mode) {
    setMode(next);
    setStep("email");
    setError("");
    setInfo("");
    setDevVerifyUrl("");
    setDevOtp("");
    setOtp("");
  }

  async function handleResendVerification() {
    const target = pendingEmail || email;
    if (!target.trim()) {
      setError("Enter your email to resend the confirmation link.");
      return;
    }
    setResending(true);
    setError("");
    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: target }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setInfo(data.message || "Confirmation email sent. Check your inbox.");
      if (data.devVerifyUrl) setDevVerifyUrl(data.devVerifyUrl);
    } else {
      setError(data.error || "Could not resend confirmation email");
    }
    setResending(false);
  }

  async function handleResendOtp() {
    const target = pendingEmail || email;
    if (!target.trim()) return;
    setResending(true);
    setError("");
    const res = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: target }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setInfo(data.message || "A new login code was sent.");
      if (data.devOtp) setDevOtp(data.devOtp);
    } else {
      setError(data.error || "Could not resend code");
    }
    setResending(false);
  }

  async function completeLogin(user: { id: string; email: string }) {
    clearGuestCartStorage();
    setUser(user);
    await refresh();
    const next = searchParams.get("next");
    router.push(next && next.startsWith("/") ? next : "/cart");
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    setDevVerifyUrl("");
    setDevOtp("");

    if (mode === "login" && step === "otp") {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingEmail || email,
          otp,
          cart: getGuestCartSnapshot(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.user) {
        await completeLogin(data.user);
      } else {
        setError(data.error || "Invalid or expired code");
      }
      setLoading(false);
      return;
    }

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        cart: getGuestCartSnapshot(),
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.needsOtp) {
      setPendingEmail(data.email || email);
      setStep("otp");
      setInfo(data.message || "Enter the 6-digit code we emailed you.");
      if (data.devOtp) setDevOtp(data.devOtp);
      setLoading(false);
      return;
    }

    if (res.ok && data.needsVerification) {
      setPendingEmail(data.email || email);
      setInfo(
        data.message ||
          "Check your email and click the confirmation link to activate your account.",
      );
      if (data.devVerifyUrl) setDevVerifyUrl(data.devVerifyUrl);
      setLoading(false);
      return;
    }

    if (res.ok && data.user) {
      await completeLogin(data.user);
    } else if (data.needsVerification) {
      setPendingEmail(data.email || email);
      setError(data.error || "Please confirm your email first.");
      if (data.devVerifyUrl) setDevVerifyUrl(data.devVerifyUrl);
    } else {
      setError(
        data.error ||
          (mode === "login" ? "Account not found" : "Could not create account"),
      );
    }

    setLoading(false);
  }

  const isRegister = mode === "register";
  const isOtpStep = mode === "login" && step === "otp";

  return (
    <div className="mx-auto w-full max-w-md border border-border bg-[#faf8f5] p-8 md:p-10">
      <Logo size="md" showLink={false} />
      <p className="font-poppins mt-6 text-[11px] font-normal uppercase tracking-[0.18em] text-[#004B69]">
        Your account
      </p>
      <h1 className="font-bell mt-2 text-3xl font-bold uppercase tracking-[0.01em] text-[#C09A4A]">
        {isRegister ? "Create account" : isOtpStep ? "Enter code" : "Login"}
      </h1>
      <p className="font-poppins mt-2 text-sm text-[#004B69]/80">
        {isRegister
          ? "Enter your email. We will send a confirmation link to activate your account."
          : isOtpStep
            ? `We sent a 6-digit code to ${pendingEmail || email}. Enter it to sign in.`
            : "Enter your email. We will send a one-time login code."}
      </p>

      {confirmed && !isOtpStep ? (
        <p className="mt-4 border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Email confirmed. Sign in with your email to receive a login code.
        </p>
      ) : null}
      {tokenError === "invalid_token" ? (
        <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          That confirmation link is invalid or expired. Create an account again or resend the link.
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {!isOtpStep ? (
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs uppercase tracking-widest text-muted"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border bg-white px-4 py-3 text-sm focus:border-[#004B69] focus:outline-none"
              required
              placeholder="you@example.com"
            />
          </div>
        ) : (
          <div>
            <label
              htmlFor="otp"
              className="mb-2 block text-xs uppercase tracking-widest text-muted"
            >
              Login code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full border border-border bg-white px-4 py-3 text-center text-2xl tracking-[0.35em] focus:border-[#004B69] focus:outline-none"
              required
              placeholder="000000"
            />
          </div>
        )}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {info ? <p className="text-sm text-emerald-800">{info}</p> : null}
        {devVerifyUrl ? (
          <p className="break-all text-xs text-[#004B69]/80">
            Dev confirmation link:{" "}
            <a href={devVerifyUrl} className="underline underline-offset-2">
              {devVerifyUrl}
            </a>
          </p>
        ) : null}
        {devOtp ? (
          <p className="text-xs text-[#004B69]/80">
            Dev OTP: <span className="font-semibold tracking-widest">{devOtp}</span>
          </p>
        ) : null}
        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-none bg-[#004B69] text-white hover:bg-[#004B69]/90"
        >
          {loading
            ? isRegister
              ? "Sending confirmation..."
              : isOtpStep
                ? "Verifying..."
                : "Sending code..."
            : isRegister
              ? "Create account"
              : isOtpStep
                ? "Verify & sign in"
                : "Send login code"}
        </Button>
      </form>

      {isOtpStep ? (
        <div className="mt-4 space-y-2 text-center text-sm">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending}
            className="text-[#004B69] underline-offset-2 hover:underline disabled:opacity-50"
          >
            {resending ? "Resending..." : "Resend code"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setOtp("");
              setInfo("");
              setError("");
              setDevOtp("");
            }}
            className="block w-full text-muted underline-offset-2 hover:underline"
          >
            Use a different email
          </button>
        </div>
      ) : null}

      {!isOtpStep && (pendingEmail || info || error.toLowerCase().includes("confirm")) && isRegister ? (
        <button
          type="button"
          onClick={handleResendVerification}
          disabled={resending}
          className="mt-4 w-full text-center text-sm text-[#004B69] underline-offset-2 hover:underline disabled:opacity-50"
        >
          {resending ? "Resending..." : "Resend confirmation email"}
        </button>
      ) : null}

      {!isOtpStep && (pendingEmail || error.toLowerCase().includes("confirm")) && !isRegister ? (
        <button
          type="button"
          onClick={handleResendVerification}
          disabled={resending}
          className="mt-4 w-full text-center text-sm text-[#004B69] underline-offset-2 hover:underline disabled:opacity-50"
        >
          {resending ? "Resending..." : "Resend confirmation email"}
        </button>
      ) : null}

      {!isOtpStep ? (
        <p className="mt-6 text-center text-sm text-[#004B69]/80">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="font-medium text-[#004B69] underline-offset-2 hover:underline"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Need an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("register")}
                className="font-medium text-[#004B69] underline-offset-2 hover:underline"
              >
                Create account
              </button>
            </>
          )}
        </p>
      ) : null}

      <p className="mt-4 text-center text-sm text-muted">
        <Link href="/" className="underline-offset-2 hover:text-foreground hover:underline">
          Back to home
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-white px-[var(--margin-mobile)] py-16 md:px-[var(--margin-desktop)] md:py-24">
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-md border border-border bg-[#faf8f5] p-8 text-center text-sm text-muted md:p-10">
            Loading...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
