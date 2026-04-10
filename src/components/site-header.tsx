"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { LogoutButton } from "@/components/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";

type SiteHeaderProps = {
  user: { email: string } | null;
  csrfToken: string;
};

const navItems: { href: string; label: string }[] = [
  { href: "/#features", label: "Features" },
  { href: "/#how", label: "How it works" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/business-profile", label: "Business" },
  { href: "/subscribe", label: "Subscribe" },
];

const headerBar =
  "sticky top-0 z-40 border-b border-slate-200/90 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/90";

export function SiteHeader({ user, csrfToken }: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  return (
    <header className={headerBar}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-2.5 sm:gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <BrandMark variant="header" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-300">
              ReviewFlow AI
            </p>
            <p className="hidden text-xs text-slate-500 sm:block">Micro-SaaS Starter</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1 text-sm dark:border-slate-800 dark:bg-slate-900/70 md:flex"
            aria-label="Main"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-slate-700 transition hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <LogoutButton csrfToken={csrfToken} className="shrink-0" />
            ) : (
              <Link
                href="/auth"
                className="rounded-lg px-3 py-2 text-slate-700 transition hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="border-t border-slate-200 bg-white/98 px-4 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:border-slate-800 dark:bg-slate-950/98 dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)] md:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="min-h-12 rounded-xl px-3 py-3 text-base text-slate-800 transition hover:bg-slate-100 active:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:active:bg-slate-800"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <div className="mt-2 border-t border-slate-200 pt-3 dark:border-slate-800">
                <p className="mb-2 truncate px-3 text-xs text-slate-500">{user.email}</p>
                <LogoutButton
                  csrfToken={csrfToken}
                  className="flex min-h-12 w-full items-center justify-center py-2.5 text-base"
                />
              </div>
            ) : (
              <Link
                href="/auth"
                className="mt-1 min-h-12 rounded-xl px-3 py-3 text-base font-medium text-indigo-600 transition hover:bg-slate-100 dark:text-indigo-300 dark:hover:bg-slate-800/80"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
