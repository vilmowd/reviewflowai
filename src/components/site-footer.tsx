import Link from "next/link";

const productLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/business-profile", label: "Business profile" },
  { href: "/subscribe", label: "Subscribe" },
];

const legalLinks = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/legal", label: "Legal notice" },
  { href: "/privacy", label: "Privacy policy" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-100/80 dark:border-slate-800/90 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  ReviewFlow AI
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-500">
                  Review funnels & feedback for local businesses
                </p>
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-500">
              Turn happy customers into public reviews and capture private feedback before
              it becomes a problem.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Product
            </p>
            <ul className="mt-4 space-y-2.5">
              {productLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Legal
            </p>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-200 pt-8 dark:border-slate-800/80 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-600">
            © {new Date().getFullYear()} ReviewFlow AI. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-600">
            <Link
              href="/auth"
              className="transition hover:text-slate-800 dark:hover:text-slate-400"
            >
              Sign in
            </Link>
            <span aria-hidden className="text-slate-300 dark:text-slate-700">
              ·
            </span>
            <Link
              href="/terms"
              className="transition hover:text-slate-800 dark:hover:text-slate-400"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="transition hover:text-slate-800 dark:hover:text-slate-400"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
