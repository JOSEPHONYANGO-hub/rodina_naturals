import { NextResponse } from "next/server";

// Stripe has been replaced by Paystack. This route is kept as a stub.
export async function POST() {
  return NextResponse.json({ error: "Stripe payments are no longer supported. Use /api/payments/paystack." }, { status: 410 });
}
