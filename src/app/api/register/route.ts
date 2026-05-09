import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100).optional(),
  phone: z.string().max(30).optional(),
  wilaya: z.string().max(2).optional(),
  role: z.enum(["CUSTOMER", "SELLER"]).optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      phone: data.phone,
      wilaya: data.wilaya,
      role: data.role ?? "CUSTOMER",
      passwordHash,
    },
  });
  return NextResponse.json({ id: user.id, email: user.email, role: user.role });
}
