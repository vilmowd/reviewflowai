import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal-page-layout";

export const metadata: Metadata = {
  title: "Terms of Service | ReviewFlow AI",
  description: "Terms of Service for ReviewFlow AI.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service">
      <section className="space-y-3">
        <h2>1. Agreement</h2>
        <p>
          By accessing or using ReviewFlow AI (“Service”), you agree to these Terms of
          Service. If you do not agree, do not use the Service. The Service is operated
          by the provider identified in our{" "}
          <a href="/legal" className="text-indigo-600 underline hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
            Legal Notice
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2>2. Description of the Service</h2>
        <p>
          ReviewFlow AI provides tools for local businesses to collect feedback, manage
          business profiles, and direct customers to public review channels. Features may
          change over time. We do not guarantee any specific level of reviews, rankings,
          or business outcomes.
        </p>
      </section>

      <section className="space-y-3">
        <h2>3. Accounts and eligibility</h2>
        <p>
          You must provide accurate registration information and keep your credentials
          confidential. You are responsible for activity under your account. You must
          be legally able to enter into contracts in your jurisdiction.
        </p>
      </section>

      <section className="space-y-3">
        <h2>4. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service unlawfully or to harass others.</li>
          <li>Attempt to gain unauthorized access to systems, data, or other accounts.</li>
          <li>Upload malware, scrape the Service in violation of our policies, or overload infrastructure.</li>
          <li>Misrepresent your identity or your business.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2>5. Subscriptions and payments</h2>
        <p>
          Paid plans may be offered through third-party processors (for example PayPal or
          Stripe). Fees, billing cycles, and renewal terms are shown at checkout. You
          authorize us and our payment partners to charge your chosen payment method.
          Cancellations and refunds are governed by the applicable payment provider’s
          rules and any terms presented at purchase.
        </p>
      </section>

      <section className="space-y-3">
        <h2>6. Intellectual property</h2>
        <p>
          The Service, including software, branding, and documentation, is protected by
          intellectual property laws. We grant you a limited, non-exclusive,
          non-transferable right to use the Service according to these Terms. You retain
          ownership of content you submit; you grant us a license to host and process it
          to operate the Service.
        </p>
      </section>

      <section className="space-y-3">
        <h2>7. Disclaimer</h2>
        <p>
          THE SERVICE IS PROVIDED “AS IS” WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS
          OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
          NON-INFRINGEMENT, TO THE MAXIMUM EXTENT PERMITTED BY LAW.
        </p>
      </section>

      <section className="space-y-3">
        <h2>8. Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE ARE NOT LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR LOSS OF PROFITS,
          DATA, OR GOODWILL. OUR TOTAL LIABILITY FOR CLAIMS ARISING FROM THE SERVICE IS
          LIMITED TO THE AMOUNT YOU PAID US FOR THE SERVICE IN THE TWELVE (12) MONTHS
          BEFORE THE CLAIM, OR ONE HUNDRED US DOLLARS (USD $100), WHICHEVER IS GREATER,
          EXCEPT WHERE PROHIBITED BY LAW.
        </p>
      </section>

      <section className="space-y-3">
        <h2>9. Termination</h2>
        <p>
          We may suspend or terminate access if you violate these Terms or if necessary
          for security or legal reasons. You may stop using the Service at any time.
          Provisions that by nature should survive will survive termination.
        </p>
      </section>

      <section className="space-y-3">
        <h2>10. Changes</h2>
        <p>
          We may update these Terms by posting a new version on this page. Continued use
          after changes constitutes acceptance of the updated Terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2>11. Contact</h2>
        <p>
          For questions about these Terms, contact us using the details in the{" "}
          <a href="/legal" className="text-indigo-600 underline hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
            Legal Notice
          </a>
          .
        </p>
      </section>
    </LegalPageLayout>
  );
}
