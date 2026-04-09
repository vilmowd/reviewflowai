"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SurveyError({ error, reset }: ErrorProps) {
  return (
    <section className="py-3 sm:py-8">
      <div className="mx-auto max-w-xl space-y-4 rounded-2xl border border-rose-700/50 bg-rose-950/20 p-5 sm:p-8">
        <h1 className="text-xl font-semibold text-rose-200">
          Survey unavailable right now
        </h1>
        <p className="text-sm text-rose-100/90">
          {error.message || "Please try again in a moment."}
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-400"
        >
          Retry
        </button>
      </div>
    </section>
  );
}
