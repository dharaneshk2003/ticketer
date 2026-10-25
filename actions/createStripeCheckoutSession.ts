"use server";

import { getConvexClient } from "../src/lib/convex";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import baseUrl from "../src/lib/baseUrl";
import { auth } from "@clerk/nextjs/server";

export async function createCheckoutSession({
  eventId,
}: {
  eventId: Id<"events">;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const convex = getConvexClient();

  const event = await convex.query(api.events.getById, { eventId });
  if (!event) throw new Error("Event not found");

  const queuePosition = await convex.query(api.waitingList.getQueuePosition, {
    eventId,
    userId,
  });

  if (!queuePosition || queuePosition.status !== "offered") {
    throw new Error("No valid ticket offer found");
  }

  if (!queuePosition.offerExpiresAt) {
    throw new Error("Ticket offer has no expiration date");
  }

  await convex.mutation(api.events.purchaseTicket, {
    ticket: {
      eventId,
      userId,
      waitingListId: queuePosition._id,
      purchasedAt: Date.now(),
      status: "valid",
    },
  });

  return { eventId, sessionUrl: `${baseUrl}/tickets/purchase-success` };
}
