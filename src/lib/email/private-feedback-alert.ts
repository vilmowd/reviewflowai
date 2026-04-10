import { Resend } from "resend";
import { CONCERN_OPTIONS } from "@/lib/concern-tags";

const CONCERN_LABEL = Object.fromEntries(
  CONCERN_OPTIONS.map((o) => [o.id, o.label]),
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type PrivateFeedbackEmailInput = {
  to: string;
  businessName: string;
  rating: number;
  comment: string;
  customerName: string | null;
  customerEmail: string | null;
  concernTags: string[];
  feedbackId: string;
};

/**
 * Sends owner notification via Resend. Requires RESEND_API_KEY.
 * Returns whether the provider accepted the send (not delivery guarantee).
 */
export async function sendPrivateFeedbackAlert(
  input: PrivateFeedbackEmailInput,
): Promise<{ sent: boolean; skippedReason?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { sent: false, skippedReason: "RESEND_API_KEY not configured" };
  }

  const from =
    process.env.EMAIL_FROM?.trim() ?? "ReviewFlow <onboarding@resend.dev>";

  const tagsLine =
    input.concernTags.length > 0
      ? input.concernTags
          .map((t) => CONCERN_LABEL[t] ?? t)
          .join(", ")
      : "None selected";

  const subject = `[ReviewFlow] Private feedback · ${input.businessName} (${input.rating}★)`;

  const text = [
    `New private feedback for ${input.businessName}`,
    "",
    `Rating: ${input.rating} / 3`,
    `Feedback ID: ${input.feedbackId}`,
    "",
    "Themes:",
    tagsLine,
    "",
    "Comment:",
    input.comment,
    "",
    input.customerName ? `Name: ${input.customerName}` : "Name: (not provided)",
    input.customerEmail
      ? `Email: ${input.customerEmail}`
      : "Email: (not provided)",
    "",
    "— ReviewFlow AI",
  ].join("\n");

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #0f172a;">
  <h2 style="margin: 0 0 12px;">New private feedback</h2>
  <p style="margin: 0 0 8px;"><strong>${escapeHtml(input.businessName)}</strong></p>
  <p style="margin: 0 0 16px;"><strong>Rating:</strong> ${input.rating} / 3</p>
  <p style="margin: 0 0 8px;"><strong>Themes:</strong> ${escapeHtml(tagsLine)}</p>
  <div style="margin: 16px 0; padding: 12px; background: #f1f5f9; border-radius: 8px;">
    <strong>Comment</strong>
    <p style="margin: 8px 0 0; white-space: pre-wrap;">${escapeHtml(input.comment)}</p>
  </div>
  <p style="margin: 8px 0;"><strong>From</strong><br/>
  ${input.customerName ? escapeHtml(input.customerName) : "(no name)"}<br/>
  ${input.customerEmail ? escapeHtml(input.customerEmail) : "(no email)"}</p>
  <p style="margin: 24px 0 0; font-size: 12px; color: #64748b;">ID: ${escapeHtml(input.feedbackId)}</p>
</body>
</html>`.trim();

  try {
    const resend = new Resend(apiKey);
    const replyTo =
      input.customerEmail && EMAIL_RE.test(input.customerEmail)
        ? input.customerEmail
        : undefined;

    const { data, error } = await resend.emails.send({
      from,
      to: [input.to],
      subject,
      text,
      html,
      ...(replyTo ? { replyTo: [replyTo] } : {}),
    });

    if (error) {
      const msg =
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof (error as { message: unknown }).message === "string"
          ? (error as { message: string }).message
          : "Resend rejected the send";
      console.error("[email] Resend error:", error);
      return { sent: false, skippedReason: msg };
    }

    if (!data?.id) {
      return { sent: false, skippedReason: "No message id from provider" };
    }

    return { sent: true };
  } catch (err) {
    console.error("[email] sendPrivateFeedbackAlert:", err);
    return {
      sent: false,
      skippedReason: err instanceof Error ? err.message : "send failed",
    };
  }
}
