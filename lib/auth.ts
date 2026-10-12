import crypto from "crypto";
import { cookies } from "next/headers";
import { SessionUser } from "./types";

const COOKIE_NAME = "ulaskami_session";
const AUTH_SECRET =
  process.env.SESSION_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "ulaskami-secret-key-salt-32-chars-minimum-safe";

if (
  process.env.NODE_ENV === "production" &&
  !process.env.SESSION_SECRET &&
  !process.env.NEXTAUTH_SECRET
) {
  console.warn(
    "[ULASKAMI SECURITY WARNING]: Variabel SESSION_SECRET belum disetel di lingkungan produksi! Menggunakan fallback rahasia default tidak aman untuk produksi."
  );
}

/**
 * Membuat salt dan hash password menggunakan algoritma Scrypt
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

/**
 * Memverifikasi kecocokan password dengan hash & salt tersimpan
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const computedHash = crypto.scryptSync(password, salt, 64).toString("hex");
    const storedBuffer = Buffer.from(hash, "hex");
    const computedBuffer = Buffer.from(computedHash, "hex");

    if (storedBuffer.length !== computedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(storedBuffer, computedBuffer);
  } catch {
    return false;
  }
}

/**
 * Membuat token sesi bertanda tangan digital (HMAC-SHA256)
 */
export function createSessionToken(user: SessionUser): string {
  const payload = JSON.stringify({
    user,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 hari
  });

  const encodedPayload = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

/**
 * Memverifikasi keabsahan tanda tangan token sesi
 */
export function verifySessionToken(token: string): SessionUser | null {
  try {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(encodedPayload)
      .digest("base64url");

    const sigBuf = Buffer.from(signature);
    const expSigBuf = Buffer.from(expectedSignature);

    if (sigBuf.length !== expSigBuf.length || !crypto.timingSafeEqual(sigBuf, expSigBuf)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString());
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Token kedaluwarsa
    }

    return payload.user as SessionUser;
  } catch {
    return null;
  }
}

/**
 * Mengambil data merchant yang sedang login dari HTTP cookie
 */
export async function getCurrentSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    return verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Menyimpan token sesi ke HTTP-only cookie
 */
export async function setSessionCookie(user: SessionUser): Promise<void> {
  const token = createSessionToken(user);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 hari
  });
}

/**
 * Menghapus cookie sesi saat logout
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Memeriksa apakah user memiliki hak akses Super Admin / Administrator
 */
export function isUserAdmin(email?: string | null): boolean {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.length > 0) {
    return adminEmails.includes(cleanEmail);
  }
  // Default fallback untuk akun demo / developer
  return cleanEmail === "budi@kopikenangan.id" || process.env.NODE_ENV !== "production";
}
