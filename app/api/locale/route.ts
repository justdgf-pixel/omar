import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { LOCALE_COOKIE, isLocale } from '@/lib/i18n';

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  if (!json || !isLocale(json.locale)) {
    return NextResponse.json({ error: 'invalid locale' }, { status: 400 });
  }
  cookies().set(LOCALE_COOKIE, json.locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  return NextResponse.json({ ok: true });
}
