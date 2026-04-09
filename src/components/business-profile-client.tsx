"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import { CreditCard, Download, Plus, Store } from "lucide-react";

type Business = {
  id: string;
  name: string;
  googleReviewLink: string;
};

type BusinessProfileClientProps = {
  businesses: Business[];
  canCreateBusiness: boolean;
  isPro: boolean;
  csrfToken: string;
};

export function BusinessProfileClient({
  businesses,
  canCreateBusiness,
  isPro,
  csrfToken,
}: BusinessProfileClientProps) {
  const [items, setItems] = useState(businesses);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const businessLimitText = useMemo(() => {
    if (isPro) return "Pro plan: unlimited businesses and email alerts enabled.";
    return "Free plan: 1 business included. Upgrade to Pro for unlimited businesses and alerts.";
  }, [isPro]);

  async function handleCreateBusiness(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("businessName") ?? ""),
      googleReviewLink: String(formData.get("googleReviewLink") ?? ""),
      contactEmail: String(formData.get("contactEmail") ?? ""),
      category: String(formData.get("category") ?? ""),
    };

    try {
      const response = await fetch("/api/businesses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        if (result.requiresUpgrade) {
          setError("Free plan limit reached. Please upgrade to Pro.");
          return;
        }
        throw new Error(result.error ?? "Failed to create business.");
      }

      setItems((prev) => [result.business, ...prev]);
      setMessage("Business created. You can now share or download its QR code.");
      event.currentTarget.reset();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Unable to create business.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleUpgrade() {
    setCheckoutLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "x-csrf-token": csrfToken,
        },
      });
      const result = await response.json();
      if (!response.ok || !result.url) {
        throw new Error(result.error ?? "Unable to create checkout session.");
      }
      window.location.href = result.url;
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to start checkout.",
      );
      setCheckoutLoading(false);
    }
  }

  async function handleDownloadQr(businessId: string) {
    const origin = window.location.origin;
    const targetUrl = `${origin}/${businessId}`;
    const dataUrl = await QRCode.toDataURL(targetUrl, {
      margin: 1,
      width: 1024,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    });

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `reviewflow-${businessId}.png`;
    link.click();
  }

  return (
    <section className="space-y-5 sm:space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none sm:p-6">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">Settings</p>
        <h1 className="mt-2 text-balance text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
          Business Profile
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{businessLimitText}</p>
      </div>

      {!canCreateBusiness && !isPro && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-indigo-200 bg-indigo-50/80 p-4 dark:border-indigo-700/70 dark:bg-indigo-950/30 sm:p-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
                Upgrade to Pro
              </p>
              <p className="mt-1 text-sm text-indigo-800/90 dark:text-indigo-300/80">
                Unlock unlimited businesses and private feedback email alerts. Pay with
                Stripe ($29/mo) or{" "}
                <a
                  href="/subscribe"
                  className="font-medium text-indigo-700 underline decoration-indigo-400/50 underline-offset-2 hover:text-indigo-900 dark:text-indigo-200 dark:hover:text-white"
                >
                  PayPal ($100/year)
                </a>
                .
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
              <button
                onClick={handleUpgrade}
                disabled={checkoutLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:opacity-60"
              >
                <CreditCard className="h-4 w-4" />
                {checkoutLoading ? "Redirecting..." : "Stripe — $29/mo"}
              </button>
              <a
                href="/subscribe"
                className="inline-flex items-center justify-center rounded-xl border border-indigo-300 px-4 py-2 text-sm font-medium text-indigo-800 transition hover:bg-indigo-100 dark:border-indigo-400/40 dark:text-indigo-100 dark:hover:bg-indigo-900/40"
              >
                PayPal — $100/yr
              </a>
            </div>
          </div>
        </motion.div>
      )}

      <form
        onSubmit={handleCreateBusiness}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Business Name
            </label>
            <input
              name="businessName"
              type="text"
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Category
            </label>
            <input
              name="category"
              type="text"
              placeholder="Dentist, Cafe, Plumber..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Google Review Link
          </label>
          <input
            name="googleReviewLink"
            type="url"
            required
            placeholder="https://g.page/r/your-business/review"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Notification Email
          </label>
          <input
            name="contactEmail"
            type="email"
            placeholder="owner@business.com"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:text-sm"
          />
        </div>

        {message && <p className="text-sm text-emerald-700 dark:text-emerald-300">{message}</p>}
        {error && <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}

        <button
          type="submit"
          disabled={saving || (!canCreateBusiness && !isPro)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {saving ? "Saving..." : "Create Business"}
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Your Businesses
        </h2>
        {items.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
            No businesses yet. Create one above to generate your first QR code.
          </p>
        )}
        <div className="grid gap-3">
          {items.map((business) => (
            <motion.article
              key={business.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <Store className="mt-0.5 h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {business.name}
                  </p>
                  <p className="break-all font-mono text-[11px] leading-snug text-slate-500 dark:text-slate-400 sm:text-xs">
                    /{business.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDownloadQr(business.id)}
                className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:self-center"
              >
                <Download className="h-4 w-4" />
                Download QR
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
