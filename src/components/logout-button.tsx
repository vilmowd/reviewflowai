"use client";

type LogoutButtonProps = {
  csrfToken: string;
  className?: string;
};

export function LogoutButton({ csrfToken, className = "" }: LogoutButtonProps) {
  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "x-csrf-token": csrfToken },
    });
    window.location.href = "/auth";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-200 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white ${className}`}
    >
      Logout
    </button>
  );
}
