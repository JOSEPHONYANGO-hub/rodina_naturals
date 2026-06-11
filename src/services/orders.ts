import { prisma } from "@/lib/prisma";
import type { orderSchema } from "@/lib/validators";
import type { z } from "zod";

type OrderInput = z.infer<typeof orderSchema>;

export async function getAdminOrders() {
  return prisma.order.findMany({
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createOrder(input: OrderInput, userId?: string) {
  const products = await prisma.product.findMany({
    where: { id: { in: input.items.map((item) => item.productId) } },
  });

  if (products.length !== input.items.length) {
    throw new Error("One or more products are unavailable.");
  }

  const productById = new Map(products.map((product) => [product.id, product]));

  for (const item of input.items) {
    const product = productById.get(item.productId);
    if (!product || product.stock < item.quantity) {
      throw new Error("One or more products do not have enough stock.");
    }
  }

  const total = input.items.reduce((sum, item) => {
    const product = productById.get(item.productId);
    return sum + Number(product?.price || 0) * item.quantity;
  }, 0);

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        shippingAddress: input.shippingAddress,
        paymentMethod: input.paymentMethod,
        total,
        userId,
        items: {
          create: input.items.map((item) => {
            const product = productById.get(item.productId);
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

    await Promise.all(
      input.items.map((item) =>
        tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        }),
      ),
    );

    return order;
  });
}
