import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/ProductForm";
import { updateProductAction } from "@/app/actions/seller";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  if (!user.sellerProfile) redirect("/sell");
  const sp = await searchParams;

  const p = await prisma.product.findUnique({ where: { id } });
  if (!p || p.sellerId !== user.sellerProfile.id) notFound();

  return (
    <div className="container-page py-8">
      <p className="text-xs text-ink-500">/p/{p.slug}</p>
      <h1 className="text-2xl font-bold">{p.titleFr}</h1>
      {sp.ok && (
        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          ✓ Produit mis à jour.
        </p>
      )}
      {sp.error && (
        <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {sp.error}
        </p>
      )}
      <div className="mt-6">
        <ProductForm
          product={p}
          action={updateProductAction}
          submitLabel="Enregistrer"
        />
      </div>
    </div>
  );
}
