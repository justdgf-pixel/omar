import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function approveAction(formData: FormData) {
  'use server';
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const number = String(formData.get('number'));
  const order = await prisma.order.findUnique({ where: { number } });
  if (!order || order.buyerId !== user!.id) redirect('/');
  await prisma.order.update({
    where: { id: order.id },
    data: { status: 'PAID', paidAt: new Date() },
  });
  redirect(`/account/orders/${order.number}?placed=1`);
}

async function failAction(formData: FormData) {
  'use server';
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const number = String(formData.get('number'));
  const order = await prisma.order.findUnique({ where: { number } });
  if (!order || order.buyerId !== user!.id) redirect('/');
  await prisma.order.update({
    where: { id: order.id },
    data: { status: 'CANCELLED' },
  });
  redirect(`/account/orders/${order.number}`);
}

export default async function CibMockPage({
  searchParams,
}: {
  searchParams: { order?: string; amount?: string };
}) {
  const number = searchParams.order ?? '';
  const amount = Number(searchParams.amount ?? 0) / 100;
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card p-6">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 rounded-full bg-amber-100 text-amber-700 items-center justify-center font-bold">SATIM</div>
          <h1 className="mt-3 text-lg font-bold">CIB / Edahabia (sandbox)</h1>
          <p className="text-sm text-slate-600 mt-1">
            Cette page simule la passerelle SATIM. Aucune carte n'est requise. En production,
            l'utilisateur est redirigé vers le portail bancaire sécurisé.
          </p>
        </div>
        <div className="mt-4 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Commande</span><span className="font-mono">{number}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Montant</span><span className="font-semibold">{amount.toFixed(2)} DZD</span></div>
        </div>
        <div className="mt-5 flex gap-2">
          <form action={approveAction} className="flex-1">
            <input type="hidden" name="number" value={number} />
            <button type="submit" className="btn-primary w-full">Simuler succès</button>
          </form>
          <form action={failAction} className="flex-1">
            <input type="hidden" name="number" value={number} />
            <button type="submit" className="btn-secondary w-full">Échec</button>
          </form>
        </div>
        <Link href="/cart" className="block text-center text-xs text-slate-500 mt-4 hover:underline">Annuler</Link>
      </div>
    </div>
  );
}
