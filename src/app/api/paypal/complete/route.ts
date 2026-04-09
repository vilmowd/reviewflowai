import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { verifyCsrf } from "@/lib/csrf";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import { getPayPalSubscription } from "@/lib/paypal";

const ACTIVE_STATUSES = new Set(["ACTIVE", "APPROVED"]);

export async function POST(request: Request) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: "Invalid CSRF token." }, { status: 403 });
    }

    const ip = getRequestIp(request);
    const rate = checkRateLimit(`api:paypal:complete:${ip}`, 20, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as { subscriptionId?: string };
    const subscriptionId =
      typeof body.subscriptionId === "string" ? body.subscriptionId.trim() : "";
    if (!subscriptionId) {
      return NextResponse.json({ error: "Missing subscription id." }, { status: 400 });
    }

    const subscription = await getPayPalSubscription(subscriptionId);
    if (!ACTIVE_STATUSES.has(subscription.status)) {
      return NextResponse.json(
        { error: "Subscription is not active yet." },
        { status: 400 },
      );
    }

    if (!subscription.custom_id || subscription.custom_id !== user.id) {
      return NextResponse.json(
        { error: "Subscription does not match this account." },
        { status: 403 },
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        plan: "PRO",
        emailAlertsEnabled: true,
        paypalSubscriptionId: subscription.id,
        paypalSubscriptionStatus: subscription.status,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PayPal complete error:", error);
    return NextResponse.json(
      { error: "Could not confirm subscription." },
      { status: 500 },
    );
  }
}
