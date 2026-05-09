import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalProducts,
      totalOrders,
      totalUsers,
      pendingOrders,
      completedOrders,
      revenueResult,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.count({ where: { status: "completed" } }),
      prisma.order.aggregate({
        where: { status: "completed" },
        _sum: { totalAmount: true },
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true } },
          items: { include: { product: { select: { name: true } } } },
        },
      }),
      prisma.product.findMany({
        take: 5,
        orderBy: { salesCount: "desc" },
        select: { name: true, salesCount: true, price: true, image: true },
      }),
    ]);

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalUsers,
      pendingOrders,
      completedOrders,
      totalRevenue: revenueResult._sum.totalAmount || 0,
      recentOrders,
      topProducts,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
