import { NextResponse } from "next/server";

// M-Pesa callbacks are now handled via Paystack webhooks at /api/payments/paystack/webhook
export async function POST() {
  return NextResponse.json({ ok: true });
}
