import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SurveyFlow } from "@/components/survey-flow";

type SurveyPageProps = {
  params: { business_id: string };
};

export async function generateMetadata({
  params,
}: SurveyPageProps): Promise<Metadata> {
  const business = await prisma.business.findUnique({
    where: { id: params.business_id },
    select: { name: true },
  });

  if (!business) {
    return {
      title: "ReviewFlow AI",
      description: "Private customer feedback and review redirection.",
    };
  }

  return {
    title: `${business.name} Reviews | ReviewFlow AI`,
    description: `Share your experience with ${business.name}. ReviewFlow AI powers local business review management and private customer feedback.`,
    keywords: [
      "Local Business Review Management",
      "Private Customer Feedback",
      `${business.name} reviews`,
    ],
    openGraph: {
      title: `${business.name} Reviews | ReviewFlow AI`,
      description:
        "A mobile-first feedback experience for local business review management.",
      type: "website",
    },
  };
}

export default async function SurveyPage({ params }: SurveyPageProps) {
  const business = await prisma.business.findUnique({
    where: { id: params.business_id },
    select: {
      id: true,
      name: true,
      category: true,
      googleReviewLink: true,
    },
  });

  if (!business) {
    notFound();
  }

  return (
    <section className="px-1 py-3 sm:px-4 sm:py-8">
      <SurveyFlow
        businessId={business.id}
        businessName={business.name}
        category={business.category}
        googleReviewLink={business.googleReviewLink}
      />
    </section>
  );
}
