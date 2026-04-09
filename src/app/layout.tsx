import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import Link from "next/link";
import { getCsrfTokenFromCookie, getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReviewFlow AI",
  description: "Review funnel SaaS for local businesses",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const csrfToken = user ? getCsrfTokenFromCookie() : "";

  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-950 text-slate-100">
        <div className="min-h-screen">
          <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400" />
                <div>
                  <p className="text-sm font-medium text-slate-300">ReviewFlow AI</p>
                  <p className="text-xs text-slate-500">Micro-SaaS Starter</p>
                </div>
              </Link>

              <nav className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 p-1 text-sm">
                <Link
                  href="/dashboard"
                  className="rounded-lg px-3 py-1.5 text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/business-profile"
                  className="rounded-lg px-3 py-1.5 text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Business Profile
                </Link>
                <Link
                  href="/subscribe"
                  className="rounded-lg px-3 py-1.5 text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Subscribe
                </Link>
                {user ? (
                  <LogoutButton csrfToken={csrfToken} />
                ) : (
                  <Link
                    href="/auth"
                    className="rounded-lg px-3 py-1.5 text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl px-6 py-8">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
