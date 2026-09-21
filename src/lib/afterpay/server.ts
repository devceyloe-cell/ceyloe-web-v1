import { env } from "@/config/env";
import { siteConfig } from "@/config/site";

export type AfterpayMoney = {
  amount: string;
  currency: string;
};

export type AfterpayCheckoutResult = {
  token: string;
  expires?: string;
  redirectCheckoutUrl: string;
};

export type AfterpayCaptureResult = {
  id: string;
  token: string;
  status: string;
  merchantReference?: string;
};

function apiBaseUrl() {
  return env.afterpay.sandbox
    ? "https://global-api-sandbox.afterpay.com"
    : "https://global-api.afterpay.com";
}

function authHeader() {
  const credentials = Buffer.from(
    `${env.afterpay.merchantId}:${env.afterpay.secretKey}`,
  ).toString("base64");
  return `Basic ${credentials}`;
}

function userAgent() {
  return `CeyloeWeb/0.1.0 (Next.js/16; Node/${process.version}; Ceyloe/${env.afterpay.merchantId}) ${siteConfig.url}`;
}

async function afterpayFetch<T>(
  path: string,
  init?: RequestInit & { idempotencyKey?: string },
): Promise<T> {
  const { idempotencyKey, ...requestInit } = init ?? {};
  const headers: Record<string, string> = {
    Authorization: authHeader(),
    Accept: "application/json",
    "User-Agent": userAgent(),
    ...(requestInit.headers as Record<string, string> | undefined),
  };

  if (requestInit.body) {
    headers["Content-Type"] = "application/json";
  }
  if (idempotencyKey) {
    headers["Request-Id"] = idempotencyKey;
  }

  const response = await fetch(`${apiBaseUrl()}${path}`, {
    ...requestInit,
    headers,
  });

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "message" in data
        ? String((data as { message: unknown }).message)
        : `Afterpay request failed (${response.status})`;
    throw new Error(message);
  }

  return data as T;
}

export function formatAfterpayAmount(amount: number): string {
  return amount.toFixed(2);
}

export async function createAfterpayCheckout(input: {
  amount: number;
  currency: string;
  email: string;
  givenNames?: string;
  surname?: string;
  phoneNumber?: string;
  merchantReference: string;
  redirectConfirmUrl: string;
  redirectCancelUrl: string;
  item: {
    name: string;
    sku?: string;
    quantity: number;
    price: number;
    pageUrl?: string;
    imageUrl?: string;
  };
}): Promise<AfterpayCheckoutResult> {
  const currency = input.currency.toUpperCase();
  const money: AfterpayMoney = {
    amount: formatAfterpayAmount(input.amount),
    currency,
  };

  return afterpayFetch<AfterpayCheckoutResult>("/v2/checkouts", {
    method: "POST",
    body: JSON.stringify({
      amount: money,
      consumer: {
        email: input.email,
        givenNames: input.givenNames || undefined,
        surname: input.surname || undefined,
        phoneNumber: input.phoneNumber || undefined,
      },
      merchantReference: input.merchantReference,
      merchant: {
        redirectConfirmUrl: input.redirectConfirmUrl,
        redirectCancelUrl: input.redirectCancelUrl,
        name: siteConfig.name,
      },
      items: [
        {
          name: input.item.name.slice(0, 255),
          sku: input.item.sku?.slice(0, 128),
          quantity: input.item.quantity,
          price: {
            amount: formatAfterpayAmount(input.item.price),
            currency,
          },
          pageUrl: input.item.pageUrl,
          imageUrl: input.item.imageUrl,
        },
      ],
      mode: "standard",
    }),
  });
}

export async function captureAfterpayPayment(input: {
  token: string;
  merchantReference?: string;
  requestId?: string;
}): Promise<AfterpayCaptureResult> {
  return afterpayFetch<AfterpayCaptureResult>("/v2/payments/capture", {
    method: "POST",
    idempotencyKey: input.requestId ?? input.token,
    body: JSON.stringify({
      token: input.token,
      merchantReference: input.merchantReference,
    }),
  });
}
