/**
 * Creates a PayPal catalog product + yearly billing plan via REST API, then activates it.
 * You still need Client ID + Secret from the Developer Dashboard — PayPal issues the Plan ID.
 *
 * Usage (from reviewflow-ai/):
 *   node scripts/create-paypal-plan.mjs
 *
 * Required env (e.g. in .env):
 *   PAYPAL_CLIENT_ID or NEXT_PUBLIC_PAYPAL_CLIENT_ID
 *   PAYPAL_CLIENT_SECRET
 * Optional:
 *   PAYPAL_API_BASE (default https://api-m.sandbox.paypal.com)
 *   PAYPAL_PLAN_PRICE (default 100)
 *   PAYPAL_PLAN_CURRENCY (default USD)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvFile() {
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split(/\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFile();

function getApiBase() {
  return process.env.PAYPAL_API_BASE ?? "https://api-m.sandbox.paypal.com";
}

async function getAccessToken() {
  const id = process.env.PAYPAL_CLIENT_ID ?? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error(
      "Set PAYPAL_CLIENT_ID (or NEXT_PUBLIC_PAYPAL_CLIENT_ID) and PAYPAL_CLIENT_SECRET",
    );
  }
  const auth = Buffer.from(`${id}:${secret}`).toString("base64");
  const base = getApiBase();
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    throw new Error(`Token failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function createProduct(token) {
  const base = getApiBase();
  const body = {
    name: "ReviewFlow AI Pro",
    description: "Review management — annual subscription",
    type: "SERVICE",
    category: "SOFTWARE",
  };
  const res = await fetch(`${base}/v1/catalogs/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Create product failed: ${res.status} ${text}`);
  }
  return JSON.parse(text);
}

async function createPlan(token, productId) {
  const base = getApiBase();
  const price = process.env.PAYPAL_PLAN_PRICE ?? "100.00";
  const currency = process.env.PAYPAL_PLAN_CURRENCY ?? "USD";
  const value =
    typeof price === "string" && price.includes(".")
      ? price
      : Number(price).toFixed(2);

  const body = {
    product_id: productId,
    name: "ReviewFlow AI Pro — Annual",
    description: `ReviewFlow AI Pro — ${currency} ${value}/year`,
    billing_cycles: [
      {
        frequency: {
          interval_unit: "YEAR",
          interval_count: 1,
        },
        tenure_type: "REGULAR",
        sequence: 1,
        total_cycles: 0,
        pricing_scheme: {
          fixed_price: {
            value,
            currency_code: currency,
          },
        },
      },
    ],
    payment_preferences: {
      auto_bill_outstanding: true,
      setup_fee_failure_action: "CONTINUE",
      payment_failure_threshold: 3,
    },
  };

  const res = await fetch(`${base}/v1/billing/plans`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Create plan failed: ${res.status} ${text}`);
  }
  return JSON.parse(text);
}

async function activatePlan(token, planId) {
  const base = getApiBase();
  const res = await fetch(`${base}/v1/billing/plans/${encodeURIComponent(planId)}/activate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok && res.status !== 204) {
    const text = await res.text();
    throw new Error(`Activate plan failed: ${res.status} ${text}`);
  }
}

async function main() {
  console.log("PayPal API base:", getApiBase());
  const token = await getAccessToken();
  console.log("Creating catalog product…");
  const product = await createProduct(token);
  const productId = product.id;
  console.log("  Product ID:", productId);

  console.log("Creating yearly billing plan…");
  const plan = await createPlan(token, productId);
  const planId = plan.id;
  console.log("  Plan ID (before activate):", planId, "status:", plan.status ?? "—");

  console.log("Activating plan…");
  await activatePlan(token, planId);

  console.log("");
  console.log("Done. Add this to your .env and Railway:");
  console.log("");
  console.log(`  PAYPAL_PLAN_ID=${planId}`);
  console.log(`  # or: NEXT_PUBLIC_PAYPAL_PLAN_ID=${planId}`);
  console.log("");
  console.log(
    "For production, repeat with live credentials and PAYPAL_API_BASE=https://api-m.paypal.com",
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
