import crypto from "node:crypto";

const SECRET = process.env.DOWNLOAD_SIGNING_SECRET ?? "dev-only-insecure-secret";

/**
 * Mint a short, signed token bound to an order item. The token is also persisted in
 * the DownloadToken table so we can enforce expiry, revocation, and per-token
 * download counts. The signature defends against forgery if the DB row is missing.
 */
export function signDownload(payload: { orderId: string; productId: string; jti: string }): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyDownload(token: string): { orderId: string; productId: string; jti: string } | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export function newJti(): string {
  return crypto.randomBytes(16).toString("hex");
}
