"use client";

import { FormEvent, useState } from "react";

type AuthFormProps = {
  redirectTo?: string;
};

export function AuthForm({ redirectTo = "/dashboard" }: AuthFormProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Authentication failed.");
      }
      window.location.href = redirectTo;
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
      <h1 className="text-balance text-xl font-semibold text-white sm:text-2xl">
        {mode === "login" ? "Sign in" : "Create account"}
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Secure session-based access for your dashboard.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {mode === "register" && (
          <input
            name="fullName"
            type="text"
            placeholder="Full name"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500 sm:text-sm"
          />
        )}
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500 sm:text-sm"
        />
        <input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Password"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500 sm:text-sm"
        />
        {error && <p className="text-sm text-rose-300">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="min-h-12 w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-60"
        >
          {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        className="mt-4 text-sm text-slate-400 hover:text-white"
      >
        {mode === "login"
          ? "Need an account? Register"
          : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
