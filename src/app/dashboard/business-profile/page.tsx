import { BusinessProfileClient } from "@/components/business-profile-client";
import { getCsrfTokenFromCookie, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function BusinessProfilePage() {
  const user = await requireUser();
  const csrfToken = getCsrfTokenFromCookie();
  const businesses = await prisma.business.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, googleReviewLink: true },
  });

  return (
    <BusinessProfileClient
      businesses={businesses}
      canCreateBusiness={user.plan === "PRO" || businesses.length < 1}
      isPro={user.plan === "PRO"}
      csrfToken={csrfToken}
    />
  );
}
