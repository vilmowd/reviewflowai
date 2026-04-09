export default function DashboardLoading() {
  return (
    <div className="space-y-4">
      <div className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70" />
        <div className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70" />
        <div className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70" />
      </div>
    </div>
  );
}
