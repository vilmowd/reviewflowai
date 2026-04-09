import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { verifyCsrf } from "@/lib/csrf";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: "Invalid CSRF token." }, { status: 403 });
    }

    const ip = getRequestIp(request);
    const rate = checkRateLimit(`api:stripe:checkout:${ip}`, 20, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const stripe = getStripeClient();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    let customerId = user.stripeCustomerId ?? null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.fullName ?? undefined,
        metadata: { userId: user.id },
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const priceId = process.env.STRIPE_PRO_PRICE_ID;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: priceId
        ? [{ price: priceId, quantity: 1 }]
        : [
            {
              price_data: {
                currency: "usd",
                unit_amount: 2900,
                recurring: { interval: "month" },
                product_data: {
                  name: "ReviewFlow AI Pro",
                  description: "Unlimited businesses and email alerts",
                },
              },
              quantity: 1,
            },
          ],
      success_url: `${appUrl}/dashboard/business-profile?billing=success`,
      cancel_url: `${appUrl}/dashboard/business-profile?billing=cancelled`,
      metadata: { userId: user.id, plan: "PRO" },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Failed to start checkout." }, { status: 500 });
  }
}
