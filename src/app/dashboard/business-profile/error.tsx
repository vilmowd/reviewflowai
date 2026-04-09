"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function BusinessProfileError({ error, reset }: ErrorProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-rose-700/50 bg-rose-950/20 p-6">
      <h1 className="text-xl font-semibold text-rose-200">
        Business profile failed to load
      </h1>
      <p className="text-sm text-rose-100/90">
        {error.message || "We could not load your business settings."}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-400"
      >
        Retry
      </button>
    </div>
  );
}
