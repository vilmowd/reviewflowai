import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { verifyCsrf } from "@/lib/csrf";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import { randomSuffix, slugify } from "@/lib/slug";

export async function POST(request: Request) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: "Invalid CSRF token." }, { status: 403 });
    }

    const ip = getRequestIp(request);
    const rate = checkRateLimit(`api:businesses:create:${ip}`, 30, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const googleReviewLink = String(body.googleReviewLink ?? "").trim();
    const contactEmail = String(body.contactEmail ?? "").trim();
    const category = String(body.category ?? "").trim();

    if (!name || !googleReviewLink) {
      return NextResponse.json(
        { error: "Business name and Google review link are required." },
        { status: 400 },
      );
    }

    try {
      const parsed = new URL(googleReviewLink);
      if (!parsed.protocol.startsWith("http")) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return NextResponse.json(
        { error: "Google review link must be a valid URL." },
        { status: 400 },
      );
    }

    const existingCount = await prisma.business.count({
      where: { ownerId: user.id },
    });

    if (user.plan === "FREE" && existingCount >= 1) {
      return NextResponse.json(
        {
          error: "Free plan includes 1 business only.",
          requiresUpgrade: true,
        },
        { status: 402 },
      );
    }

    const created = await prisma.business.create({
      data: {
        ownerId: user.id,
        name,
        category: category || null,
        googleReviewLink,
        contactEmail: contactEmail || null,
        slug: `${slugify(name)}-${randomSuffix(6)}`,
      },
    });

    return NextResponse.json({ ok: true, business: created });
  } catch (error) {
    console.error("Create business error:", error);
    return NextResponse.json({ error: "Failed to create business." }, { status: 500 });
  }
}
