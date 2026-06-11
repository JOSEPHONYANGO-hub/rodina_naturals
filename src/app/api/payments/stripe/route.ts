import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/payments/stripe";

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: order.customerEmail,
      line_items: order.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "kes",
          unit_amount: Math.round(Number(item.price) * 100),
          product_data: {
            name: item.product.name,
            images: item.product.images.slice(0, 1),
          },
        },
      })),
      success_url: `${appUrl}/checkout/success?order=${order.id}`,
      cancel_url: `${appUrl}/checkout?order=${order.id}`,
      metadata: { orderId: order.id },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Unable to start Stripe checkout." }, { status: 500 });
  }
}
