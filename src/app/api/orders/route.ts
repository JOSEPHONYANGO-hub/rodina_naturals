import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/validators";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  try {
    const body = orderSchema.parse(await request.json());
    const products = await prisma.product.findMany({
      where: { id: { in: body.items.map((item) => item.productId) } },
    });

    const total = body.items.reduce((sum, item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return sum + Number(product?.price || 0) * item.quantity;
    }, 0);

    const session = await getServerSession(authOptions);
    const order = await prisma.order.create({
      data: {
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        shippingAddress: body.shippingAddress,
        paymentMethod: body.paymentMethod,
        total,
        userId: session?.user.id,
        items: {
          create: body.items.map((item) => {
            const product = products.find((entry) => entry.id === item.productId);
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product?.price || 0,
            };
          }),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid order details." }, { status: 400 });
  }
}
