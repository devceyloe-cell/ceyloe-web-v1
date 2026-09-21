import { NextRequest, NextResponse } from "next/server";
import { isAfterpayConfigured } from "@/config/env";
import { captureAfterpayPayment } from "@/lib/afterpay/server";
import { getRequestBaseUrl } from "@/lib/request-base-url";

export async function GET(request: NextRequest) {
  const baseUrl = getRequestBaseUrl(request);
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const orderToken = searchParams.get("orderToken");
  const handle = searchParams.get("handle") ?? "";
  const merchantReference = searchParams.get("ref") ?? undefined;

  const cancelUrl = handle
    ? `${baseUrl}/products/${encodeURIComponent(handle)}?checkout=cancelled`
    : `${baseUrl}/catalog`;

  if (!isAfterpayConfigured()) {
    return NextResponse.redirect(`${baseUrl}/contact?afterpay=unconfigured`);
  }

  if (status !== "SUCCESS" || !orderToken) {
    return NextResponse.redirect(cancelUrl);
  }

  try {
    const payment = await captureAfterpayPayment({
      token: orderToken,
      merchantReference,
      requestId: orderToken,
    });

    if (payment.status !== "APPROVED") {
      return NextResponse.redirect(
        `${cancelUrl}${cancelUrl.includes("?") ? "&" : "?"}afterpay=declined`,
      );
    }

    return NextResponse.redirect(
      `${baseUrl}/checkout/success?method=afterpay&order=${encodeURIComponent(payment.id)}`,
    );
  } catch {
    return NextResponse.redirect(
      `${cancelUrl}${cancelUrl.includes("?") ? "&" : "?"}afterpay=error`,
    );
  }
}
