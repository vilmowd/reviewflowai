import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { mapAuthRouteError } from "@/lib/auth-route-errors";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getRequestIp(request);
  const rate = checkRateLimit(`auth:login:${ip}`, 20, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const validPassword = await verifyPassword(password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    await createSession({ sub: user.id, email: user.email });
    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("Login error:", error);
    const { status, message } = mapAuthRouteError(error, "Login failed.");
    return NextResponse.json({ error: message }, { status });
  }
}
