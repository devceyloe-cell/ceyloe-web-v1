import { NextRequest, NextResponse } from "next/server";
import { isMongoConfigured, isStripeConfigured } from "@/config/env";
import { getRequestBaseUrl } from "@/lib/request-base-url";
import { getStripe } from "@/lib/stripe/server";
import {
  attachStripeSession,
  createPendingOrder,
} from "@/lib/mongodb/orders";
import { validateCouponCode } from "@/lib/mongodb/coupons";
import { allocateDiscountAcrossCents, getSellPrice, roundMoney } from "@/lib/pricing";
import { getUserSession } from "@/lib/user/auth";
import { getProductByHandle } from "@/services/product-service";
import type { Product } from "@/types";
import type { OrderItem } from "@/types/order";
import { normalizeDeliveryDetails } from "@/types/order";
import type Stripe from "stripe";

function absoluteImageUrl(image: string, baseUrl: string) {
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  return `${baseUrl.replace(/\/$/, "")}${image.startsWith("/") ? image : `/${image}`}`;
}

function normalizeHandles(body: unknown): string[] {
  if (!body || typeof body !== "object") return [];
  const data = body as { handle?: unknown; handles?: unknown };

  if (Array.isArray(data.handles)) {
    return [
      ...new Set(
        data.handles
          .filter((h): h is string => typeof h === "string" && h.trim().length > 0)
          .map((h) => h.trim()),
      ),
    ];
  }

  if (typeof data.handle === "string" && data.handle.trim()) {
    return [data.handle.trim()];
  }

  return [];
}

async function loadCheckoutProducts(handles: string[]): Promise<
  { products: Product[] } | { error: string; status: number }
> {
  const products: Product[] = [];

  for (const handle of handles) {
    const product = await getProductByHandle(handle);
    if (!product) {
      return { error: `Product not found: ${handle}`, status: 404 };
    }
    if (!product.inStock) {
      return { error: `${product.title} is currently unavailable`, status: 400 };
    }
    products.push(product);
  }

  return { products };
}

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Online checkout is not configured. Please contact us to purchase." },
      { status: 503 },
    );
  }

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "Orders are not available right now. Please try again later." },
      { status: 503 },
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const handles = normalizeHandles(body);
    const delivery = normalizeDeliveryDetails(
      body && typeof body === "object" ? (body as { delivery?: unknown }).delivery as never : null,
    );
    const couponCodeRaw =
      body && typeof body === "object" && typeof (body as { couponCode?: unknown }).couponCode === "string"
        ? String((body as { couponCode: string }).couponCode).trim()
        : "";

    if (handles.length === 0) {
      return NextResponse.json(
        { error: "At least one product handle is required" },
        { status: 400 },
      );
    }

    if (!delivery) {
      return NextResponse.json(
        { error: "Please provide complete delivery details before checkout." },
        { status: 400 },
      );
    }

    const loaded = await loadCheckoutProducts(handles);
    if ("error" in loaded) {
      return NextResponse.json({ error: loaded.error }, { status: loaded.status });
    }

    const { products } = loaded;
    const baseUrl = getRequestBaseUrl(request);
    const currency = (products[0]?.currency || "AUD").toLowerCase();
    const stripe = getStripe();
    const fromCart = handles.length > 1 || body?.source === "cart";
    const source = fromCart ? "cart" : "product";
    const cancelUrl = fromCart
      ? `${baseUrl}/cart?checkout=cancelled`
      : `${baseUrl}/products/${encodeURIComponent(products[0].handle)}?checkout=cancelled`;

    const sessionUser = await getUserSession();

    const itemsSubtotal = roundMoney(
      products.reduce((sum, product) => sum + getSellPrice(product), 0),
    );

    let discountAmount = 0;
    let couponCode: string | undefined;
    if (couponCodeRaw) {
      const validated = await validateCouponCode(couponCodeRaw, itemsSubtotal);
      if (!validated.ok) {
        return NextResponse.json({ error: validated.error }, { status: 400 });
      }
      discountAmount = validated.discountAmount;
      couponCode = validated.coupon.code;
    }

    const amountTotal = roundMoney(Math.max(0, itemsSubtotal - discountAmount));

    const unitCents = products.map((product) => Math.round(getSellPrice(product) * 100));
    const discountedCents = allocateDiscountAcrossCents(unitCents, discountAmount);

    const orderItems: OrderItem[] = products.map((product) => ({
      handle: product.handle,
      productId: product.id,
      title: product.title,
      price: getSellPrice(product),
      currency: (product.currency || currency).toUpperCase(),
      quantity: 1,
      image: product.image,
    }));

    const order = await createPendingOrder({
      customer: delivery,
      items: orderItems,
      source,
      paymentMethod: "stripe",
      userId: sessionUser?.id ?? null,
      couponCode,
      discountAmount: discountAmount > 0 ? discountAmount : undefined,
      amountTotal,
    });

    if (!order) {
      return NextResponse.json(
        { error: "Could not create order. Please try again." },
        { status: 500 },
      );
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = products.map(
      (product, index) => ({
        quantity: 1,
        price_data: {
          currency: (product.currency || currency).toLowerCase(),
          unit_amount: discountedCents[index],
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
      }),
    );

    const shippingSummary = [
      delivery.line1,
      delivery.line2,
      `${delivery.city} ${delivery.state} ${delivery.postcode}`,
      delivery.country,
    ]
      .filter(Boolean)
      .join(", ");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      customer_email: delivery.email,
      metadata: {
        orderId: order.id,
        handles: products.map((p) => p.handle).join(","),
        productIds: products.map((p) => p.id).join(","),
        itemCount: String(products.length),
        itemsTotal: itemsSubtotal.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        couponCode: couponCode || "",
        source,
        customerName: delivery.name.slice(0, 500),
        customerPhone: delivery.phone.slice(0, 100),
        shippingAddress: shippingSummary.slice(0, 500),
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&clear_cart=1`,
      cancel_url: cancelUrl,
    });

    if (!session.url || !session.id) {
      return NextResponse.json({ error: "Could not start checkout" }, { status: 500 });
    }

    await attachStripeSession(order.id, session.id);

    return NextResponse.json({
      url: session.url,
      orderId: order.id,
      itemsTotal: amountTotal,
      itemCount: products.length,
      discountAmount,
      couponCode,
    });
  } catch (err) {
    console.error("[checkout]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Checkout failed. Please try again." }, { status: 500 });
  }
}
