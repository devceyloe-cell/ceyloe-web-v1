"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  DEFAULT_SHIPPING_COUNTRY,
  SHIPPING_COUNTRIES,
} from "@/config/shipping-countries";
import type { DeliveryDetailsInput } from "@/types/order";

const STORAGE_KEY = "ceyloe-delivery-details";
export const DELIVERY_FORM_ID = "ceyloe-delivery-form";

const emptyForm: DeliveryDetailsInput = {
  name: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postcode: "",
  country: DEFAULT_SHIPPING_COUNTRY,
};

function loadSaved(): DeliveryDetailsInput {
  if (typeof window === "undefined") return emptyForm;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyForm;
    const parsed = { ...emptyForm, ...JSON.parse(raw) } as DeliveryDetailsInput;
    const country = String(parsed.country || "").trim();
    parsed.country = SHIPPING_COUNTRIES.includes(
      country as (typeof SHIPPING_COUNTRIES)[number],
    )
      ? country
      : DEFAULT_SHIPPING_COUNTRY;
    return parsed;
  } catch {
    return emptyForm;
  }
}

interface DeliveryDetailsFormProps {
  submitting?: boolean;
  error?: string;
  onSubmit: (details: DeliveryDetailsInput) => void | Promise<void>;
  /** Optional content rendered after fields (e.g. mobile pay button) */
  footer?: ReactNode;
}

export function DeliveryDetailsForm({
  submitting = false,
  error = "",
  onSubmit,
  footer,
}: DeliveryDetailsFormProps) {
  const [form, setForm] = useState<DeliveryDetailsInput>(emptyForm);
  const [localError, setLocalError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setForm(loadSaved());
    setReady(true);
  }, []);

  function update<K extends keyof DeliveryDetailsInput>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
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
      country: form.country.trim() || DEFAULT_SHIPPING_COUNTRY,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }

    await onSubmit(payload);
  }

  const inputClass =
    "w-full rounded-md border border-[#e5e2df] bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-rich-gold focus:ring-2 focus:ring-rich-gold/20";
  const labelClass =
    "mb-1.5 block text-[11px] font-medium text-[#5c5a57]";

  if (!ready) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 rounded-md bg-[#f3f1ee]" />
        <div className="h-10 rounded-md bg-[#f3f1ee]" />
        <div className="h-24 rounded-md bg-[#f3f1ee]" />
      </div>
    );
  }

  return (
    <form id={DELIVERY_FORM_ID} onSubmit={handleSubmit} noValidate className="space-y-8">
      <section className="space-y-4">
        <h2 className="font-manrope text-sm font-semibold tracking-wide text-foreground">
          Contact
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="delivery-name">
              Full name
            </label>
            <input
              id="delivery-name"
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass}
              autoComplete="name"
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="delivery-email">
              Email
            </label>
            <input
              id="delivery-email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="delivery-phone">
              Phone
            </label>
            <input
              id="delivery-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={inputClass}
              autoComplete="tel"
              required
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 border-t border-[#ece9e6] pt-8">
        <h2 className="font-manrope text-sm font-semibold tracking-wide text-foreground">
          Shipping address
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="delivery-line1">
              Address
            </label>
            <input
              id="delivery-line1"
              type="text"
              value={form.line1}
              onChange={(e) => update("line1", e.target.value)}
              className={inputClass}
              autoComplete="address-line1"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="delivery-line2">
              Apartment, suite, etc. (optional)
            </label>
            <input
              id="delivery-line2"
              type="text"
              value={form.line2 ?? ""}
              onChange={(e) => update("line2", e.target.value)}
              className={inputClass}
              autoComplete="address-line2"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="delivery-city">
              City / Suburb
            </label>
            <input
              id="delivery-city"
              type="text"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className={inputClass}
              autoComplete="address-level2"
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="delivery-state">
              State
            </label>
            <input
              id="delivery-state"
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
            <label className={labelClass} htmlFor="delivery-postcode">
              Postcode
            </label>
            <input
              id="delivery-postcode"
              type="text"
              value={form.postcode}
              onChange={(e) => update("postcode", e.target.value)}
              className={inputClass}
              autoComplete="postal-code"
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="delivery-country">
              Country
            </label>
            <select
              id="delivery-country"
              value={form.country || DEFAULT_SHIPPING_COUNTRY}
              onChange={(e) => update("country", e.target.value)}
              className={inputClass}
              autoComplete="country-name"
              required
            >
              {SHIPPING_COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {localError || error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {localError || error}
        </p>
      ) : null}

      {footer}
    </form>
  );
}
