import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getDictionary, getLocale } from '@/lib/i18n';
import { createSession, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/db';

async function loginAction(formData: FormData) {
  'use server';
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '/account');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.password))) {
    redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
  }
  await createSession({ userId: user!.id, role: user!.role as any });
  redirect(next);
}

export default function LoginPage({ searchParams }: { searchParams: { error?: string; next?: string } }) {
  const locale = getLocale();
  const dict = getDictionary(locale);
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card p-6">
        <h1 className="text-xl font-bold">{dict.login}</h1>
        {searchParams.error && (
          <p className="mt-3 text-sm text-rose-700">Identifiants incorrects.</p>
        )}
        <form action={loginAction} className="mt-4 space-y-3">
          <div>
            <label className="label">{dict.emailLabel}</label>
            <input className="input" type="email" name="email" required />
          </div>
          <div>
            <label className="label">{dict.passwordLabel}</label>
            <input className="input" type="password" name="password" required />
          </div>
          <input type="hidden" name="next" value={searchParams.next ?? '/account'} />
          <button type="submit" className="btn-primary w-full">{dict.login}</button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          <Link href="/signup" className="text-brand-700 hover:underline">{dict.signup}</Link>
        </p>
      </div>
    </div>
  );
}
