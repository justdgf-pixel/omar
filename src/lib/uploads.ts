import { mkdir, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import path from "node:path";

/**
 * For local dev we store uploads inside ./public/uploads (covers, proofs)
 * and ./uploads/private (digital deliverables — never publicly served).
 *
 * In production swap this for S3 / Bunny / Backblaze.
 */
const PUBLIC_DIR = path.join(process.cwd(), "public", "uploads");
const PRIVATE_DIR = path.join(process.cwd(), "uploads", "private");

function safeExt(name: string) {
  const ext = path.extname(name).toLowerCase();
  return /^\.[a-z0-9]{1,8}$/.test(ext) ? ext : "";
}

async function saveBufferTo(dir: string, file: File, prefix: string) {
  await mkdir(dir, { recursive: true });
  const ext = safeExt(file.name);
  const id = randomBytes(12).toString("hex");
  const base = `${prefix}_${id}${ext}`;
  const fullPath = path.join(dir, base);
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(fullPath, buf);
  return { path: fullPath, name: base, size: buf.length };
}

/** Returns a URL like /uploads/<file>. */
export async function savePublicUpload(file: File, prefix = "img") {
  const r = await saveBufferTo(PUBLIC_DIR, file, prefix);
  return { url: `/uploads/${r.name}`, name: r.name, size: r.size };
}

/** Returns the absolute disk path; never publicly served. */
export async function savePrivateUpload(file: File, prefix = "asset") {
  const r = await saveBufferTo(PRIVATE_DIR, file, prefix);
  return { path: r.path, name: r.name, size: r.size };
}

export const PRIVATE_UPLOADS_DIR = PRIVATE_DIR;
