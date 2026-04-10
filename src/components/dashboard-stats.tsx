"use client";

import { motion } from "framer-motion";
import { MessageSquareWarning, ScanLine, Star } from "lucide-react";

type DashboardStatsProps = {
  surveyOpens: number;
  googleHandoffs: number;
  privateFeedbacks: number;
  ratedSessions: number;
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, duration: 0.3 },
  }),
};

function hintSurveyOpens(rated: number, opens: number) {
  if (opens === 0) {
    return "Share your QR where guests finish their visit.";
  }
  const p = Math.round((rated / opens) * 100);
  return `${p}% of survey opens turn into a star rating`;
}

function hintGoogle(google: number, rated: number) {
  if (google === 0) {
    return "Handoffs appear when happy guests tap through to Google.";
  }
  if (rated === 0) return "Share your survey link to grow this number.";
  const p = Math.round((google / rated) * 100);
  return `${p}% of ratings led to a Google handoff`;
}

function hintPrivate(count: number) {
  if (count === 0) {
    return "Low-star guests can vent here—not on your public profile.";
  }
  return "Issues you can resolve before they become bad reviews.";
}

export function DashboardStats({
  surveyOpens,
  googleHandoffs,
  privateFeedbacks,
  ratedSessions,
}: DashboardStatsProps) {
  const cards = [
    {
      label: "Survey opens",
      value: surveyOpens.toLocaleString(),
      icon: ScanLine,
      hint: hintSurveyOpens(ratedSessions, surveyOpens),
    },
    {
      label: "Google handoffs",
      value: googleHandoffs.toLocaleString(),
      icon: Star,
      hint: hintGoogle(googleHandoffs, ratedSessions),
    },
    {
      label: "Private issues captured",
      value: privateFeedbacks.toLocaleString(),
      icon: MessageSquareWarning,
      hint: hintPrivate(privateFeedbacks),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card, index) => (
        <motion.article
          key={card.label}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/60 dark:shadow-black/20"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">{card.label}</p>
            <card.icon className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-300" />
          </div>
          <p className="mt-4 break-all text-2xl font-semibold tabular-nums text-slate-900 sm:break-normal sm:text-3xl dark:text-white">
            {card.value}
          </p>
          <p className="mt-2 text-xs leading-snug text-slate-500 dark:text-slate-400">
            {card.hint}
          </p>
        </motion.article>
      ))}
    </div>
  );
}
