"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  MessageSquare,
  QrCode,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

const easeOutExpo = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: easeOutExpo },
  }),
};

const slideIn = {
  hidden: { opacity: 0, x: -36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: easeOutExpo },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: easeOutExpo },
  },
};

const viewportOnce = { once: true as const, margin: "-60px" as const };

export function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.22),transparent),radial-gradient(ellipse_50%_40%_at_100%_0%,rgba(16,185,129,0.12),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.35),transparent),radial-gradient(ellipse_50%_40%_at_100%_0%,rgba(16,185,129,0.15),transparent)]"
        />
        <div className="mx-auto max-w-5xl px-1 py-10 sm:px-4 sm:py-16 lg:py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            className="text-center"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-950/50 dark:text-indigo-200"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Review routing for real-world businesses
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="mt-6 text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white"
            >
              Turn happy guests into{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent dark:from-indigo-300 dark:to-emerald-300">
                Google reviews
              </span>
              — quietly catch the rest.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300"
            >
              One QR code. A guided experience: delighted customers leave public
              reviews; frustrated ones share feedback with you first—so you fix
              issues before they hit your star rating.
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={3}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                href="/auth"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-500 sm:w-auto dark:shadow-indigo-900/40"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/subscribe"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-300 bg-white/80 px-8 py-3 text-sm font-semibold text-slate-800 backdrop-blur transition hover:bg-slate-50 sm:w-auto dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                View Pro pricing
              </Link>
            </motion.div>
            <motion.p
              variants={fadeUp}
              custom={4}
              className="mt-8 text-sm text-slate-500 dark:text-slate-400"
            >
              No credit card to explore the dashboard · Pro unlocks full analytics
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Social proof strip */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.45 }}
        className="border-y border-slate-200/80 bg-slate-100/50 py-8 dark:border-slate-800 dark:bg-slate-900/40"
      >
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 text-sm text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-500" />
            Built for salons, cafés, clinics &amp; shops
          </span>
          <span className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            Funnel analytics you can act on
          </span>
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-slate-500" />
            Private feedback stays with you
          </span>
        </div>
      </motion.section>

      {/* Why */}
      <section id="why" className="scroll-mt-24 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={slideIn}
            className="max-w-2xl"
          >
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">
              Why ReviewFlow AI
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Your reputation is won—or lost—at the moment of feedback.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
              Most unhappy customers never complain to you; they leave a public
              review. Happy customers often forget to review at all. ReviewFlow AI
              fixes both: it celebrates promoters and opens a private channel for
              everyone else.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center">
            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={slideIn}
              className="space-y-5"
            >
              {[
                "Capture sentiment in seconds with a branded, mobile-first survey.",
                "Route 4–5★ guests straight to Google with confidence-building copy.",
                "Collect 1–3★ feedback privately—tags and comments land in your inbox.",
                "See funnel metrics: opens, handoffs, themes—so you know it’s working.",
              ].map((text) => (
                <li key={text} className="flex gap-3 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </motion.ul>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={slideInRight}
              className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-100 p-8 shadow-xl dark:border-slate-700 dark:from-slate-900 dark:to-slate-950"
            >
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl dark:bg-indigo-400/20" />
              <div className="relative space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  Outcome you want
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  More authentic 5-star reviews where they matter, fewer surprise
                  bombs on your profile—and a steady stream of operational insight
                  from guests who would have walked away silent.
                </p>
                <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 text-xs text-slate-500 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-400">
                  “We replaced a paper comment card with ReviewFlow. Same QR on the
                  counter—triple the Google reviews in a month.”
                  <span className="mt-2 block font-medium text-slate-700 dark:text-slate-300">
                    — Typical owner outcome
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-24 bg-slate-100/60 py-16 dark:bg-slate-900/50 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">
              Product
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Everything you need to own the feedback moment
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
              Professional flows for customers, clarity for your team—without
              another complicated tool to train.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: QrCode,
                title: "QR & link",
                desc: "One asset at checkout, on tables, or in follow-up email—guests land on a polished survey in one tap.",
              },
              {
                icon: Star,
                title: "Smart routing",
                desc: "Stars drive the journey: promoters head to Google; detractors get a private, structured form.",
              },
              {
                icon: MessageSquare,
                title: "Themes & detail",
                desc: "Optional tags plus free text—know whether it was wait time, staff, or something else.",
              },
              {
                icon: BarChart3,
                title: "Funnel analytics",
                desc: "Opens, ratings, Google handoffs, and private captures—filter by date and prove ROI.",
              },
              {
                icon: Bell,
                title: "Pro alerts",
                desc: "On Pro, lean on email alerts for low-star submissions so nothing slips through.",
              },
              {
                icon: Shield,
                title: "Privacy-first",
                desc: "Sensitive feedback stays between you and the guest—not broadcast to the world.",
              },
            ].map((item, index) => (
              <motion.article
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={fadeUp}
                custom={index}
                className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80"
              >
                <item.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.desc}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-24 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Live in minutes, not weeks
            </h2>
          </motion.div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create your business",
                body: "Add your name, category, and Google review link. We generate your survey URL and printable QR.",
              },
              {
                step: "02",
                title: "Place the QR",
                body: "Front desk, receipt, table tent—wherever the experience ends. Guests scan and rate in seconds.",
              },
              {
                step: "03",
                title: "Watch the funnel",
                body: "Dashboard shows opens, star mix, Google handoffs, and private issues—so you can coach your team.",
              },
            ].map((block, i) => (
              <motion.div
                key={block.step}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900/70"
              >
                <span className="text-4xl font-bold tabular-nums text-indigo-200 dark:text-indigo-900">
                  {block.step}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                  {block.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {block.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.5 }}
        className="mx-4 mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 px-6 py-14 text-center shadow-xl sm:mx-auto sm:max-w-5xl sm:px-10 dark:from-indigo-700 dark:to-slate-900"
      >
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">
          Ready to steer reviews your way?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-indigo-100 sm:text-base">
          Join owners who treat feedback as a system—not an accident. Start in
          minutes with the same QR your guests already know how to use.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/auth"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-white px-8 py-3 text-sm font-semibold text-indigo-700 shadow-md transition hover:bg-indigo-50 sm:w-auto"
          >
            Create your account
          </Link>
          <Link
            href="/subscribe"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/30 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
          >
            Compare plans
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
