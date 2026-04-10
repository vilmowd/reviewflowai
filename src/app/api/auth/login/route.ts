import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { mapAuthRouteError } from "@/lib/auth-route-errors";
import {
  credentialsMatchAdmin,
  getConfiguredAdminEmail,
} from "@/lib/admin-auth";
import { hashPassword, verifyPassword } from "@/lib/password";
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

    if (credentialsMatchAdmin(email, password)) {
      const adminEmail = getConfiguredAdminEmail()!;
      const hashed = await hashPassword(password);
      const user = await prisma.user.upsert({
        where: { email: adminEmail },
        create: {
          email: adminEmail,
          passwordHash: hashed,
          plan: "PRO",
          emailAlertsEnabled: true,
          fullName: "Administrator",
        },
        update: {
          plan: "PRO",
          emailAlertsEnabled: true,
          passwordHash: hashed,
        },
      });
      await createSession({ sub: user.id, email: user.email });
      return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
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
