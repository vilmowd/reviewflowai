-- ReviewFlow AI — optional fallback if you cannot run migrations (e.g. emergency SQL in a client).
-- Normal deploys run `prisma migrate deploy` (see package.json `start`) using prisma/migrations/.
-- Run this ONCE on an empty database. Do not add seed rows; the app creates users and data.

-- 1) Enums (must exist before tables)
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');
CREATE TYPE "FeedbackStatus" AS ENUM ('NEW', 'ACKNOWLEDGED', 'RESOLVED');

-- 2) User
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "fullName" TEXT,
  "passwordHash" TEXT NOT NULL,
  "plan" "Plan" NOT NULL DEFAULT 'FREE',
  "stripeCustomerId" TEXT,
  "stripeSubscriptionId" TEXT,
  "stripeSubscriptionStatus" TEXT,
  "paypalSubscriptionId" TEXT,
  "paypalSubscriptionStatus" TEXT,
  "emailAlertsEnabled" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- 3) Business
CREATE TABLE "Business" (
  "id" TEXT NOT NULL,
  "ownerId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "category" TEXT,
  "googleReviewLink" TEXT NOT NULL,
  "contactEmail" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug");
CREATE INDEX "Business_ownerId_idx" ON "Business"("ownerId");

ALTER TABLE "Business"
  ADD CONSTRAINT "Business_ownerId_fkey"
  FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 4) Feedback
CREATE TABLE "Feedback" (
  "id" TEXT NOT NULL,
  "businessId" TEXT NOT NULL,
  "customerName" TEXT,
  "customerEmail" TEXT,
  "rating" INTEGER NOT NULL,
  "comment" TEXT NOT NULL,
  "status" "FeedbackStatus" NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Feedback_businessId_createdAt_idx" ON "Feedback"("businessId", "createdAt");
CREATE INDEX "Feedback_rating_idx" ON "Feedback"("rating");

ALTER TABLE "Feedback"
  ADD CONSTRAINT "Feedback_businessId_fkey"
  FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
