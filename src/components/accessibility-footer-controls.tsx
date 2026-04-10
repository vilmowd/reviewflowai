"use client";

import { useCallback, useEffect, useState } from "react";

const KEY_REDUCE_MOTION = "reviewflow-a11y-reduce-motion";
const KEY_LARGE_TEXT = "reviewflow-a11y-large-text";
const CLASS_REDUCE_MOTION = "rf-reduce-motion";
const CLASS_LARGE_TEXT = "rf-large-text";

function readStored(key: string): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(key) === "1";
}

function applyClasses(reduceMotion: boolean, largeText: boolean) {
  const root = document.documentElement;
  root.classList.toggle(CLASS_REDUCE_MOTION, reduceMotion);
  root.classList.toggle(CLASS_LARGE_TEXT, largeText);
}

export function AccessibilityFooterControls() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const rm = readStored(KEY_REDUCE_MOTION);
    const lt = readStored(KEY_LARGE_TEXT);
    setReduceMotion(rm);
    setLargeText(lt);
    applyClasses(rm, lt);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyClasses(reduceMotion, largeText);
  }, [mounted, reduceMotion, largeText]);

  const toggleReduceMotion = useCallback(() => {
    setReduceMotion((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(KEY_REDUCE_MOTION, next ? "1" : "0");
      }
      return next;
    });
  }, []);

  const toggleLargeText = useCallback(() => {
    setLargeText((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(KEY_LARGE_TEXT, next ? "1" : "0");
      }
      return next;
    });
  }, []);

  if (!mounted) {
    return (
      <div className="mt-4 space-y-3" aria-hidden>
        <div className="h-[4.25rem] rounded-lg bg-slate-200/70 dark:bg-slate-800/80" />
        <div className="h-[4.25rem] rounded-lg bg-slate-200/70 dark:bg-slate-800/80" />
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white/60 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900/40">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
            Reduce motion
          </p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Limits animations across the site.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={reduceMotion}
          aria-label="Reduce motion"
          onClick={toggleReduceMotion}
          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
            reduceMotion ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-600"
          }`}
        >
          <span
            className={`pointer-events-none my-auto inline-block h-6 w-6 rounded-full bg-white shadow transition-transform ${
              reduceMotion ? "translate-x-[1.25rem]" : "translate-x-0.5"
            }`}
            aria-hidden
          />
        </button>
      </div>

      <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white/60 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900/40">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
            Larger text
          </p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Slightly increases base text size.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={largeText}
          aria-label="Larger text"
          onClick={toggleLargeText}
          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
            largeText ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-600"
          }`}
        >
          <span
            className={`pointer-events-none my-auto inline-block h-6 w-6 rounded-full bg-white shadow transition-transform ${
              largeText ? "translate-x-[1.25rem]" : "translate-x-0.5"
            }`}
            aria-hidden
          />
        </button>
      </div>
    </div>
  );
}
