import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout } from "@/components/legal-page-layout";

export const metadata: Metadata = {
  title: "Accessibility | ReviewFlow AI",
  description:
    "How ReviewFlow AI supports accessibility and how to get help if you encounter barriers.",
};

export default function AccessibilityPage() {
  return (
    <LegalPageLayout title="Accessibility">
      <section className="space-y-3">
        <h2>Our commitment</h2>
        <p>
          We want ReviewFlow AI to be usable by as many people as possible, including
          those who rely on assistive technology, keyboard navigation, or adjusted
          display settings. We improve the product over time and welcome feedback when
          something does not work for you.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Options on this site</h2>
        <p>
          In the site footer you can turn on{" "}
          <strong className="text-slate-900 dark:text-slate-200">Reduce motion</strong>{" "}
          to limit animations, and{" "}
          <strong className="text-slate-900 dark:text-slate-200">Larger text</strong> to
          increase the base text size. Your choices are saved in this browser only.
        </p>
        <p>
          Theme (light/dark) is available in the header so you can pick contrast that
          works for you.
        </p>
        <p>
          <Link
            href="/"
            className="font-medium text-indigo-600 underline hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Return to home
          </Link>{" "}
          — footer controls appear on every page.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Limitations</h2>
        <p>
          Third-party tools (for example analytics or payment providers) may have their
          own accessibility characteristics. If you use our customer-facing survey or
          review flows, content you add (such as business names or links) should be
          written clearly for your guests.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Need help?</h2>
        <p>
          If you cannot complete a task because of a barrier on our site or product,
          please contact us using the details in our{" "}
          <Link
            href="/legal"
            className="text-indigo-600 underline hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Legal notice
          </Link>
          . Describe the page and what you were trying to do, and we will try to assist
          or route a fix.
        </p>
      </section>
    </LegalPageLayout>
  );
}
