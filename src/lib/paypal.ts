type PayPalTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

type PayPalSubscription = {
  id: string;
  status: string;
  custom_id?: string;
};

function getApiBase() {
  return process.env.PAYPAL_API_BASE ?? "https://api-m.sandbox.paypal.com";
}

export function getPayPalClientId() {
  return process.env.PAYPAL_CLIENT_ID ?? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
}

export function getPayPalPlanId() {
  return process.env.PAYPAL_PLAN_ID ?? process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID;
}

async function getClientCredentials() {
  const id = process.env.PAYPAL_CLIENT_ID ?? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error("Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET");
  }
  return { id, secret };
}

export async function getPayPalAccessToken(): Promise<string> {
  const { id, secret } = await getClientCredentials();
  const auth = Buffer.from(`${id}:${secret}`).toString("base64");
  const base = getApiBase();
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PayPal token error: ${response.status} ${text}`);
  }

  const data = (await response.json()) as PayPalTokenResponse;
  return data.access_token;
}

export async function getPayPalSubscription(
  subscriptionId: string,
): Promise<PayPalSubscription> {
  const token = await getPayPalAccessToken();
  const base = getApiBase();
  const response = await fetch(
    `${base}/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PayPal subscription lookup failed: ${response.status} ${text}`);
  }

  return (await response.json()) as PayPalSubscription;
}
