import { FunnelEventType } from "@prisma/client";
import { NextResponse } from "next/server";
import { recordFunnelEvent } from "@/lib/funnel";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";

const BODY_TYPES = new Set<FunnelEventType>([
  FunnelEventType.SURVEY_VIEW,
  FunnelEventType.STARS_SELECTED,
  FunnelEventType.GOOGLE_REDIRECT_CLICK,
  FunnelEventType.PRIVATE_FLOW_STARTED,
]);

export async function POST(request: Request) {
  try {
    const ip = getRequestIp(request);
    const rate = checkRateLimit(`api:funnel:${ip}`, 120, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const body = await request.json();
    const businessId = body.businessId as string | undefined;
    const sessionId = body.sessionId as string | undefined;
    const eventType = body.eventType as FunnelEventType | undefined;
    const rating = body.rating as number | undefined | null;
    const metadata = body.metadata;

    if (
      !businessId ||
      typeof sessionId !== "string" ||
      sessionId.length < 8 ||
      sessionId.length > 128
    ) {
      return NextResponse.json({ error: "Invalid session or business." }, { status: 400 });
    }

    if (!eventType || !BODY_TYPES.has(eventType)) {
      return NextResponse.json({ error: "Invalid event type." }, { status: 400 });
    }

    if (eventType === FunnelEventType.STARS_SELECTED) {
      if (typeof rating !== "number" || rating < 1 || rating > 5) {
        return NextResponse.json({ error: "Rating required for star selection." }, { status: 400 });
      }
    } else if (rating != null) {
      return NextResponse.json({ error: "Unexpected rating." }, { status: 400 });
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true },
    });
    if (!business) {
      return NextResponse.json({ error: "Business not found." }, { status: 404 });
    }

    await recordFunnelEvent({
      businessId,
      sessionId,
      eventType,
      rating: eventType === FunnelEventType.STARS_SELECTED ? rating : null,
      metadata: metadata === undefined ? undefined : metadata,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Funnel track error:", error);
    return NextResponse.json({ error: "Failed to record event." }, { status: 500 });
  }
}
