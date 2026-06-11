import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = registerSchema.parse(await request.json());
    const exists = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });

    if (exists) {
      return NextResponse.json({ error: "Email is already registered." }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email.toLowerCase(),
        password: await hash(body.password, 12),
      },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid registration details." }, { status: 400 });
  }
}
