import { NextRequest, NextResponse } from "next/server";
import { CustomJewelryInquirySchema } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = CustomJewelryInquirySchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "Invalid input" },
        { status: 400 },
      );
    }

    console.log("[Custom Jewelry Inquiry]", parsed.data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Custom Jewelry Inquiry Error]", error);
    return NextResponse.json({ error: "Unable to process your request" }, { status: 500 });
  }
}
