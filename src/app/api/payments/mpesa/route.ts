import { NextResponse } from "next/server";
import { initiateStkPush } from "@/lib/payments/mpesa";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { orderId, phone } = await request.json();
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

    const response = await initiateStkPush({
      phone: phone || order.customerPhone,
      amount: Number(order.total),
      orderId: order.id,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { mpesaCheckoutRequestId: response.CheckoutRequestID },
    });

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: "Unable to start M-Pesa STK push." }, { status: 500 });
  }
}
