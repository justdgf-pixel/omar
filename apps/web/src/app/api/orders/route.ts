import { NextResponse } from "next/server";
import { createOrder, listRecentOrders } from "@/lib/orders";

export const runtime = "nodejs";

const supportedPaymentMethods = new Set(["CIB", "Edahabia", "BaridiMob"]);

export async function GET() {
  const orders = await listRecentOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;

  const productSlug = typeof body.productSlug === "string" ? body.productSlug : "";
  const customerName =
    typeof body.customerName === "string" ? body.customerName.trim() : "";
  const customerEmail =
    typeof body.customerEmail === "string" ? body.customerEmail.trim() : "";
  const customerPhone =
    typeof body.customerPhone === "string" ? body.customerPhone.trim() : "";
  const paymentMethod =
    typeof body.paymentMethod === "string" ? body.paymentMethod : "";

  if (!productSlug || !customerName || !customerEmail || !customerPhone) {
    return NextResponse.json(
      { error: "Please complete every checkout field." },
      { status: 400 },
    );
  }

  if (!supportedPaymentMethods.has(paymentMethod)) {
    return NextResponse.json(
      { error: "Please choose a supported payment method." },
      { status: 400 },
    );
  }

  if (!customerEmail.includes("@")) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  let order;

  try {
    order = await createOrder({
      productSlug,
      customerName,
      customerEmail,
      customerPhone,
      paymentMethod,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "The order could not be created.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    order,
    orderUrl: `/orders/${order.id}`,
    downloadUrl: `/downloads/${order.downloadToken}`,
  });
}
