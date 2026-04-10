import Link from "next/link";
import { CONCERN_OPTIONS } from "@/lib/concern-tags";

const CONCERN_LABEL = Object.fromEntries(
  CONCERN_OPTIONS.map((o) => [o.id, o.label]),
);

type RecentRow = {
  id: string;
  businessName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  concernTags: string[];
};

type DashboardAnalyticsProps = {
  rangeLabel: string;
  /** Private feedback text/themes are only loaded and shown for Pro. */
  isPro: boolean;
  surveyOpens: number;
  ratedSessions: number;
  googleHandoffs: number;
  privateIssues: number;
  promoterPicks: number;
  detractorPicks: number;
  starDistribution: { rating: number; count: number }[];
  topConcerns: { tag: string; count: number }[];
  recentFeedback: RecentRow[];
};

function pct(part: number, whole: number) {
  if (whole <= 0) return 0;
  return Math.round((part / whole) * 100);
}

function truncate(s: string, max: number) {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function PrivateFeedbackProUpsell() {
  return (
    <div className="mt-6 rounded-xl border border-dashed border-indigo-300/80 bg-indigo-50/60 p-5 text-center dark:border-indigo-500/40 dark:bg-indigo-950/30">
      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
        Buy Pro to see negative reviews from private forms
      </p>
      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
        Upgrade to read full comments, themes, and details from 1–3★ submissions.
      </p>
      <Link
        href="/subscribe"
        className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
      >
        View Pro plans
      </Link>
    </div>
  );
}

export function DashboardAnalytics({
  rangeLabel,
  isPro,
  surveyOpens,
  ratedSessions,
  googleHandoffs,
  privateIssues,
  promoterPicks,
  detractorPicks,
  starDistribution,
  topConcerns,
  recentFeedback,
}: DashboardAnalyticsProps) {
  const maxStar = Math.max(1, ...starDistribution.map((s) => s.count));
  const funnelRated = pct(ratedSessions, surveyOpens);
  const funnelGoogle =
    promoterPicks > 0 ? pct(googleHandoffs, promoterPicks) : 0;
  const funnelPrivate =
    detractorPicks > 0 ? pct(privateIssues, detractorPicks) : 0;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Funnel &amp; intent
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{rangeLabel}</p>
        </div>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          See how guests move from opening your survey to Google reviews or private
          follow-up—so you know the experience is working.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Opens → rated
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">
              {funnelRated}%
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              {ratedSessions} of {surveyOpens} guests chose a star rating
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-emerald-50/50 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
              Happy path → Google
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-emerald-900 dark:text-emerald-100">
              {promoterPicks > 0 ? `${funnelGoogle}%` : "—"}
            </p>
            <p className="mt-1 text-xs text-emerald-900/80 dark:text-emerald-300/90">
              {googleHandoffs} handoffs
              {promoterPicks > 0
                ? ` · ${promoterPicks} guests rated 4–5★`
                : ""}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-amber-50/50 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-900 dark:text-amber-300">
              Issues captured
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-amber-950 dark:text-amber-100">
              {detractorPicks > 0 ? `${funnelPrivate}%` : "—"}
            </p>
            <p className="mt-1 text-xs text-amber-900/85 dark:text-amber-300/90">
              {privateIssues} private notes
              {detractorPicks > 0
                ? ` · ${detractorPicks} guests rated 1–3★`
                : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Star distribution
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            From guests who tapped a rating on your survey.
          </p>
          <div className="mt-4 space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const row = starDistribution.find((s) => s.rating === star);
              const count = row?.count ?? 0;
              const w = pct(count, maxStar);
              return (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-8 tabular-nums text-slate-600 dark:text-slate-400">
                    {star}★
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all dark:bg-indigo-400"
                      style={{ width: `${w}%` }}
                    />
                  </div>
                  <span className="w-8 text-right tabular-nums text-slate-700 dark:text-slate-300">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Private feedback themes
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Tags guests picked when something missed the mark.
          </p>
          {!isPro ? (
            <PrivateFeedbackProUpsell />
          ) : topConcerns.length === 0 ? (
            <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
              No tagged private feedback in this period yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {topConcerns.map(({ tag, count }) => (
                <li
                  key={tag}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="text-slate-700 dark:text-slate-200">
                    {CONCERN_LABEL[tag] ?? tag}
                  </span>
                  <span className="tabular-nums text-slate-500 dark:text-slate-400">
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Recent private feedback
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Newest submissions across all locations ({rangeLabel}).
        </p>
        {!isPro ? (
          <PrivateFeedbackProUpsell />
        ) : recentFeedback.length === 0 ? (
          <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
            No private feedback in this window. When guests rate 1–3★, their notes
            show up here.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {recentFeedback.map((row) => (
              <li key={row.id} className="py-4 first:pt-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {row.businessName}
                  </p>
                  <time
                    className="text-xs text-slate-500 dark:text-slate-400"
                    dateTime={row.createdAt.toISOString()}
                  >
                    {row.createdAt.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-200">
                  {row.rating}★ private
                </p>
                {row.concernTags.length > 0 && (
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                    {row.concernTags
                      .map((t) => CONCERN_LABEL[t] ?? t)
                      .join(" · ")}
                  </p>
                )}
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {truncate(row.comment, 220)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
