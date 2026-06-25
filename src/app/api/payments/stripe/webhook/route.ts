import { NextResponse } from "next/server";

// Stripe webhooks replaced by Paystack at /api/payments/paystack/webhook
export async function POST() {
  return NextResponse.json({ received: true });
}
