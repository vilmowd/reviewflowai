import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

function safeRedirectPath(path: string | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/dashboard";
  }
  return path;
}

export default async function AuthPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  const user = await getCurrentUser();
  if (user) {
    redirect(safeRedirectPath(searchParams.redirect));
  }

  return (
    <section className="mx-auto max-w-md py-10">
      <AuthForm redirectTo={safeRedirectPath(searchParams.redirect)} />
    </section>
  );
}
