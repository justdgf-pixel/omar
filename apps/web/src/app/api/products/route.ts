import { NextResponse } from "next/server";
import { products } from "@/data/catalog";

export async function GET() {
  return NextResponse.json({ products });
}
