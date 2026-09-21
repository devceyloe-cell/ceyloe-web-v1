/** Public Afterpay settings safe for client components (no secret). */
export const afterpayPublic = {
  merchantId: process.env.NEXT_PUBLIC_AFTERPAY_MERCHANT_ID ?? "1202585",
  countryCode: (process.env.NEXT_PUBLIC_AFTERPAY_COUNTRY_CODE ?? "AU").toUpperCase(),
  currency: (process.env.NEXT_PUBLIC_AFTERPAY_CURRENCY ?? "AUD").toUpperCase(),
  enabled: process.env.NEXT_PUBLIC_AFTERPAY_ENABLED !== "false",
} as const;

export function isAfterpayUiEnabled(): boolean {
  return Boolean(afterpayPublic.enabled && afterpayPublic.merchantId.trim());
}
