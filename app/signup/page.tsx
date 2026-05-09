import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getDictionary, getLocale } from '@/lib/i18n';
import { createSession, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/db';

async function signupAction(formData: FormData) {
  'use server';
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const name = String(formData.get('name') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const wantSeller = formData.get('seller') === 'on';
  const next = '/account';

  if (!email || password.length < 6) redirect('/signup?error=invalid');

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) redirect('/signup?error=exists');

  const user = await prisma.user.create({
    data: {
      email,
      name: name || email.split('@')[0],
      password: await hashPassword(password),
      role: wantSeller ? 'SELLER' : 'CUSTOMER',
    },
  });
  await createSession({ userId: user.id, role: user.role as any });
  redirect(next);
}

export default function SignupPage({ searchParams }: { searchParams: { error?: string } }) {
  const locale = getLocale();
  const dict = getDictionary(locale);
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card p-6">
        <h1 className="text-xl font-bold">{dict.signup}</h1>
        {searchParams.error === 'exists' && <p className="mt-3 text-sm text-rose-700">Email déjà utilisé.</p>}
        {searchParams.error === 'invalid' && <p className="mt-3 text-sm text-rose-700">Champs invalides.</p>}
        <form action={signupAction} className="mt-4 space-y-3">
          <div>
            <label className="label">{dict.nameLabel}</label>
            <input className="input" type="text" name="name" />
          </div>
          <div>
            <label className="label">{dict.emailLabel}</label>
            <input className="input" type="email" name="email" required />
          </div>
          <div>
            <label className="label">{dict.passwordLabel}</label>
            <input className="input" type="password" name="password" minLength={6} required />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="seller" />
            {dict.sellerDashboard}
          </label>
          <button type="submit" className="btn-primary w-full">{dict.signup}</button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          <Link href="/login" className="text-brand-700 hover:underline">{dict.login}</Link>
        </p>
      </div>
    </div>
  );
}
