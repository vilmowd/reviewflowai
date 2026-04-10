import { FunnelEventType } from "@prisma/client";
import { NextResponse } from "next/server";
import { CONCERN_OPTIONS } from "@/lib/concern-tags";
import { sendPrivateFeedbackAlert } from "@/lib/email/private-feedback-alert";
import { recordFunnelEvent } from "@/lib/funnel";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";

const ALLOWED_CONCERN_TAGS: Set<string> = new Set(
  CONCERN_OPTIONS.map((o) => o.id),
);

export async function POST(request: Request) {
  try {
    const ip = getRequestIp(request);
    const rate = checkRateLimit(`api:feedback:${ip}`, 30, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const body = await request.json();
    const {
      businessId,
      rating,
      comment,
      customerName,
      customerEmail,
      concernTags,
      sessionId,
    } = body;

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

    let tags: string[] = [];
    if (concernTags !== undefined) {
      if (!Array.isArray(concernTags)) {
        return NextResponse.json({ error: "Invalid concern tags." }, { status: 400 });
      }
      tags = concernTags.filter((t: unknown) => typeof t === "string") as string[];
      if (tags.some((t) => !ALLOWED_CONCERN_TAGS.has(t))) {
        return NextResponse.json({ error: "Invalid concern tag value." }, { status: 400 });
      }
      if (tags.length > 6) {
        return NextResponse.json({ error: "Too many concern tags." }, { status: 400 });
      }
    }

    if (
      sessionId !== undefined &&
      (typeof sessionId !== "string" || sessionId.length < 8 || sessionId.length > 128)
    ) {
      return NextResponse.json({ error: "Invalid session id." }, { status: 400 });
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
        concernTags: tags,
      },
    });

    if (sessionId) {
      await recordFunnelEvent({
        businessId,
        sessionId,
        eventType: FunnelEventType.PRIVATE_FEEDBACK_SUBMIT,
        rating,
        metadata: { feedbackId: feedback.id },
      });
    }

    const alertsOn =
      business.owner.plan === "PRO" && business.owner.emailAlertsEnabled;

    let emailSent: boolean | undefined;
    if (alertsOn) {
      const to =
        business.contactEmail?.trim() || business.owner.email;
      const { sent } = await sendPrivateFeedbackAlert({
        to,
        businessName: business.name,
        rating,
        comment: feedback.comment,
        customerName: feedback.customerName,
        customerEmail: feedback.customerEmail,
        concernTags: tags,
        feedbackId: feedback.id,
      });
      emailSent = sent;
    }

    return NextResponse.json({
      ok: true,
      feedbackId: feedback.id,
      emailAlertsEnabled: alertsOn,
      ...(alertsOn && { emailSent }),
    });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json({ error: "Failed to save feedback." }, { status: 500 });
  }
}
