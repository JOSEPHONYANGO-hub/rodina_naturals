import { hash } from "bcryptjs";
import { badRequest, created, ok, unauthorized } from "@/lib/api-response";
import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().trim().optional(),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, role: true, createdAt: true } });
  return ok(users);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const body = createSchema.safeParse(await request.json());
  if (!body.success) return badRequest("Invalid input.");

  const exists = await prisma.user.findUnique({ where: { email: body.data.email } });
  if (exists) return badRequest("An account with this email already exists.");

  const user = await prisma.user.create({
    data: {
      name: body.data.name,
      email: body.data.email,
      password: await hash(body.data.password, 12),
      role: body.data.role,
    },
    select: { id: true, email: true, role: true },
  });

  return created(user);
}
