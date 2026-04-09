import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal-page-layout";

export const metadata: Metadata = {
  title: "Legal Notice | ReviewFlow AI",
  description: "Legal notice and operator information for ReviewFlow AI.",
};

export default function LegalNoticePage() {
  return (
    <LegalPageLayout title="Legal Notice">
      <section className="space-y-3">
        <h2>Operator of this website</h2>
        <p>
          This website and the ReviewFlow AI service are operated by the business or
          individual responsible for the deployment (“Operator”). Replace the bracketed
          placeholders below with your legally required details (company name,
          address, registration numbers, and representative as applicable in your
          country).
        </p>
        <p className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-slate-300">
          <strong className="text-slate-200">Contact email:</strong>{" "}
          [vilmowddx@gmail.com]
        </p>
      </section>

      <section className="space-y-3">
        <h2>Responsible for content</h2>
        <p>
          Under applicable law, the Operator is responsible for its own content on these
          pages. The Operator is not obligated to monitor third-party information
          transmitted or stored unless required by law.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Links to third-party websites</h2>
        <p>
          The Service may contain links to third-party websites (including payment
          processors and review platforms). The Operator does not control those sites and
          is not responsible for their content or privacy practices. Use of third-party
          services is subject to their terms and policies.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Intellectual property</h2>
        <p>
          Text, graphics, logos, and software related to ReviewFlow AI are protected by
          copyright and other laws unless otherwise noted. Unauthorised reproduction or
          distribution is prohibited except as allowed by law or with prior written
          consent.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Disclaimer</h2>
        <p>
          Information on this site is provided for general purposes. While we aim to keep
          legal pages accurate, they do not constitute legal advice. For binding guidance,
          consult a qualified professional in your jurisdiction.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Dispute resolution</h2>
        <p>
          If you are a consumer, mandatory consumer protection laws in your country may
          apply. Nothing in this notice limits rights you have under those laws.
        </p>
      </section>
    </LegalPageLayout>
  );
}
