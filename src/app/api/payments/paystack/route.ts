import { badRequest, ok, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { initializeTransaction } from "@/lib/payments/paystack";

export async function POST(request: Request) {
  try {
    const { orderId, paymentMethod } = await request.json();

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return badRequest("Order not found.");

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const reference = `rodina-${orderId}-${Date.now()}`;

    const isMpesa = paymentMethod === "MPESA";
    const channels = isMpesa ? ["mobile_money"] : ["card"];

    const transaction = await initializeTransaction({
      email: order.customerEmail,
      amount: Number(order.total),
      reference,
      orderId,
      callbackUrl: `${appUrl}/checkout/success?reference=${reference}&order=${orderId}`,
      channels,
      // Pass phone for M-Pesa so Paystack can pre-fill the STK push number
      ...(isMpesa ? { phone: order.customerPhone } : {}),
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { paystackReference: reference },
    });

    return ok({ url: transaction.authorization_url, reference });
  } catch (error) {
    console.error("Paystack initialize error:", error);
    return serverError("Could not initialize payment.");
  }
}
