import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { markOrderPaid } from "@/lib/orders";

const schema = z.object({ action: z.enum(["approve", "reject"]) });

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  if (parsed.data.action === "approve") {
    await markOrderPaid(id);
  } else {
    await prisma.order.update({ where: { id }, data: { status: "REJECTED" } });
  }
  return NextResponse.json({ ok: true });
}
