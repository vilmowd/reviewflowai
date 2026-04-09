import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { verifyCsrf } from "@/lib/csrf";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";

type RouteContext = {
  params: { businessId: string };
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: "Invalid CSRF token." }, { status: 403 });
    }

    const ip = getRequestIp(request);
    const rate = checkRateLimit(`api:businesses:update:${ip}`, 40, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();

    const business = await prisma.business.findUnique({
      where: { id: params.businessId },
      select: { id: true, ownerId: true },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found." }, { status: 404 });
    }

    if (business.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : undefined;
    const category =
      typeof body.category === "string" ? body.category.trim() : undefined;
    const googleReviewLink =
      typeof body.googleReviewLink === "string"
        ? body.googleReviewLink.trim()
        : undefined;
    const contactEmail =
      typeof body.contactEmail === "string" ? body.contactEmail.trim() : undefined;

    const updated = await prisma.business.update({
      where: { id: params.businessId },
      data: {
        ...(name ? { name } : {}),
        ...(category !== undefined ? { category: category || null } : {}),
        ...(googleReviewLink ? { googleReviewLink } : {}),
        ...(contactEmail !== undefined ? { contactEmail: contactEmail || null } : {}),
      },
    });

    return NextResponse.json({ ok: true, business: updated });
  } catch (error) {
    console.error("Update business error:", error);
    return NextResponse.json({ error: "Failed to update business." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: "Invalid CSRF token." }, { status: 403 });
    }

    const ip = getRequestIp(request);
    const rate = checkRateLimit(`api:businesses:delete:${ip}`, 20, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const business = await prisma.business.findUnique({
      where: { id: params.businessId },
      select: { id: true, ownerId: true },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found." }, { status: 404 });
    }

    if (business.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    await prisma.business.delete({ where: { id: params.businessId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete business error:", error);
    return NextResponse.json({ error: "Failed to delete business." }, { status: 500 });
  }
}
