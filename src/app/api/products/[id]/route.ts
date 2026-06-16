import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
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
  } catch (error) {
    if (error instanceof ZodError) {
      return badRequest(error.issues[0]?.message || "Invalid product details.");
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return badRequest("SKU or slug already exists. Use a unique value.");
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return badRequest("Product was not found or could not be updated.");
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return badRequest(error.message.split("\n").filter(Boolean).slice(-1)[0] || "Invalid product update data.");
    }

    console.error("Product update failed:", error);
    return badRequest("Product could not be saved. Check the fields and try again.");
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  await prisma.product.delete({ where: { id: params.id } });
  return ok({ ok: true });
}
