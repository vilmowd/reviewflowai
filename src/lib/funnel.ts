import type { FunnelEventType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function recordFunnelEvent(input: {
  businessId: string;
  sessionId: string;
  eventType: FunnelEventType;
  rating?: number | null;
  metadata?: Prisma.InputJsonValue;
}) {
  return prisma.funnelEvent.create({
    data: {
      businessId: input.businessId,
      sessionId: input.sessionId,
      eventType: input.eventType,
      rating: input.rating ?? null,
      metadata: input.metadata ?? undefined,
    },
  });
}
