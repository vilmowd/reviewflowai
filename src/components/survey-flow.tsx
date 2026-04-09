"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Frown, Smile, Send } from "lucide-react";

type SurveyFlowProps = {
  businessId: string;
  businessName: string;
  googleReviewLink: string;
};

const cardShell =
  "rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none sm:p-8";

export function SurveyFlow({
  businessId,
  businessName,
  googleReviewLink,
}: SurveyFlowProps) {
  const [step, setStep] = useState<"choice" | "feedback" | "done">("choice");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          rating: 2,
          comment,
          customerName,
          customerEmail,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error ?? "Feedback submission failed");
      }

      setStep("done");
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

  return (
    <div className="mx-auto w-full min-w-0 max-w-xl">
      <AnimatePresence mode="wait">
        {step === "choice" && (
          <motion.section
            key="choice"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            className={cardShell}
          >
            <h1 className="text-balance text-xl font-semibold text-slate-900 sm:text-2xl dark:text-white">
              How was your experience with{" "}
              <span className="break-words">{businessName}</span>?
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Your feedback helps improve service quality.
            </p>

            <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
              <button
                type="button"
                onClick={() => {
                  window.location.href = googleReviewLink;
                }}
                className="min-h-28 rounded-xl border border-emerald-300 bg-emerald-50/90 p-4 text-left transition hover:border-emerald-500 active:scale-[0.99] dark:border-emerald-700/60 dark:bg-emerald-950/40"
              >
                <Smile className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                <p className="mt-3 text-base font-medium text-emerald-900 dark:text-emerald-100">
                  Good
                </p>
                <p className="mt-1 text-sm text-emerald-800/90 dark:text-emerald-300/80">
                  Take me to Google Reviews
                </p>
              </button>

              <button
                type="button"
                onClick={() => setStep("feedback")}
                className="min-h-28 rounded-xl border border-amber-300 bg-amber-50/90 p-4 text-left transition hover:border-amber-500 active:scale-[0.99] dark:border-amber-700/60 dark:bg-amber-950/30"
              >
                <Frown className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                <p className="mt-3 text-base font-medium text-amber-900 dark:text-amber-100">
                  Bad
                </p>
                <p className="mt-1 text-sm text-amber-800/90 dark:text-amber-300/80">
                  Share private feedback
                </p>
              </button>
            </div>
          </motion.section>
        )}

        {step === "feedback" && (
          <motion.form
            key="feedback"
            action={handleSubmit}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            className={`space-y-4 ${cardShell}`}
          >
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Tell us what happened
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This feedback is private and sent directly to the owner.
            </p>
            <textarea
              name="comment"
              required
              minLength={3}
              rows={5}
              placeholder="What could we improve?"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:text-sm"
            />
            <input
              name="customerName"
              type="text"
              placeholder="Your name (optional)"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:text-sm"
            />
            <input
              name="customerEmail"
              type="email"
              placeholder="Your email (optional)"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:text-sm"
            />
            {error && <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setStep("choice")}
                className="text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <Send className="h-4 w-4" />
                {submitting ? "Submitting..." : "Send feedback"}
              </button>
            </div>
          </motion.form>
        )}

        {step === "done" && (
          <motion.section
            key="done"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            className={`${cardShell} text-center`}
          >
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Thanks for sharing.
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Your feedback has been recorded privately.
            </p>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
