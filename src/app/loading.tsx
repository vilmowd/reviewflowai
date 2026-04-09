export default function RootLoading() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-4xl animate-pulse space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="h-5 w-40 rounded bg-slate-800" />
        <div className="h-8 w-3/4 rounded bg-slate-800" />
        <div className="h-4 w-full rounded bg-slate-800" />
        <div className="h-4 w-5/6 rounded bg-slate-800" />
      </div>
    </section>
  );
}
