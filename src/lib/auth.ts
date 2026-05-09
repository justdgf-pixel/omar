import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const COOKIE = "sdz_session";
const ALG = "HS256";
const SESSION_DAYS = 30;

function getSecret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) {
    throw new Error("AUTH_SECRET must be set and ≥ 32 chars");
  }
  return new TextEncoder().encode(s);
}

export type SessionPayload = {
  uid: string;
  role: "BUYER" | "SELLER" | "ADMIN";
  email: string;
  name: string;
};

export async function hashPassword(p: string) {
  return bcrypt.hash(p, 10);
}

export async function verifyPassword(p: string, hash: string) {
  return bcrypt.compare(p, hash);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());
}

export async function readSession(): Promise<SessionPayload | null> {
  const c = await cookies();
  const token = c.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const c = await cookies();
  c.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
  });
}

export async function clearSessionCookie() {
  const c = await cookies();
  c.set(COOKIE, "", { path: "/", maxAge: 0 });
}

export async function getCurrentUser() {
  const s = await readSession();
  if (!s) return null;
  return prisma.user.findUnique({
    where: { id: s.uid },
    include: { sellerProfile: true },
  });
}

export async function requireUser() {
  const u = await getCurrentUser();
  if (!u) throw new Error("UNAUTHENTICATED");
  return u;
}

export async function requireRole(roles: ("BUYER" | "SELLER" | "ADMIN")[]) {
  const u = await requireUser();
  if (!roles.includes(u.role as "BUYER" | "SELLER" | "ADMIN")) {
    throw new Error("FORBIDDEN");
  }
  return u;
}

// ---------- Download tokens ------------------------------------------------

export async function signDownloadToken(opts: {
  downloadId: string;
  productId: string;
  uid: string;
  ttlSeconds?: number;
}): Promise<string> {
  return new SignJWT({
    did: opts.downloadId,
    pid: opts.productId,
    uid: opts.uid,
  })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${opts.ttlSeconds ?? 60 * 60}s`)
    .sign(getSecret());
}

export async function verifyDownloadToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as { did: string; pid: string; uid: string };
}
