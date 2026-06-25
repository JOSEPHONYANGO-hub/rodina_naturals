import { NextResponse } from "next/server";

// Direct M-Pesa integration replaced by Paystack (which handles M-Pesa as mobile_money channel).
export async function POST() {
  return NextResponse.json({ error: "Direct M-Pesa is no longer supported. Use /api/payments/paystack." }, { status: 410 });
}
