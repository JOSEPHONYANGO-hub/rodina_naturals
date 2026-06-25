import { ok, unauthorized } from "@/lib/api-response";
import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const patchSchema = z.object({ role: z.enum(["USER", "ADMIN"]) });

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { role } = patchSchema.parse(await request.json());
  const user = await prisma.user.update({ where: { id: params.id }, data: { role } });
  return ok({ id: user.id, role: user.role });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  await prisma.user.delete({ where: { id: params.id } });
  return ok({ deleted: true });
}
