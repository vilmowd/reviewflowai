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
  searchParams: { redirect?: string; next?: string };
}) {
  const user = await getCurrentUser();
  const redirectTarget = safeRedirectPath(
    searchParams.redirect ?? searchParams.next,
  );
  if (user) {
    redirect(redirectTarget);
  }

  return (
    <section className="mx-auto max-w-md py-10">
      <AuthForm redirectTo={redirectTarget} />
    </section>
  );
}
