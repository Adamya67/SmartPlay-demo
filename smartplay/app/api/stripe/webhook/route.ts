import { NextResponse } from "next/server";

import { processStripeWebhook } from "@/lib/billing/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  try {
    const payload = await request.text();
    await processStripeWebhook(payload, signature);
    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to process Stripe webhook.",
      },
      { status: 400 },
    );
  }
}
