import { cn } from "@/lib/utils";

/** Afterpay brand mark — sized to match sibling button icons (square slot). */
export function AfterpayMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="5 4 28 16"
      className={cn("h-4 w-4 shrink-0", className)}
      aria-hidden
      focusable="false"
    >
      <path
        fill="currentColor"
        d="m27.4 6.8-2.7-1.6-2.7-1.6c-1.8-1-4.1.3-4.1 2.4v.4c0 .2.1.4.3.5l1.3.7c.4.2.8-.1.8-.5v-.8c0-.4.4-.7.8-.5l2.5 1.4 2.4 1.5c.4.2.4.7 0 .9l-2.5 1.4-2.5 1.6c-.4.2-.8-.1-.8-.5v-.4c0-2.1-2.3-3.4-4.1-2.4l-2.7 1.6-2.7 1.6c-1.8 1-1.8 3.7 0 4.7l2.7 1.6 2.7 1.6c1.8 1 4.1-.3 4.1-2.4v-.4c0-.2-.1-.4-.3-.5l-1.3-.7c-.4-.2-.8.1-.8.5v.8c0 .4-.4.7-.8.5l-2.5-1.4-2.5-1.5c-.4-.2-.4-.7 0-.9l2.5-1.4 2.5-1.4c.4-.2.8.1.8.5v.4c0 2.1 2.3 3.4 4.1 2.4l2.7-1.6 2.7-1.6c1.9-1.2 1.9-3.8.1-4.9z"
      />
    </svg>
  );
}

/** Shared icon box so Buy Now / Afterpay marks align at the same size. */
export const checkoutActionIconClass = "h-4 w-4 shrink-0";
