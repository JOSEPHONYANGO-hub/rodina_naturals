import { z } from "zod";
import { ok, unauthorized } from "@/lib/api-response";
import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  status: z.enum(["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "FAILED", "CANCELLED"]).optional(),
  trackingNumber: z.string().trim().optional(),
  adminNotes: z.string().trim().optional(),
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: { select: { name: true, images: true } } } }, user: { select: { name: true, email: true } } },
  });

  return ok(order);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const body = updateSchema.parse(await request.json());
  const order = await prisma.order.update({
    where: { id: params.id },
    data: {
      ...(body.status !== undefined && { status: body.status }),
      ...(body.trackingNumber !== undefined && { trackingNumber: body.trackingNumber }),
      ...(body.adminNotes !== undefined && { adminNotes: body.adminNotes }),
    },
  });

  return ok(order);
}
