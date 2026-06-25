import { compare, hash } from "bcryptjs";
import { badRequest, ok, unauthorized } from "@/lib/api-response";
import { getCurrentSession } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session) return unauthorized();

  const { currentPassword, newPassword } = await request.json();
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return badRequest("Invalid password data.");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.password) return badRequest("Account uses social login — password cannot be changed here.");

  const valid = await compare(currentPassword, user.password);
  if (!valid) return badRequest("Current password is incorrect.");

  const hashed = await hash(newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

  return ok({ success: true });
}
