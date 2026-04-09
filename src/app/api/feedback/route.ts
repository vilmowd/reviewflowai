import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getRequestIp(request);
    const rate = checkRateLimit(`api:feedback:${ip}`, 30, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const body = await request.json();
    const { businessId, rating, comment, customerName, customerEmail } = body;

    if (!businessId || typeof comment !== "string" || comment.trim().length < 3) {
      return NextResponse.json(
        { error: "Invalid feedback payload." },
        { status: 400 },
      );
    }

    if (typeof rating !== "number" || rating < 1 || rating > 3) {
      return NextResponse.json(
        { error: "Private feedback supports ratings 1-3." },
        { status: 400 },
      );
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: { owner: true },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found." }, { status: 404 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        businessId,
        rating,
        comment: comment.trim(),
        customerName: customerName?.trim() || null,
        customerEmail: customerEmail?.trim() || null,
      },
    });

    return NextResponse.json({
      ok: true,
      feedbackId: feedback.id,
      emailAlertsEnabled:
        business.owner.plan === "PRO" && business.owner.emailAlertsEnabled,
    });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json({ error: "Failed to save feedback." }, { status: 500 });
  }
}
