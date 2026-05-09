import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ProductForm } from "@/components/ProductForm";
import { createProductAction } from "@/app/actions/seller";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  if (!user.sellerProfile) redirect("/sell");
  const sp = await searchParams;

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold">Nouveau produit</h1>
      {sp.error && (
        <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {sp.error}
        </p>
      )}
      <div className="mt-6">
        <ProductForm action={createProductAction} submitLabel="Créer le produit" />
      </div>
    </div>
  );
}
