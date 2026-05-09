"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { savePrivateUpload, savePublicUpload } from "@/lib/uploads";

const slugSchema = z
  .string()
  .min(3)
  .max(40)
  .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens.");

const becomeSellerSchema = z.object({
  storeName: z.string().min(2).max(80),
  storeSlug: slugSchema,
  bio: z.string().max(600).optional(),
  ccpAccount: z.string().max(80).optional(),
});

export async function becomeSellerAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  if (user.sellerProfile) redirect("/seller");

  const parsed = becomeSellerSchema.safeParse({
    storeName: formData.get("storeName"),
    storeSlug: String(formData.get("storeSlug") || "").toLowerCase(),
    bio: formData.get("bio") || undefined,
    ccpAccount: formData.get("ccpAccount") || undefined,
  });
  if (!parsed.success) {
    redirect(
      `/sell?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid")}`,
    );
  }

  const exists = await prisma.sellerProfile.findUnique({
    where: { storeSlug: parsed.data.storeSlug },
  });
  if (exists) {
    redirect(`/sell?error=${encodeURIComponent("Ce slug est déjà pris")}`);
  }

  await prisma.sellerProfile.create({
    data: {
      userId: user.id,
      storeName: parsed.data.storeName,
      storeSlug: parsed.data.storeSlug,
      bio: parsed.data.bio,
      ccpAccount: parsed.data.ccpAccount,
      approved: true, // auto-approve in this MVP
    },
  });
  await prisma.user.update({
    where: { id: user.id },
    data: { role: user.role === "ADMIN" ? "ADMIN" : "SELLER" },
  });
  revalidatePath("/", "layout");
  redirect("/seller");
}

const productSchema = z.object({
  slug: slugSchema,
  titleAr: z.string().min(2).max(160),
  titleFr: z.string().min(2).max(160),
  titleEn: z.string().min(2).max(160),
  descAr: z.string().max(8000).optional().default(""),
  descFr: z.string().max(8000).optional().default(""),
  descEn: z.string().max(8000).optional().default(""),
  priceDzd: z.coerce.number().int().min(0).max(10_000_000),
  compareAtDzd: z.coerce.number().int().min(0).max(10_000_000).optional(),
  categoryId: z.string().min(1),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export async function createProductAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user?.sellerProfile) redirect("/sell");

  const parsed = productSchema.safeParse({
    slug: String(formData.get("slug") || "").toLowerCase(),
    titleAr: formData.get("titleAr"),
    titleFr: formData.get("titleFr"),
    titleEn: formData.get("titleEn"),
    descAr: formData.get("descAr") ?? "",
    descFr: formData.get("descFr") ?? "",
    descEn: formData.get("descEn") ?? "",
    priceDzd: formData.get("priceDzd") ?? 0,
    compareAtDzd: formData.get("compareAtDzd") || undefined,
    categoryId: formData.get("categoryId"),
    status: (formData.get("status") as string) || "DRAFT",
  });
  if (!parsed.success) {
    redirect(
      `/seller/products/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid")}`,
    );
  }

  const slugTaken = await prisma.product.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (slugTaken) {
    redirect(
      `/seller/products/new?error=${encodeURIComponent("Slug déjà utilisé")}`,
    );
  }

  let coverImage: string | null = null;
  const cover = formData.get("cover");
  if (cover && typeof cover !== "string" && cover.size > 0) {
    const r = await savePublicUpload(cover, "cover");
    coverImage = r.url;
  }

  let fileKey: string | null = null;
  let fileName: string | null = null;
  let fileSize: number | null = null;
  const asset = formData.get("asset");
  if (asset && typeof asset !== "string" && asset.size > 0) {
    const r = await savePrivateUpload(asset, "asset");
    fileKey = r.path;
    fileName = (asset as File).name;
    fileSize = r.size;
  }

  const created = await prisma.product.create({
    data: {
      ...parsed.data,
      sellerId: user.sellerProfile.id,
      coverImage,
      fileKey,
      fileName,
      fileSize,
    },
  });
  revalidatePath("/seller");
  revalidatePath("/", "layout");
  redirect(`/seller/products/${created.id}`);
}

export async function updateProductAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user?.sellerProfile) redirect("/sell");
  const id = String(formData.get("id") || "");
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product || product.sellerId !== user.sellerProfile.id) redirect("/seller");

  const parsed = productSchema.partial({ slug: true }).safeParse({
    slug: product.slug,
    titleAr: formData.get("titleAr"),
    titleFr: formData.get("titleFr"),
    titleEn: formData.get("titleEn"),
    descAr: formData.get("descAr") ?? "",
    descFr: formData.get("descFr") ?? "",
    descEn: formData.get("descEn") ?? "",
    priceDzd: formData.get("priceDzd") ?? 0,
    compareAtDzd: formData.get("compareAtDzd") || undefined,
    categoryId: formData.get("categoryId"),
    status: (formData.get("status") as string) || "DRAFT",
  });
  if (!parsed.success) {
    redirect(
      `/seller/products/${id}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid")}`,
    );
  }

  let coverImage: string | undefined;
  const cover = formData.get("cover");
  if (cover && typeof cover !== "string" && cover.size > 0) {
    const r = await savePublicUpload(cover, "cover");
    coverImage = r.url;
  }

  let fileKey: string | undefined;
  let fileName: string | undefined;
  let fileSize: number | undefined;
  const asset = formData.get("asset");
  if (asset && typeof asset !== "string" && asset.size > 0) {
    const r = await savePrivateUpload(asset, "asset");
    fileKey = r.path;
    fileName = (asset as File).name;
    fileSize = r.size;
  }

  await prisma.product.update({
    where: { id },
    data: {
      ...parsed.data,
      ...(coverImage ? { coverImage } : {}),
      ...(fileKey ? { fileKey, fileName, fileSize } : {}),
    },
  });
  revalidatePath("/seller");
  revalidatePath("/", "layout");
  redirect(`/seller/products/${id}?ok=1`);
}
