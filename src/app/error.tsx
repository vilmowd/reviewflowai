"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ error, reset }: ErrorProps) {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-700/50 dark:bg-rose-950/30">
        <h1 className="text-xl font-semibold text-rose-900 dark:text-rose-200">
          Something went wrong
        </h1>
        <p className="text-sm text-rose-800/90 dark:text-rose-100/90">
          {error.message || "An unexpected application error occurred."}
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-400"
        >
          Try again
        </button>
      </div>
    </section>
  );
}
