"use client";

import { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

type PayPalSubscribeButtonsProps = {
  clientId: string;
  planId: string;
  userId: string;
  csrfToken: string;
};

export function PayPalSubscribeButtons({
  clientId,
  planId,
  userId,
  csrfToken,
}: PayPalSubscribeButtonsProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <PayPalScriptProvider
        options={{
          clientId,
          vault: true,
          intent: "subscription",
        }}
      >
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "subscribe",
          }}
          createSubscription={(_data, actions) => {
            return actions.subscription.create({
              plan_id: planId,
              custom_id: userId,
            });
          }}
          onApprove={async (data) => {
            setError(null);
            setMessage(null);
            const subscriptionID = data.subscriptionID;
            if (!subscriptionID) {
              setError("Missing subscription reference from PayPal.");
              return;
            }
            try {
              const response = await fetch("/api/paypal/complete", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-csrf-token": csrfToken,
                },
                body: JSON.stringify({ subscriptionId: subscriptionID }),
              });
              const result = (await response.json()) as { error?: string };
              if (!response.ok) {
                throw new Error(result.error ?? "Could not activate your plan.");
              }
              setMessage("You are subscribed. Redirecting to your dashboard...");
              window.location.href = "/dashboard/business-profile?billing=success";
            } catch (e) {
              setError(
                e instanceof Error ? e.message : "Something went wrong. Please try again.",
              );
            }
          }}
          onError={(err) => {
            console.error(err);
            setError("PayPal could not start the subscription. Please try again.");
          }}
        />
      </PayPalScriptProvider>
      {message && <p className="text-sm text-emerald-700 dark:text-emerald-300">{message}</p>}
      {error && <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}
    </div>
  );
}
