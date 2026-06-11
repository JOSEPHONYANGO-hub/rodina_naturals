import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { productSchema } from "@/lib/validators";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(Number(searchParams.get("page") || 1), 1);
  const take = Math.min(Number(searchParams.get("take") || 12), 48);
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const min = searchParams.get("min");
  const max = searchParams.get("max");

  const where = {
    AND: [
      query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" as const } },
              { description: { contains: query, mode: "insensitive" as const } },
            ],
          }
        : {},
      category ? { category: { slug: category } } : {},
      min ? { price: { gte: Number(min) } } : {},
      max ? { price: { lte: Number(max) } } : {},
    ],
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * take,
      take,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, pages: Math.ceil(total / take) });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = productSchema.parse(await request.json());
    const product = await prisma.product.create({
      data: {
        ...body,
        slug: slugify(body.name),
        price: body.price,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid product details." }, { status: 400 });
  }
}
