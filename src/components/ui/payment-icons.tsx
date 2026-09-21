import Image from "next/image";

/** Official Shopify payment badge SVGs (38×24), hosted locally. */
const paymentMethods = [
  { id: "amex", src: "/images/payments/amex.svg", label: "American Express" },
  { id: "afterpay", src: "/images/payments/afterpay.svg", label: "Afterpay" },
  { id: "apple-pay", src: "/images/payments/apple-pay.svg", label: "Apple Pay" },
  { id: "bancontact", src: "/images/payments/bancontact.svg", label: "Bancontact" },
  { id: "google-pay", src: "/images/payments/google-pay.svg", label: "Google Pay" },
  { id: "ideal-wero", src: "/images/payments/ideal-wero.svg", label: "iDEAL Wero" },
  { id: "mastercard", src: "/images/payments/mastercard.svg", label: "Mastercard" },
  { id: "shop-pay", src: "/images/payments/shop-pay.svg", label: "Shop Pay" },
  { id: "union-pay", src: "/images/payments/union-pay.svg", label: "UnionPay" },
  { id: "visa", src: "/images/payments/visa.svg", label: "Visa" },
] as const;

export function PaymentMethods({ className }: { className?: string }) {
  return (
    <ul
      className={`flex list-none flex-wrap items-center justify-center gap-2 p-0 ${className ?? ""}`}
      aria-label="Accepted payment methods"
    >
      {paymentMethods.map((method) => (
        <li key={method.id}>
          <span className="inline-flex h-6 w-[38px] items-center justify-center overflow-hidden rounded-[3px] bg-white shadow-sm ring-1 ring-black/5">
            <Image
              src={method.src}
              alt={method.label}
              width={38}
              height={24}
              unoptimized
              className="h-full w-full object-contain object-center"
            />
          </span>
        </li>
      ))}
    </ul>
  );
}
