"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  MessageSquareText,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { CONCERN_OPTIONS } from "@/lib/concern-tags";

type SurveyFlowProps = {
  businessId: string;
  businessName: string;
  category?: string | null;
  googleReviewLink: string;
};

type Step = "rate" | "promoter" | "detractor" | "detractor_done";

const cardShell =
  "relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-lg shadow-slate-200/40 dark:border-slate-700/80 dark:bg-slate-900/85 dark:shadow-black/40 sm:p-8";

const STAR_LABELS = ["Poor", "Fair", "Okay", "Great", "Loved it"];

export function SurveyFlow({
  businessId,
  businessName,
  category,
  googleReviewLink,
}: SurveyFlowProps) {
  const sessionId = useMemo(
    () =>
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `rf_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    [],
  );

  const [step, setStep] = useState<Step>("rate");
  const [hoverStar, setHoverStar] = useState(0);
  const [rating, setRating] = useState(0);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const viewLogged = useRef(false);

  const track = useCallback(
    async (
      eventType:
        | "SURVEY_VIEW"
        | "STARS_SELECTED"
        | "GOOGLE_REDIRECT_CLICK"
        | "PRIVATE_FLOW_STARTED",
      stars?: number,
    ) => {
      try {
        await fetch("/api/funnel/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessId,
            sessionId,
            eventType,
            ...(eventType === "STARS_SELECTED" && stars != null
              ? { rating: stars }
              : {}),
          }),
        });
      } catch {
        /* non-blocking */
      }
    },
    [businessId, sessionId],
  );

  useEffect(() => {
    if (viewLogged.current) return;
    viewLogged.current = true;
    void track("SURVEY_VIEW");
  }, [track]);

  const toggleConcern = (id: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleContinueFromStars = async () => {
    if (rating < 1) return;
    await track("STARS_SELECTED", rating);
    if (rating >= 4) {
      setStep("promoter");
    } else {
      await track("PRIVATE_FLOW_STARTED");
      setStep("detractor");
    }
  };

  const handleGoogleRedirect = async () => {
    await track("GOOGLE_REDIRECT_CLICK");
    window.location.href = googleReviewLink;
  };

  async function handleSubmit(formData: FormData) {
    const comment = String(formData.get("comment") ?? "").trim();
    const customerName = String(formData.get("customerName") ?? "").trim();
    const customerEmail = String(formData.get("customerEmail") ?? "").trim();

    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          rating,
          comment,
          customerName,
          customerEmail,
          concernTags: selectedConcerns,
          sessionId,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error ?? "Feedback submission failed");
      }

      setStep("detractor_done");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to submit feedback.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const categoryLine = category?.trim()
    ? `${category.trim()} · `
    : "";

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-6 -inset-y-4 rounded-[2rem] bg-gradient-to-b from-indigo-100/50 via-white/0 to-emerald-100/30 blur-2xl dark:from-indigo-950/40 dark:via-transparent dark:to-emerald-950/20 sm:-inset-x-10"
      />

      <div className="relative mx-auto w-full min-w-0 max-w-xl">
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            Private feedback stays with the owner
          </span>
        </div>

        <AnimatePresence mode="wait">
          {step === "rate" && (
            <motion.section
              key="rate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className={cardShell}
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10" />
              <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">
                Quick check-in
              </p>
              <h1 className="mt-3 text-balance text-center text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                How was your visit?
              </h1>
              <p className="mt-2 text-center text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {businessName}
                </span>
                <span className="text-slate-400 dark:text-slate-500"> · </span>
                {categoryLine}
                Your honest input helps the team celebrate wins and fix issues
                before they become public reviews.
              </p>

              <div className="mt-8 flex flex-col items-center">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Tap a star to rate your experience
                </p>
                <div
                  className="mt-4 flex gap-2 sm:gap-3"
                  onMouseLeave={() => setHoverStar(0)}
                >
                  {[1, 2, 3, 4, 5].map((n) => {
                    const active = (hoverStar || rating) >= n;
                    return (
                      <button
                        key={n}
                        type="button"
                        onMouseEnter={() => setHoverStar(n)}
                        onClick={() => setRating(n)}
                        className="rounded-xl p-1 transition hover:scale-105 active:scale-95"
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={`h-10 w-10 sm:h-12 sm:w-12 ${
                            active
                              ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                              : "fill-slate-200 text-slate-300 dark:fill-slate-700 dark:text-slate-600"
                          }`}
                          strokeWidth={active ? 0 : 1.2}
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 min-h-[1.25rem] text-sm font-medium text-indigo-600 dark:text-indigo-300">
                  {(hoverStar || rating) > 0
                    ? STAR_LABELS[(hoverStar || rating) - 1]
                    : "\u00a0"}
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
                <button
                  type="button"
                  disabled={rating < 1}
                  onClick={() => void handleContinueFromStars()}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40 dark:shadow-indigo-900/40"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
                <p className="text-center text-xs text-slate-500 dark:text-slate-500">
                  4–5 stars: we&apos;ll guide you to Google. 1–3: share details
                  privately with the owner.
                </p>
              </div>
            </motion.section>
          )}

          {step === "promoter" && (
            <motion.section
              key="promoter"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -12 }}
              className={cardShell}
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/60">
                  <Sparkles className="h-7 w-7 text-emerald-600 dark:text-emerald-300" />
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-slate-900 dark:text-white">
                  That&apos;s wonderful to hear
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Public reviews help {businessName} reach more people in your
                  community. It only takes a minute—and it makes a real
                  difference for a local business.
                </p>
                <ul className="mt-6 w-full max-w-sm space-y-3 text-left text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex gap-3 rounded-xl bg-emerald-50/80 px-3 py-2 dark:bg-emerald-950/30">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    Your voice boosts visibility in local search.
                  </li>
                  <li className="flex gap-3 rounded-xl bg-emerald-50/80 px-3 py-2 dark:bg-emerald-950/30">
                    <HeartHandshake className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    Specific praise helps staff know what to keep doing.
                  </li>
                </ul>
                <button
                  type="button"
                  onClick={() => void handleGoogleRedirect()}
                  className="mt-8 inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-500 dark:shadow-emerald-900/30"
                >
                  Leave a Google review
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("rate");
                    setRating(0);
                    setHoverStar(0);
                  }}
                  className="mt-4 text-sm text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline dark:hover:text-slate-200"
                >
                  Go back
                </button>
              </div>
            </motion.section>
          )}

          {step === "detractor" && (
            <motion.form
              key="detractor"
              action={handleSubmit}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className={`space-y-5 ${cardShell}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/50">
                  <MessageSquareText className="h-5 w-5 text-amber-700 dark:text-amber-300" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    We&apos;re sorry it wasn&apos;t great
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    This stays <strong className="font-medium text-slate-800 dark:text-slate-200">private</strong>—not posted online. The owner
                    can follow up and improve before the next guest arrives.
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  What should we look at? (optional)
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CONCERN_OPTIONS.map((opt) => {
                    const on = selectedConcerns.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleConcern(opt.id)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                          on
                            ? "border-indigo-500 bg-indigo-50 text-indigo-800 dark:border-indigo-400 dark:bg-indigo-950/50 dark:text-indigo-100"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  What happened?
                </label>
                <textarea
                  name="comment"
                  required
                  minLength={3}
                  rows={5}
                  placeholder="The more detail you share, the faster the team can act…"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none ring-indigo-500/0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:text-sm"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  name="customerName"
                  type="text"
                  placeholder="Your name (optional)"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:text-sm"
                />
                <input
                  name="customerEmail"
                  type="email"
                  placeholder="Email for follow-up (optional)"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:text-sm"
                />
              </div>
              {error && (
                <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>
              )}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setStep("rate");
                    setRating(0);
                    setHoverStar(0);
                    setSelectedConcerns([]);
                  }}
                  className="text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? "Sending…" : "Send private feedback"}
                </button>
              </div>
            </motion.form>
          )}

          {step === "detractor_done" && (
            <motion.section
              key="done"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className={`${cardShell} text-center`}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-950/50">
                <CheckCircle2 className="h-7 w-7 text-indigo-600 dark:text-indigo-300" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-slate-900 dark:text-white">
                Thank you for the candid feedback
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                It&apos;s been sent securely to {businessName}. When owners hear
                about issues early, they can make things right—without airing
                frustrations in public reviews.
              </p>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
