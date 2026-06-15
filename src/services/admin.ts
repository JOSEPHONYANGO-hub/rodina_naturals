import { prisma } from "@/lib/prisma";

export async function getAdminDashboard() {
  return Promise.all([
    prisma.product.findMany({ include: { brand: true, category: true }, orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ include: { _count: { select: { products: true } } } }),
    prisma.brand.findMany({ include: { _count: { select: { products: true } } } }),
  ]);
}
