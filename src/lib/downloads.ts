import crypto from "node:crypto";

// Generates a short, signed token granting a one-time-ish window to download
// a purchased product. The token encodes orderItemId + expiry and is verified
// by /api/downloads/[token].

const SECRET = process.env.DOWNLOAD_SIGNING_SECRET ?? "dev-secret-change-me";

export interface DownloadClaim {
  orderItemId: string;
  exp: number; // unix seconds
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromB64url(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

export function signDownloadToken(
  claim: Omit<DownloadClaim, "exp">,
  ttlSeconds = 60 * 60
): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload: DownloadClaim = { ...claim, exp };
  const body = b64url(JSON.stringify(payload));
  const sig = b64url(
    crypto.createHmac("sha256", SECRET).update(body).digest()
  );
  return `${body}.${sig}`;
}

export function verifyDownloadToken(token: string): DownloadClaim | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = b64url(
    crypto.createHmac("sha256", SECRET).update(body).digest()
  );
  if (
    expected.length !== sig.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  ) {
    return null;
  }
  try {
    const claim = JSON.parse(fromB64url(body).toString("utf8")) as DownloadClaim;
    if (!claim.exp || claim.exp < Math.floor(Date.now() / 1000)) return null;
    return claim;
  } catch {
    return null;
  }
}
