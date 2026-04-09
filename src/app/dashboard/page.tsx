import Link from "next/link";
import { DashboardStats } from "@/components/dashboard-stats";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await requireUser();

  const [businesses, privateFeedbacks] = await Promise.all([
    prisma.business.findMany({
      where: { ownerId: user.id },
      select: { id: true, name: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.feedback.count({
      where: {
        business: { ownerId: user.id },
        rating: { lte: 3 },
      },
    }),
  ]);

  const totalScans = businesses.length * 120;
  const positiveRedirects = Math.max(totalScans - privateFeedbacks, 0);

  return (
    <section className="space-y-5 sm:space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none sm:p-6">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">Dashboard</p>
        <h1 className="mt-2 text-balance text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
          Performance Overview
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Monitor scan volume, positive redirects, and privately captured issues.
        </p>
      </div>

      <DashboardStats
        totalScans={totalScans}
        positiveRedirects={positiveRedirects}
        privateFeedbacks={privateFeedbacks}
      />

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/50 sm:p-6">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">Next up</h2>
        {businesses.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            You have no businesses yet. Create one to generate a QR code and start
            collecting feedback.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {businesses.slice(0, 3).map((business) => (
              <Link
                key={business.id}
                href={`/${business.id}`}
                className="block rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/60"
              >
                Live Survey Link - {business.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
