import { NextRequest, NextResponse } from "next/server";
import { env, isAfterpayConfigured } from "@/config/env";
import { createAfterpayCheckout } from "@/lib/afterpay/server";
import { getRequestBaseUrl } from "@/lib/request-base-url";
import { getProductByHandle } from "@/services/product-service";

function absoluteImageUrl(image: string, baseUrl: string) {
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  return `${baseUrl.replace(/\/$/, "")}${image.startsWith("/") ? image : `/${image}`}`;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  if (!isAfterpayConfigured()) {
    return NextResponse.json(
      { error: "Afterpay is not configured. Please contact us to purchase." },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const handle = typeof body.handle === "string" ? body.handle.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const givenNames = typeof body.givenNames === "string" ? body.givenNames.trim() : "";
    const surname = typeof body.surname === "string" ? body.surname.trim() : "";

    if (!handle) {
      return NextResponse.json({ error: "Product handle is required" }, { status: 400 });
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "A valid email is required for Afterpay" }, { status: 400 });
    }

    const product = await getProductByHandle(handle);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (!product.inStock) {
      return NextResponse.json({ error: "This item is currently unavailable" }, { status: 400 });
    }

    const currency = env.afterpay.currency;
    const supported = ["AUD", "NZD", "USD", "CAD", "GBP"];
    if (!supported.includes(currency)) {
      return NextResponse.json({ error: "Afterpay currency is not supported" }, { status: 500 });
    }

    const baseUrl = getRequestBaseUrl(request);
    const productUrl = `${baseUrl}/products/${encodeURIComponent(product.handle)}`;
    const merchantReference = `ceyloe-${product.handle}-${Date.now()}`;

    const checkout = await createAfterpayCheckout({
      amount: product.price,
      currency,
      email,
      givenNames: givenNames || undefined,
      surname: surname || undefined,
      merchantReference,
      redirectConfirmUrl: `${baseUrl}/checkout/afterpay/confirm?handle=${encodeURIComponent(product.handle)}&ref=${encodeURIComponent(merchantReference)}`,
      redirectCancelUrl: `${productUrl}?checkout=cancelled`,
      item: {
        name: product.title,
        sku: product.handle,
        quantity: 1,
        price: product.price,
        pageUrl: productUrl,
        imageUrl: absoluteImageUrl(product.image, baseUrl),
      },
    });

    if (!checkout.redirectCheckoutUrl && !checkout.token) {
      return NextResponse.json({ error: "Could not start Afterpay checkout" }, { status: 500 });
    }

    return NextResponse.json({
      url: checkout.redirectCheckoutUrl,
      token: checkout.token,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Afterpay checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
