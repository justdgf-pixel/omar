import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getDictionary, getLocale, localized } from '@/lib/i18n';
import { formatPrice } from '@/lib/format';

export const dynamic = 'force-dynamic';

async function deleteProduct(formData: FormData) {
  'use server';
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') redirect('/');
  const id = String(formData.get('id'));
  await prisma.product.update({ where: { id }, data: { published: false } });
  redirect('/admin/products');
}

export default async function AdminProductsPage() {
  const locale = getLocale();
  const dict = getDictionary(locale);
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/admin/products');
  if (user!.role !== 'ADMIN') redirect('/');

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true, seller: true },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">{dict.products}</h1>
        <Link href="/admin/products/new" className="btn-primary">+ New</Link>
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr className="text-left">
              <th className="p-3"></th>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Seller</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.coverUrl} alt="" className="h-10 w-10 rounded object-cover" />
                </td>
                <td className="p-3">
                  <Link href={`/products/${p.slug}`} className="hover:underline font-medium">
                    {localized(p, 'title', locale)}
                  </Link>
                  <div className="text-xs text-slate-500">{p.slug}</div>
                </td>
                <td className="p-3">{localized(p.category, 'name', locale)}</td>
                <td className="p-3">{p.seller.name}</td>
                <td className="p-3 font-semibold">{formatPrice(p.priceCents, locale)}</td>
                <td className="p-3">{p.published ? <span className="badge-ok">PUBLISHED</span> : <span className="badge-mute">HIDDEN</span>}</td>
                <td className="p-3">
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="text-rose-700 hover:underline text-xs">Hide</button>
                  </form>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-slate-500">{dict.empty}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
