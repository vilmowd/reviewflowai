import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, QrCode } from "lucide-react";

export const metadata: Metadata = {
  title: "Local Business Review Management | ReviewFlow AI",
  description:
    "ReviewFlow AI helps local businesses capture private feedback and convert happy customers into public reviews with QR-powered review funnels.",
  keywords: [
    "Local Business Review Management",
    "Google review QR code",
    "private customer feedback",
    "review funnel software",
  ],
  openGraph: {
    title: "Local Business Review Management | ReviewFlow AI",
    description:
      "Boost local business reputation with smart review routing and private feedback capture.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <section className="mx-auto max-w-5xl space-y-6 py-4 sm:space-y-8 sm:py-10">
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm shadow-slate-200/50 sm:rounded-3xl sm:p-10 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
          Local Business Review Management
        </p>
        <h1 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
          Grow 5-star reviews and resolve issues privately.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
          ReviewFlow AI gives every business a QR-powered feedback funnel:
          satisfied customers are directed to Google reviews, and unhappy customers
          are routed to a private form.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400"
          >
            Open Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard/business-profile"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Create Business Profile
          </Link>
          <Link
            href="/subscribe"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-300 bg-indigo-50 px-5 py-2.5 text-sm font-medium text-indigo-800 transition hover:bg-indigo-100 dark:border-indigo-600/60 dark:bg-indigo-950/40 dark:text-indigo-200 dark:hover:bg-indigo-950/70"
          >
            Pro — $100/year (PayPal)
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: QrCode,
            title: "Smart QR Routing",
            text: "Customers scan once and choose a fast Good/Bad experience path.",
          },
          {
            icon: BarChart3,
            title: "Reputation Growth",
            text: "Send happy customers to Google while capturing private issues.",
          },
          {
            icon: ArrowRight,
            title: "Actionable Feedback",
            text: "Collect owner-visible feedback before it becomes a public review.",
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none"
          >
            <item.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
            <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
