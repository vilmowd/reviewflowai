import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getRequestIp(request);
  const rate = checkRateLimit(`auth:register:${ip}`, 10, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const fullName = String(body.fullName ?? "").trim();
    const password = String(body.password ?? "");

    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Email and password (min 8 chars) are required." },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        email,
        fullName: fullName || null,
        passwordHash: await hashPassword(password),
      },
    });

    await createSession({ sub: user.id, email: user.email });
    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
