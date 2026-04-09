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
      className={`rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white ${className}`}
    >
      Logout
    </button>
  );
}
