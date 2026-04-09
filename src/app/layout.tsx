import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter, Roboto_Mono } from "next/font/google";
import { getCsrfTokenFromCookie, getCurrentUser } from "@/lib/auth";
import { ConsentScripts } from "@/components/consent-scripts";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

// GA4: equivalent to gtag.js; optional override via NEXT_PUBLIC_GA_MEASUREMENT_ID.
const gaMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-32W9Q29NQL";

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
      suppressHydrationWarning
    >
      <body className="min-h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <ConsentScripts />
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader
              user={user ? { email: user.email } : null}
              csrfToken={csrfToken}
            />

            <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
              {children}
            </main>
            <SiteFooter />
          </div>
        </ThemeProvider>
        <GoogleAnalytics gaId={gaMeasurementId} />
      </body>
    </html>
  );
}
