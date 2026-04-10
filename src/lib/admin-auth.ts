import { timingSafeEqual } from "crypto";

/** Normalized admin email from env, or null if not configured. */
export function getConfiguredAdminEmail(): string | null {
  const raw = process.env.ADMIN_USERNAME?.trim().toLowerCase();
  if (!raw) return null;
  return raw.length > 0 ? raw : null;
}

export function isAdminEmailReserved(email: string): boolean {
  const admin = getConfiguredAdminEmail();
  if (!admin) return false;
  return email.trim().toLowerCase() === admin;
}

/**
 * True when ADMIN_USERNAME and ADMIN_PASSWORD are both set and password matches (timing-safe).
 */
export function credentialsMatchAdmin(email: string, password: string): boolean {
  const adminEmail = getConfiguredAdminEmail();
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminEmail || adminPass == null || adminPass.length === 0) {
    return false;
  }
  if (email.trim().toLowerCase() !== adminEmail) {
    return false;
  }
  const a = Buffer.from(password, "utf8");
  const b = Buffer.from(adminPass, "utf8");
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}
