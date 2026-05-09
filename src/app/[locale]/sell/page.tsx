import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { localeFieldsFor, tFor, type Locale, isLocale } from "@/lib/i18n";
import { redirect, notFound } from "next/navigation";
import SellForm from "./SellForm";

export const dynamic = "force-dynamic";

export default async function SellPage({
  params
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = tFor(locale);
  const fields = localeFieldsFor(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect(`/${locale}/auth/login?next=/${locale}/sell`);

  const categories = await prisma.category.findMany();

  return (
    <div className="container-page py-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        {t("dashboard.newProduct")}
      </h1>
      <p className="mb-8 max-w-2xl text-slate-600">
        {locale === "ar"
          ? "املأ بيانات منتجك الرقمي وسيُراجع قبل النشر."
          : locale === "fr"
            ? "Remplissez les détails de votre produit numérique. Il sera examiné avant publication."
            : "Fill in your digital product details. It will be reviewed before publishing."}
      </p>
      <SellForm
        locale={locale}
        categories={categories.map((c) => ({
          id: c.id,
          name: c[fields.name]
        }))}
        t={{
          title: t("form.title"),
          description: t("form.description"),
          price: t("form.price"),
          category: t("form.category"),
          file: t("form.file"),
          cover: t("form.cover"),
          submit: t("form.submit"),
          loading: t("common.loading"),
          error: t("common.error")
        }}
      />
    </div>
  );
}
