import { NextRequest, NextResponse } from "next/server";
import { isStripeConfigured } from "@/config/env";
import { getRequestBaseUrl } from "@/lib/request-base-url";
import { getStripe } from "@/lib/stripe/server";
import { getProductByHandle } from "@/services/product-service";

function absoluteImageUrl(image: string, baseUrl: string) {
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  return `${baseUrl.replace(/\/$/, "")}${image.startsWith("/") ? image : `/${image}`}`;
}

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Online checkout is not configured. Please contact us to purchase." },
      { status: 503 },
    );
  }

  try {
    const { handle } = await request.json();

    if (!handle || typeof handle !== "string") {
      return NextResponse.json({ error: "Product handle is required" }, { status: 400 });
    }

    const product = await getProductByHandle(handle);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (!product.inStock) {
      return NextResponse.json({ error: "This item is currently unavailable" }, { status: 400 });
    }

    const baseUrl = getRequestBaseUrl(request);
    const currency = (product.currency || "USD").toLowerCase();
    const stripe = getStripe();
    const productUrl = `${baseUrl}/products/${encodeURIComponent(product.handle)}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: Math.round(product.price * 100),
            product_data: {
              name: product.title,
              description: product.description.slice(0, 500) || undefined,
              images: [absoluteImageUrl(product.image, baseUrl)],
              metadata: {
                handle: product.handle,
                productId: product.id,
              },
            },
          },
        },
      ],
      metadata: {
        handle: product.handle,
        productId: product.id,
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${productUrl}?checkout=cancelled`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Could not start checkout" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Checkout failed. Please try again." }, { status: 500 });
  }
}
