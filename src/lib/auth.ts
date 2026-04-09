import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "rf_session";
const CSRF_COOKIE = "rf_csrf";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  sub: string;
  email: string;
};

function getAuthSecret() {
  const value = process.env.AUTH_SECRET;
  if (!value) {
    throw new Error("Missing AUTH_SECRET");
  }
  return new TextEncoder().encode(value);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getAuthSecret());

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  const csrfToken = crypto.randomUUID();
  cookies().set(CSRF_COOKIE, csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearSession() {
  cookies().delete(SESSION_COOKIE);
  cookies().delete(CSRF_COOKIE);
}

export function getCsrfTokenFromCookie() {
  return cookies().get(CSRF_COOKIE)?.value ?? "";
}

export async function getCurrentUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const verified = await jwtVerify(token, getAuthSecret());
    const userId = verified.payload.sub;
    if (!userId) return null;

    return prisma.user.findUnique({
      where: { id: userId },
    });
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth");
  }
  return user;
}
