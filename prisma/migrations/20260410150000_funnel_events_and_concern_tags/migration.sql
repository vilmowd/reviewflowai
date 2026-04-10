-- CreateEnum
CREATE TYPE "FunnelEventType" AS ENUM ('SURVEY_VIEW', 'STARS_SELECTED', 'GOOGLE_REDIRECT_CLICK', 'PRIVATE_FLOW_STARTED', 'PRIVATE_FEEDBACK_SUBMIT');

-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN "concernTags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "FunnelEvent" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "eventType" "FunnelEventType" NOT NULL,
    "rating" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FunnelEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FunnelEvent_businessId_createdAt_idx" ON "FunnelEvent"("businessId", "createdAt");

-- CreateIndex
CREATE INDEX "FunnelEvent_businessId_eventType_createdAt_idx" ON "FunnelEvent"("businessId", "eventType", "createdAt");

-- CreateIndex
CREATE INDEX "FunnelEvent_sessionId_idx" ON "FunnelEvent"("sessionId");

-- AddForeignKey
ALTER TABLE "FunnelEvent" ADD CONSTRAINT "FunnelEvent_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
