export default function SurveyLoading() {
  return (
    <section className="py-3 sm:py-8">
      <div className="mx-auto max-w-xl animate-pulse space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-8">
        <div className="h-6 w-3/4 rounded bg-slate-800" />
        <div className="h-4 w-full rounded bg-slate-800" />
        <div className="h-20 rounded bg-slate-800" />
        <div className="h-20 rounded bg-slate-800" />
      </div>
    </section>
  );
}
