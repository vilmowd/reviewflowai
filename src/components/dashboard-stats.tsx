"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, MessageSquareWarning, ScanLine, Star } from "lucide-react";

type DashboardStatsProps = {
  totalScans: number;
  positiveRedirects: number;
  privateFeedbacks: number;
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, duration: 0.3 },
  }),
};

export function DashboardStats({
  totalScans,
  positiveRedirects,
  privateFeedbacks,
}: DashboardStatsProps) {
  const cards = [
    {
      label: "Total Scans",
      value: totalScans.toLocaleString(),
      icon: ScanLine,
    },
    {
      label: "Positive Redirects",
      value: positiveRedirects.toLocaleString(),
      icon: Star,
    },
    {
      label: "Private Feedbacks",
      value: privateFeedbacks.toLocaleString(),
      icon: MessageSquareWarning,
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
          className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-900/60 p-5 shadow-sm shadow-black/20"
        >
          <div className="flex items-start justify-between">
            <p className="text-sm text-slate-400">{card.label}</p>
            <card.icon className="h-4 w-4 text-indigo-300" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">{card.value}</p>
          <p className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-300">
            <ArrowUpRight className="h-3.5 w-3.5" />
            Live preview metrics
          </p>
        </motion.article>
      ))}
    </div>
  );
}
