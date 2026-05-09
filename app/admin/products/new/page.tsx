import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getDictionary, getLocale, localized } from '@/lib/i18n';
import fs from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';

async function createAction(formData: FormData) {
  'use server';
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') redirect('/');

  const slug = String(formData.get('slug') ?? '').trim();
  const titleAr = String(formData.get('titleAr') ?? '').trim();
  const titleFr = String(formData.get('titleFr') ?? '').trim();
  const titleEn = String(formData.get('titleEn') ?? '').trim();
  const descriptionAr = String(formData.get('descriptionAr') ?? '');
  const descriptionFr = String(formData.get('descriptionFr') ?? '');
  const descriptionEn = String(formData.get('descriptionEn') ?? '');
  const priceDzd = Number(formData.get('priceDzd') ?? 0);
  const categoryId = String(formData.get('categoryId') ?? '');
  const sellerId = String(formData.get('sellerId') ?? user!.id);
  const coverUrl = String(formData.get('coverUrl') ?? '/covers/icons.svg');
  const file = formData.get('file');

  if (!slug || !titleEn || !categoryId || priceDzd <= 0 || !(file instanceof File) || file.size === 0) {
    redirect('/admin/products/new?error=invalid');
  }

  const safeName = `${slug}-${Date.now()}-${(file as File).name.replace(/[^a-z0-9._-]/gi, '_')}`;
  const dir = path.join(process.cwd(), 'private-files');
  await fs.mkdir(dir, { recursive: true });
  const buf = Buffer.from(await (file as File).arrayBuffer());
  await fs.writeFile(path.join(dir, safeName), buf);

  await prisma.product.create({
    data: {
      slug, titleAr, titleFr, titleEn,
      descriptionAr, descriptionFr, descriptionEn,
      priceCents: Math.round(priceDzd * 100),
      coverUrl,
      fileUrl: safeName,
      fileName: (file as File).name,
      fileSize: (file as File).size,
      sellerId, categoryId,
    },
  });

  redirect('/admin/products');
}

export default async function NewProductPage() {
  const locale = getLocale();
  const dict = getDictionary(locale);
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user!.role !== 'ADMIN') redirect('/');

  const [categories, sellers] = await Promise.all([
    prisma.category.findMany(),
    prisma.user.findMany({ where: { role: { in: ['SELLER', 'ADMIN'] } } }),
  ]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">+ {dict.products}</h1>
      <form action={createAction} encType="multipart/form-data" className="card p-5 space-y-4">
        <div>
          <label className="label">Slug</label>
          <input className="input" name="slug" required />
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <div><label className="label">Title (AR)</label><input className="input" name="titleAr" /></div>
          <div><label className="label">Title (FR)</label><input className="input" name="titleFr" /></div>
          <div><label className="label">Title (EN)</label><input className="input" name="titleEn" required /></div>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <div><label className="label">Desc (AR)</label><textarea className="input" name="descriptionAr" rows={3} /></div>
          <div><label className="label">Desc (FR)</label><textarea className="input" name="descriptionFr" rows={3} /></div>
          <div><label className="label">Desc (EN)</label><textarea className="input" name="descriptionEn" rows={3} /></div>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="label">Price (DZD)</label>
            <input className="input" type="number" min={1} step="0.01" name="priceDzd" required />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" name="categoryId" required>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{localized(c, 'name', locale)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Seller</label>
            <select className="input" name="sellerId" defaultValue={user!.id}>
              {sellers.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Cover URL</label>
          <input className="input" name="coverUrl" defaultValue="/covers/icons.svg" />
        </div>
        <div>
          <label className="label">Digital file (PDF, ZIP, etc.)</label>
          <input className="input" type="file" name="file" required />
        </div>
        <button type="submit" className="btn-primary">Create</button>
      </form>
    </div>
  );
}
