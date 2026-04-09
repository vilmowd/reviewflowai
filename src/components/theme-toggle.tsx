"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="h-9 w-[7.5rem] rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900"
        aria-hidden
      />
    );
  }

  const cycle = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const Icon =
    theme === "system" ? Monitor : resolvedTheme === "dark" ? Moon : Sun;
  const label =
    theme === "system"
      ? "System theme"
      : theme === "dark"
        ? "Dark theme"
        : "Light theme";

  return (
    <button
      type="button"
      onClick={cycle}
      title={`Theme: ${label} (click to change)`}
      aria-label={`Current theme: ${label}. Click to cycle light, dark, and system.`}
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="hidden min-[380px]:inline">{label}</span>
    </button>
  );
}
