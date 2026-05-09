import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NewProductForm } from "./form";
import type { Locale } from "@/i18n/config";

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/${locale}/auth/login`);
  if (session.user.role === "CUSTOMER") redirect(`/${locale}/seller`);

  const categories = await prisma.category.findMany({ orderBy: { slug: "asc" } });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        {locale === "ar" ? "إضافة منتج" : locale === "fr" ? "Nouveau produit" : "New product"}
      </h1>
      <NewProductForm
        locale={locale as Locale}
        categories={categories.map((c) => ({
          id: c.id,
          nameAr: c.nameAr,
          nameFr: c.nameFr,
          nameEn: c.nameEn,
        }))}
      />
    </div>
  );
}
