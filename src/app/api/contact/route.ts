import { NextRequest, NextResponse } from "next/server";
import { ContactFormSchema } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = ContactFormSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "Invalid input" },
        { status: 400 },
      );
    }

    const { name, email, phone, subject, message } = parsed.data;

    // TODO: Integrate with Resend/SendGrid when RESEND_API_KEY is configured
    console.log("[Contact Form]", { name, email, phone, subject, message });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Contact Form Error]", error);
    return NextResponse.json({ error: "Unable to process your request" }, { status: 500 });
  }
}
