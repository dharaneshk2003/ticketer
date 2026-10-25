"use server";

import { getConvexClient } from "../src/lib/convex";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export async function refundEventTickets(eventId: Id<"events">) {
  const convex = getConvexClient();

  const event = await convex.query(api.events.getById, { eventId });
  if (!event) throw new Error("Event not found");

  const tickets = await convex.query(api.tickets.getValidTicketsForEvent, {
    eventId,
  });

  await Promise.all(
    tickets.map((ticket) =>
      convex.mutation(api.tickets.updateTicketStatus, {
        ticketId: ticket._id,
        status: "refunded",
      })
    )
  );

  return { success: true };
}
