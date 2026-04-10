import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal-page-layout";

export const metadata: Metadata = {
  title: "Privacy Policy | ReviewFlow AI",
  description: "How ReviewFlow AI collects, uses, and protects personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <section className="space-y-3">
        <h2>1. Who we are</h2>
        <p>
          ReviewFlow AI (“we”, “us”) provides an online service for businesses to manage
          feedback and review-related workflows. The operator’s contact details are listed
          in our{" "}
          <a href="/legal" className="text-indigo-600 underline hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
            Legal Notice
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2>2. Information we collect</h2>
        <p>Depending on how you use the Service, we may process:</p>
        <ul>
          <li>
            <strong className="text-slate-300">Account data:</strong> email address, name,
            password hash, and preferences associated with your account.
          </li>
          <li>
            <strong className="text-slate-300">Business content:</strong> business names,
            links, notification addresses, and content you configure in the product.
          </li>
          <li>
            <strong className="text-slate-300">Feedback data:</strong> information
            submitted by your customers through your flows (for example names, emails,
            ratings, and comments).
          </li>
          <li>
            <strong className="text-slate-300">Technical data:</strong> IP address, browser
            type, cookies or similar identifiers, and logs used for security and
            operations.
          </li>
          <li>
            <strong className="text-slate-300">Payment data:</strong> payments are handled
            by third-party processors (such as PayPal). We typically receive
            limited billing metadata, not full card numbers.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2>3. How we use information</h2>
        <p>We use personal information to:</p>
        <ul>
          <li>Provide, secure, and improve the Service.</li>
          <li>Authenticate users and prevent fraud or abuse.</li>
          <li>Deliver subscription features and process payments through partners.</li>
          <li>Send service-related messages (for example alerts you enable).</li>
          <li>Comply with legal obligations and enforce our terms.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2>4. Legal bases (EEA/UK)</h2>
        <p>
          Where GDPR applies, we rely on appropriate bases such as contract performance,
          legitimate interests (security, analytics at an appropriate level), and consent
          where required (for example certain cookies or marketing, if offered).
        </p>
      </section>

      <section className="space-y-3">
        <h2>5. Sharing and subprocessors</h2>
        <p>
          We use infrastructure and service providers (for example hosting, database, and
          payment processors). They process data on our instructions and under agreements
          that require protection of personal information. We may disclose information if
          required by law or to protect rights and safety.
        </p>
      </section>

      <section className="space-y-3">
        <h2>6. International transfers</h2>
        <p>
          If data is transferred across borders, we use appropriate safeguards (such as
          standard contractual clauses) where required by applicable law.
        </p>
      </section>

      <section className="space-y-3">
        <h2>7. Retention</h2>
        <p>
          We retain information as long as needed to provide the Service and for
          legitimate business and legal purposes (for example billing records and
          security logs). Retention periods may vary by data category.
        </p>
      </section>

      <section className="space-y-3">
        <h2>8. Your rights</h2>
        <p>
          Depending on your location, you may have rights to access, correct, delete, or
          restrict processing of your personal information, and to object to certain
          processing or port data. To exercise rights, contact us using the details in the{" "}
          <a href="/legal" className="text-indigo-600 underline hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
            Legal Notice
          </a>
          . You may also lodge a complaint with a supervisory authority.
        </p>
      </section>

      <section className="space-y-3">
        <h2>9. Cookies and similar technologies</h2>
        <p>
          We use cookies and similar technologies for session management, security, and
          preferences. You can control cookies through your browser settings; disabling
          some cookies may affect functionality.
        </p>
      </section>

      <section className="space-y-3">
        <h2>10. Children</h2>
        <p>
          The Service is not directed at children under 16 (or the age required in your
          region). We do not knowingly collect personal information from children.
        </p>
      </section>

      <section className="space-y-3">
        <h2>11. Changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will post the updated
          version on this page and revise the “Last updated” date.
        </p>
      </section>

      <section className="space-y-3">
        <h2>12. Contact</h2>
        <p>
          For privacy inquiries, contact us using the details in the{" "}
          <a href="/legal" className="text-indigo-600 underline hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
            Legal Notice
          </a>
          .
        </p>
      </section>
    </LegalPageLayout>
  );
}
