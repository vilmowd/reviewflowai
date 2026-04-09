import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} ReviewFlow AI. All rights reserved.
        </p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400">
          <Link href="/terms" className="transition hover:text-slate-200">
            Terms of Service
          </Link>
          <Link href="/legal" className="transition hover:text-slate-200">
            Legal Notice
          </Link>
          <Link href="/privacy" className="transition hover:text-slate-200">
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
