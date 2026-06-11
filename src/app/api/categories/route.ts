import { created, ok, unauthorized, badRequest } from "@/lib/api-response";
import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validators";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return ok(categories);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  try {
    const body = categorySchema.parse(await request.json());
    const category = await prisma.category.upsert({
      where: { slug: body.name.toLowerCase() },
      update: { name: body.name },
      create: { name: body.name, slug: body.name.toLowerCase() },
    });

    return created(category);
  } catch {
    return badRequest("Invalid category.");
  }
}
