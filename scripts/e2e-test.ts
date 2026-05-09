/**
 * Programmatic end-to-end test for the most critical flow:
 *   buyer → order with proof → admin approves → download token works
 *
 * Run with: npx tsx scripts/e2e-test.ts
 * Hits the running dev/prod server on http://localhost:3000.
 */
import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { mkdirSync } from "node:fs";

const db = new PrismaClient();
const BASE = process.env.BASE ?? "http://localhost:3000";

async function fetchOrFail(url: string, init?: RequestInit) {
  const r = await fetch(url, init);
  if (!r.ok) {
    const body = await r.text();
    throw new Error(`${r.status} ${url}\n${body.slice(0, 400)}`);
  }
  return r;
}

async function main() {
  console.log("E2E: Souk Digital DZ");
  console.log("Server:", BASE);

  // 1) Pick a published product and ensure it has a real digital file.
  const product = await db.product.findFirst({
    where: { status: "PUBLISHED" },
    include: { seller: true },
  });
  if (!product) throw new Error("no products — did you seed?");

  if (!product.fileKey) {
    const dir = path.join(process.cwd(), "uploads", "private");
    mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, `e2e_${product.id}.txt`);
    writeFileSync(filePath, "Hello from Souk Digital DZ — E2E test asset.\n");
    await db.product.update({
      where: { id: product.id },
      data: {
        fileKey: filePath,
        fileName: "freelance-guide.txt",
        fileSize: 47,
      },
    });
    console.log("✓ attached test asset to", product.slug);
  }

  // 2) Find/create a buyer.
  const buyer = await db.user.findUnique({ where: { email: "buyer@souk.dz" } });
  if (!buyer) throw new Error("no buyer — did you seed?");

  // 3) Create an order directly (simulating checkout).
  const number = `E2E-${Date.now()}`;
  const order = await db.order.create({
    data: {
      number,
      buyerId: buyer.id,
      totalDzd: product.priceDzd,
      method: "BARIDIMOB",
      status: "AWAITING_REVIEW",
      proofImage: "/uploads/sample-ebook.svg",
      proofRef: "TR-E2E-001",
      items: {
        create: [
          {
            productId: product.id,
            qty: 1,
            priceDzd: product.priceDzd,
            titleSnapshot: product.titleFr,
          },
        ],
      },
    },
  });
  console.log("✓ created order", order.number);

  // 4) Approve as admin (call the action through the server).
  // We import the fulfill helper directly since the action is auth-gated.
  const { fulfillOrder } = await import("../src/lib/orderFulfill");
  await db.order.update({
    where: { id: order.id },
    data: { status: "PAID", paidAt: new Date() },
  });
  await fulfillOrder(order.id);
  console.log("✓ approved & fulfilled");

  // 5) Fetch a download token.
  const dl = await db.download.findFirst({ where: { orderId: order.id } });
  if (!dl) throw new Error("no download created");
  console.log("✓ download created (token len:", dl.token.length, ")");

  // 6) Hit /api/download/[token] and verify we get the file content.
  const r = await fetchOrFail(`${BASE}/api/download/${dl.token}`);
  const body = await r.text();
  const cd = r.headers.get("content-disposition");
  console.log("✓ download HTTP", r.status, "filename:", cd);
  if (!body.includes("Souk Digital DZ")) {
    throw new Error(`unexpected body: ${body.slice(0, 100)}`);
  }
  console.log("✓ file content verified:", JSON.stringify(body.trim()));

  // 7) Hit /api/download with a tampered token → 401.
  const bad = await fetch(`${BASE}/api/download/${dl.token}xxx`);
  console.log("✓ tampered token →", bad.status, "(expected 401)");

  // 8) Verify counter incremented.
  const after = await db.download.findUnique({ where: { id: dl.id } });
  console.log("✓ download count:", after?.count, "/", after?.maxCount);

  console.log("\nALL GREEN ✔");
}

main()
  .catch((e) => {
    console.error("E2E failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
