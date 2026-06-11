import { z } from "zod";
import { ok, unauthorized } from "@/lib/api-response";
import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

const statusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "FAILED", "CANCELLED"]),
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const body = statusSchema.parse(await request.json());
  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status: body.status },
  });

  return ok(order);
}
