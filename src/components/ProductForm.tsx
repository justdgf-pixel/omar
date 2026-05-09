import { prisma } from "@/lib/db";

type Product = {
  id?: string;
  slug?: string;
  titleAr?: string;
  titleFr?: string;
  titleEn?: string;
  descAr?: string;
  descFr?: string;
  descEn?: string;
  priceDzd?: number;
  compareAtDzd?: number | null;
  status?: string;
  categoryId?: string;
  coverImage?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
};

export async function ProductForm({
  product,
  action,
  submitLabel,
}: {
  product?: Product;
  action: (formData: FormData) => Promise<void> | void;
  submitLabel: string;
}) {
  const categories = await prisma.category.findMany({ orderBy: { slug: "asc" } });
  const isEdit = !!product?.id;

  return (
    <form
      action={action as never}
      encType="multipart/form-data"
      className="space-y-6"
    >
      {isEdit && <input type="hidden" name="id" value={product!.id} />}

      <section className="card p-5">
        <h2 className="text-base font-semibold">Informations</h2>
        {!isEdit && (
          <div className="mt-4">
            <label className="label" htmlFor="slug">URL (slug)</label>
            <input
              id="slug"
              name="slug"
              required
              pattern="[a-z0-9-]+"
              minLength={3}
              defaultValue={product?.slug ?? ""}
              className="input"
              placeholder="mon-produit"
            />
          </div>
        )}

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="titleFr">Titre (FR)</label>
            <input id="titleFr" name="titleFr" required defaultValue={product?.titleFr ?? ""} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="titleAr">Titre (AR)</label>
            <input id="titleAr" name="titleAr" required defaultValue={product?.titleAr ?? ""} dir="rtl" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="titleEn">Title (EN)</label>
            <input id="titleEn" name="titleEn" required defaultValue={product?.titleEn ?? ""} className="input" />
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="descFr">Description (FR)</label>
            <textarea id="descFr" name="descFr" rows={4} defaultValue={product?.descFr ?? ""} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="descAr">الوصف (AR)</label>
            <textarea id="descAr" name="descAr" rows={4} defaultValue={product?.descAr ?? ""} dir="rtl" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="descEn">Description (EN)</label>
            <textarea id="descEn" name="descEn" rows={4} defaultValue={product?.descEn ?? ""} className="input" />
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="priceDzd">Prix (DZD)</label>
            <input id="priceDzd" name="priceDzd" type="number" min={0} required defaultValue={product?.priceDzd ?? 0} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="compareAtDzd">Prix barré (DZD)</label>
            <input id="compareAtDzd" name="compareAtDzd" type="number" min={0} defaultValue={product?.compareAtDzd ?? ""} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="categoryId">Catégorie</label>
            <select id="categoryId" name="categoryId" defaultValue={product?.categoryId ?? categories[0]?.id} className="input">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.nameFr}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="label" htmlFor="status">Statut</label>
          <select id="status" name="status" defaultValue={product?.status ?? "DRAFT"} className="input w-auto">
            <option value="DRAFT">Brouillon</option>
            <option value="PUBLISHED">Publié</option>
            <option value="ARCHIVED">Archivé</option>
          </select>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-base font-semibold">Médias & livrable</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="cover">Image de couverture</label>
            {product?.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.coverImage} alt="" className="mb-2 h-28 w-full rounded-lg object-cover" />
            )}
            <input id="cover" name="cover" type="file" accept="image/*" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="asset">Fichier numérique (livré aux acheteurs)</label>
            {product?.fileName && (
              <p className="mb-2 text-xs text-ink-500">
                Fichier actuel : <strong>{product.fileName}</strong>
                {product.fileSize ? ` (${(product.fileSize / 1024 / 1024).toFixed(1)} MB)` : ""}
              </p>
            )}
            <input id="asset" name="asset" type="file" className="input" />
            <p className="mt-1 text-xs text-ink-500">Stocké en privé. Téléchargeable uniquement via lien signé.</p>
          </div>
        </div>
      </section>

      <button className="btn-primary">{submitLabel}</button>
    </form>
  );
}
