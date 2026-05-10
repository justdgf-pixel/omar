import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomBytes, randomUUID } from "node:crypto";
import path from "node:path";
import { getProductBySlug } from "@/data/catalog";

export type OrderRecord = {
  id: string;
  createdAt: string;
  status: "demo-paid";
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
  productSlug: string;
  productTitle: string;
  amountDzd: number;
  deliveryLabel: string;
  assetPath: string;
  downloadToken: string;
};

type CreateOrderInput = {
  productSlug: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
};

const dataDirectory = path.join(process.cwd(), "data");
const ordersFile = path.join(dataDirectory, "orders.local.json");

async function ensureOrdersFile() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await readFile(ordersFile, "utf8");
  } catch {
    await writeFile(ordersFile, "[]\n", "utf8");
  }
}

export async function readOrders() {
  await ensureOrdersFile();

  const raw = await readFile(ordersFile, "utf8");
  return JSON.parse(raw) as OrderRecord[];
}

async function writeOrders(orders: OrderRecord[]) {
  await ensureOrdersFile();
  await writeFile(ordersFile, `${JSON.stringify(orders, null, 2)}\n`, "utf8");
}

export async function createOrder(input: CreateOrderInput) {
  const product = getProductBySlug(input.productSlug);

  if (!product) {
    throw new Error("Unknown product.");
  }

  const order: OrderRecord = {
    id: `order_${randomUUID()}`,
    createdAt: new Date().toISOString(),
    status: "demo-paid",
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    paymentMethod: input.paymentMethod,
    productSlug: product.slug,
    productTitle: product.title,
    amountDzd: product.priceDzd,
    deliveryLabel: product.deliveryLabel,
    assetPath: product.assetPath,
    downloadToken: randomBytes(16).toString("hex"),
  };

  const orders = await readOrders();
  orders.unshift(order);
  await writeOrders(orders);

  return order;
}

export async function findOrderById(id: string) {
  const orders = await readOrders();
  return orders.find((order) => order.id === id);
}

export async function findOrderByDownloadToken(downloadToken: string) {
  const orders = await readOrders();
  return orders.find((order) => order.downloadToken === downloadToken);
}

export async function listRecentOrders(limit = 25) {
  const orders = await readOrders();
  return orders.slice(0, limit);
}
