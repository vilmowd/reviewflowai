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
    <section className="mx-auto max-w-5xl space-y-8 py-6 sm:py-10">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-10">
        <p className="text-sm font-medium text-indigo-300">
          Local Business Review Management
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          Grow 5-star reviews and resolve issues privately.
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-slate-300 sm:text-base">
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
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            Create Business Profile
          </Link>
          <Link
            href="/subscribe"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-600/60 bg-indigo-950/40 px-5 py-2.5 text-sm font-medium text-indigo-200 transition hover:bg-indigo-950/70"
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
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
          >
            <item.icon className="h-5 w-5 text-indigo-300" />
            <h2 className="mt-3 text-lg font-semibold text-slate-100">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
