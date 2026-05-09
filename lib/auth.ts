import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { prisma } from './db';
import type { Role } from './enums';

const SESSION_COOKIE = 'souk_session';
const SESSION_TTL_DAYS = 30;

function getSecretKey(): Uint8Array {
  const secret = process.env.APP_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('APP_SECRET is missing or too short. Set it in .env.');
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  userId: string;
  role: Role;
}

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_DAYS}d`)
    .sign(getSecretKey());

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * SESSION_TTL_DAYS,
  });
}

export function clearSession() {
  cookies().delete(SESSION_COOKIE);
}

export async function readSession(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return { userId: String(payload.userId), role: payload.role as Role };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await readSession();
  if (!session) return null;
  return prisma.user.findUnique({ where: { id: session.userId } });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}

export async function requireRole(roles: Role[]) {
  const user = await requireUser();
  if (!roles.includes(user.role as Role)) throw new Error('FORBIDDEN');
  return user;
}

export async function signDownloadToken(orderItemId: string, userId: string, ttlSeconds = 60 * 60) {
  return new SignJWT({ orderItemId, userId, kind: 'download' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(getSecretKey());
}

export async function verifyDownloadToken(token: string) {
  const { payload } = await jwtVerify(token, getSecretKey());
  if (payload.kind !== 'download') throw new Error('Invalid token');
  return {
    orderItemId: String(payload.orderItemId),
    userId: String(payload.userId),
  };
}
