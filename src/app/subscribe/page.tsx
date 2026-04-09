import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { getCsrfTokenFromCookie, getCurrentUser } from "@/lib/auth";
import { getPayPalClientId, getPayPalPlanId } from "@/lib/paypal";
import { PayPalSubscribeButtons } from "@/components/paypal-subscribe-buttons";

export const metadata: Metadata = {
  title: "Subscribe | ReviewFlow AI Pro",
  description:
    "ReviewFlow AI Pro — $100/year. Unlimited businesses, email alerts, and PayPal subscription checkout.",
};

export default async function SubscribePage() {
  const user = await getCurrentUser();
  const csrfToken = user ? getCsrfTokenFromCookie() : "";
  const clientId = getPayPalClientId() ?? "";
  const planId = getPayPalPlanId() ?? "";
  const configured = Boolean(clientId && planId);

  return (
    <section className="mx-auto max-w-2xl space-y-8 py-6 sm:py-10">
      <div className="text-center">
        <p className="text-sm font-medium text-indigo-300">ReviewFlow AI Pro</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          $100 / year
        </h1>
        <p className="mt-3 text-sm text-slate-400 sm:text-base">
          One annual subscription. Pay securely with PayPal. Cancel anytime from your
          PayPal account.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
        <ul className="space-y-3 text-sm text-slate-300">
          {[
            "Unlimited business profiles",
            "QR-powered review funnels for each location",
            "Email alerts for new private feedback",
            "Full access to the dashboard and future app features tied to your account",
          ].map((line) => (
            <li key={line} className="flex gap-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t border-slate-800 pt-8">
          {!user && (
            <div className="space-y-4 text-center">
              <p className="text-sm text-slate-400">
                Sign in or create an account so we can activate Pro on your profile after
                payment.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/auth?redirect=/subscribe"
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400"
                >
                  Sign in to subscribe
                </Link>
                <Link
                  href="/auth?redirect=/subscribe"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
                >
                  Create account
                </Link>
              </div>
            </div>
          )}

          {user && !configured && (
            <p className="text-center text-sm text-amber-300">
              PayPal is not configured yet. Add{" "}
              <code className="rounded bg-slate-800 px-1 py-0.5 text-xs">
                NEXT_PUBLIC_PAYPAL_CLIENT_ID
              </code>
              ,{" "}
              <code className="rounded bg-slate-800 px-1 py-0.5 text-xs">
                PAYPAL_CLIENT_SECRET
              </code>
              , and{" "}
              <code className="rounded bg-slate-800 px-1 py-0.5 text-xs">
                PAYPAL_PLAN_ID
              </code>{" "}
              (or{" "}
              <code className="rounded bg-slate-800 px-1 py-0.5 text-xs">
                NEXT_PUBLIC_PAYPAL_PLAN_ID
              </code>
              ) to your environment. Create a $100/year billing plan in the PayPal
              dashboard and paste its Plan ID.
            </p>
          )}

          {user && configured && (
            <div className="space-y-4">
              <p className="text-center text-sm text-slate-400">
                Logged in as{" "}
                <span className="font-medium text-slate-200">{user.email}</span>
              </p>
              <PayPalSubscribeButtons
                clientId={clientId}
                planId={planId}
                userId={user.id}
                csrfToken={csrfToken}
              />
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-slate-500">
        After subscribing you will be returned to Business Profile. Yearly billing
        renews automatically unless you cancel in PayPal.
      </p>
    </section>
  );
}
