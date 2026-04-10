import { FunnelEventType } from "@prisma/client";
import Link from "next/link";
import { DashboardAnalytics } from "@/components/dashboard-analytics";
import { DashboardStats } from "@/components/dashboard-stats";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function rangeToSince(range: string): Date | undefined {
  const now = Date.now();
  if (range === "7d") return new Date(now - 7 * 24 * 60 * 60 * 1000);
  if (range === "30d") return new Date(now - 30 * 24 * 60 * 60 * 1000);
  return undefined;
}

function rangeLabel(range: string): string {
  if (range === "7d") return "Last 7 days";
  if (range === "30d") return "Last 30 days";
  return "All time";
}

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const user = await requireUser();
  const raw =
    typeof searchParams.range === "string" ? searchParams.range : "30d";
  const range = raw === "7d" || raw === "all" ? raw : "30d";
  const since = range === "all" ? undefined : rangeToSince(range);
  const dateWhere = since ? { gte: since } : undefined;

  const businesses = await prisma.business.findMany({
    where: { ownerId: user.id },
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" },
  });

  const businessIds = businesses.map((b) => b.id);
  const isPro = user.plan === "PRO";

  let surveyOpens = 0;
  let ratedSessions = 0;
  let googleHandoffs = 0;
  let privateIssues = 0;
  let promoterPicks = 0;
  let detractorPicks = 0;
  const starDistribution: { rating: number; count: number }[] = [];
  let topConcerns: { tag: string; count: number }[] = [];
  let recentFeedback: {
    id: string;
    businessName: string;
    rating: number;
    comment: string;
    createdAt: Date;
    concernTags: string[];
  }[] = [];

  if (businessIds.length > 0) {
    const privateFeedbackWhere = {
      businessId: { in: businessIds },
      rating: { lte: 3 },
      ...(dateWhere && { createdAt: dateWhere }),
    } as const;

    const [sv, ss, gc, pi, starGroups, feedbackRows, recent] = await Promise.all([
      prisma.funnelEvent.count({
        where: {
          businessId: { in: businessIds },
          eventType: FunnelEventType.SURVEY_VIEW,
          ...(dateWhere && { createdAt: dateWhere }),
        },
      }),
      prisma.funnelEvent.count({
        where: {
          businessId: { in: businessIds },
          eventType: FunnelEventType.STARS_SELECTED,
          ...(dateWhere && { createdAt: dateWhere }),
        },
      }),
      prisma.funnelEvent.count({
        where: {
          businessId: { in: businessIds },
          eventType: FunnelEventType.GOOGLE_REDIRECT_CLICK,
          ...(dateWhere && { createdAt: dateWhere }),
        },
      }),
      prisma.feedback.count({
        where: privateFeedbackWhere,
      }),
      prisma.funnelEvent.groupBy({
        by: ["rating"],
        where: {
          businessId: { in: businessIds },
          eventType: FunnelEventType.STARS_SELECTED,
          rating: { not: null },
          ...(dateWhere && { createdAt: dateWhere }),
        },
        _count: { _all: true },
      }),
      isPro
        ? prisma.feedback.findMany({
            where: privateFeedbackWhere,
            select: { concernTags: true },
          })
        : Promise.resolve([]),
      isPro
        ? prisma.feedback.findMany({
            where: privateFeedbackWhere,
            orderBy: { createdAt: "desc" },
            take: 8,
            include: { business: { select: { name: true } } },
          })
        : Promise.resolve([]),
    ]);

    surveyOpens = sv;
    ratedSessions = ss;
    googleHandoffs = gc;
    privateIssues = pi;

    for (const row of starGroups) {
      const r = row.rating;
      if (r == null) continue;
      if (r >= 4) promoterPicks += row._count._all;
      if (r <= 3) detractorPicks += row._count._all;
    }

    const starMap = new Map(
      starGroups.map((r) => [r.rating as number, r._count._all]),
    );
    starDistribution.push(
      ...[5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: starMap.get(rating) ?? 0,
      })),
    );

    if (isPro) {
      const tagCount: Record<string, number> = {};
      for (const f of feedbackRows) {
        for (const t of f.concernTags) {
          tagCount[t] = (tagCount[t] ?? 0) + 1;
        }
      }
      topConcerns = Object.entries(tagCount)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      recentFeedback = recent.map((r) => ({
        id: r.id,
        businessName: r.business.name,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        concernTags: r.concernTags,
      }));
    }
  }

  const rangeLinks = [
    { key: "7d", label: "7 days" },
    { key: "30d", label: "30 days" },
    { key: "all", label: "All time" },
  ] as const;

  return (
    <section className="space-y-5 sm:space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
              Dashboard
            </p>
            <h1 className="mt-2 text-balance text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              Performance overview
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Real funnel data from your QR and survey links—not estimates.
            </p>
          </div>
          <div
            className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50/90 p-1 dark:border-slate-700 dark:bg-slate-950/50"
            role="tablist"
            aria-label="Date range"
          >
            {rangeLinks.map(({ key, label }) => {
              const active = range === key;
              return (
                <Link
                  key={key}
                  href={key === "30d" ? "/dashboard" : `/dashboard?range=${key}`}
                  scroll={false}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <DashboardStats
        surveyOpens={surveyOpens}
        googleHandoffs={googleHandoffs}
        privateFeedbacks={privateIssues}
        ratedSessions={ratedSessions}
      />

      {businesses.length > 0 ? (
        <DashboardAnalytics
          rangeLabel={rangeLabel(range)}
          isPro={isPro}
          surveyOpens={surveyOpens}
          ratedSessions={ratedSessions}
          googleHandoffs={googleHandoffs}
          privateIssues={privateIssues}
          promoterPicks={promoterPicks}
          detractorPicks={detractorPicks}
          starDistribution={starDistribution}
          topConcerns={topConcerns}
          recentFeedback={recentFeedback}
        />
      ) : null}

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/50 sm:p-6">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          Quick links
        </h2>
        {businesses.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            You have no businesses yet. Create one to generate a QR code and start
            collecting feedback.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {businesses.slice(0, 5).map((business) => (
              <Link
                key={business.id}
                href={`/${business.id}`}
                className="block rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/60"
              >
                Live survey — {business.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
