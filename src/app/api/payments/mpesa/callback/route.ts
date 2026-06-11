import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const payload = await request.json();
  const callback = payload.Body?.stkCallback;
  const checkoutRequestId = callback?.CheckoutRequestID;
  const resultCode = callback?.ResultCode;

  if (checkoutRequestId) {
    await prisma.order.updateMany({
      where: { mpesaCheckoutRequestId: checkoutRequestId },
      data: { status: resultCode === 0 ? "PAID" : "FAILED" },
    });
  }

  return NextResponse.json({ ok: true });
}
