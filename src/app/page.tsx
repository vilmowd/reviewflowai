import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "ReviewFlow AI — Turn happy customers into Google reviews",
  description:
    "QR-powered review funnel for local businesses: route promoters to Google and capture private feedback before it becomes a bad review. Funnel analytics included.",
  keywords: [
    "Google review QR code",
    "local business reviews",
    "private customer feedback",
    "review funnel software",
    "reputation management",
  ],
  openGraph: {
    title: "ReviewFlow AI — Review routing for local businesses",
    description:
      "One QR code. Delighted guests leave Google reviews; frustrated guests share feedback with you first.",
    type: "website",
  },
};

export default function HomePage() {
  return <LandingPage />;
}
