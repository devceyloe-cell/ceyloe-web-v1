"use client";

import { useEffect, useId, useLayoutEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DeliveryDetailsInput } from "@/types/order";

const STORAGE_KEY = "ceyloe-delivery-details";
const MODAL_ROOT_ID = "ceyloe-modal-root";

function getModalRoot(): HTMLElement {
  if (typeof document === "undefined") {
    throw new Error("document is not available");
  }
  return document.getElementById(MODAL_ROOT_ID) ?? document.body;
}

const emptyForm: DeliveryDetailsInput = {
  name: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postcode: "",
  country: "Australia",
};

function loadSaved(): DeliveryDetailsInput {
  if (typeof window === "undefined") return emptyForm;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyForm;
    return { ...emptyForm, ...JSON.parse(raw) };
  } catch {
    return emptyForm;
  }
}

interface DeliveryDetailsModalProps {
  open: boolean;
  onClose: () => void;
  /** Product title(s) shown in the modal. */
  summary?: string;
  submitting?: boolean;
  error?: string;
  onSubmit: (details: DeliveryDetailsInput) => void | Promise<void>;
}

export function DeliveryDetailsModal({
  open,
  onClose,
  summary,
  submitting = false,
  error = "",
  onSubmit,
}: DeliveryDetailsModalProps) {
  const titleId = useId();
  const [form, setForm] = useState<DeliveryDetailsInput>(emptyForm);
  const [localError, setLocalError] = useState("");
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setPortalRoot(getModalRoot());
  }, []);

  useLayoutEffect(() => {
    const root = document.getElementById(MODAL_ROOT_ID);
    if (!root) return;
    root.style.pointerEvents = open ? "auto" : "none";
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setForm(loadSaved());
    setLocalError("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !submitting) onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, submitting]);

  function update<K extends keyof DeliveryDetailsInput>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLocalError("");
    const required: (keyof DeliveryDetailsInput)[] = [
      "name",
      "email",
      "phone",
      "line1",
      "city",
      "state",
      "postcode",
      "country",
    ];
    for (const key of required) {
      if (!String(form[key] || "").trim()) {
        setLocalError("Please fill in all required delivery fields.");
        return;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setLocalError("Please enter a valid email address.");
      return;
    }

    const payload: DeliveryDetailsInput = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      line1: form.line1.trim(),
      line2: form.line2?.trim() || undefined,
      city: form.city.trim(),
      state: form.state.trim(),
      postcode: form.postcode.trim(),
      country: form.country.trim() || "Australia",
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }

    await onSubmit(payload);
  }

  if (!open || !portalRoot) return null;

  const inputClass =
    "w-full border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none ring-gold/30 focus:border-gold focus:ring-2";
  const labelClass = "mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted";

  return createPortal(
    <div
      className="ceyloe-delivery-overlay"
      role="presentation"
      onClick={() => !submitting && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="ceyloe-delivery-dialog border border-border bg-surface-elevated shadow-2xl"
        style={{
          position: "relative",
          zIndex: 100001,
          backgroundColor: "#ffffff",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-border bg-surface-elevated px-5 py-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-gold">
              Checkout
            </p>
            <h2 id={titleId} className="mt-1 font-display text-2xl font-light tracking-tight">
              Delivery details
            </h2>
            {summary ? <p className="mt-1 text-sm text-muted">{summary}</p> : null}
            <p className="mt-1 text-xs text-muted">
              Guests can checkout without an account. We&apos;ll use these details for delivery.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded p-1.5 text-muted transition hover:bg-surface hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-surface-elevated px-5 py-5 pb-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>Full name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className={inputClass}
                autoComplete="name"
                required
              />
            </div>
            <div>
              <label className={labelClass}>Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputClass}
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className={labelClass}>Phone *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputClass}
                autoComplete="tel"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Address line 1 *</label>
              <input
                type="text"
                value={form.line1}
                onChange={(e) => update("line1", e.target.value)}
                className={inputClass}
                autoComplete="address-line1"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Address line 2</label>
              <input
                type="text"
                value={form.line2 ?? ""}
                onChange={(e) => update("line2", e.target.value)}
                className={inputClass}
                autoComplete="address-line2"
              />
            </div>
            <div>
              <label className={labelClass}>City / Suburb *</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className={inputClass}
                autoComplete="address-level2"
                required
              />
            </div>
            <div>
              <label className={labelClass}>State *</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                className={inputClass}
                autoComplete="address-level1"
                placeholder="WA"
                required
              />
            </div>
            <div>
              <label className={labelClass}>Postcode *</label>
              <input
                type="text"
                value={form.postcode}
                onChange={(e) => update("postcode", e.target.value)}
                className={inputClass}
                autoComplete="postal-code"
                required
              />
            </div>
            <div>
              <label className={labelClass}>Country *</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                className={inputClass}
                autoComplete="country-name"
                required
              />
            </div>
          </div>

          {localError || error ? (
            <p className="text-sm text-red-600">{localError || error}</p>
          ) : null}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="inline-flex items-center gap-1.5">
              {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {submitting ? "Starting payment…" : "Continue to payment"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    portalRoot,
  );
}
