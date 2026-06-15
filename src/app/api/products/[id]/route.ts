import { NextResponse } from "next/server";
import { badRequest, ok, unauthorized } from "@/lib/api-response";
import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validators";
import { updateProduct } from "@/services/catalog";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
    include: {
      brand: true,
      category: true,
      reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  return ok(product);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  try {
    const body = productSchema.partial().parse(await request.json());
    const product = await updateProduct(params.id, body);
    return ok(product);
  } catch {
    return badRequest("Invalid product details.");
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  await prisma.product.delete({ where: { id: params.id } });
  return ok({ ok: true });
}
