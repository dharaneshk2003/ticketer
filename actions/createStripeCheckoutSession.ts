"use server";

import { stripe } from "../src/lib/stripe";
import { getConvexClient } from "../src/lib/convex";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import baseUrl from "../src/lib/baseUrl";
import { auth } from "@clerk/nextjs/server";
import { DURATIONS } from "../convex/constants";
import { getUserTicketForEvent } from '../convex/tickets';

export type StripeCheckoutMetaData = {
  eventId: Id<"events">;
  userId: string;
  waitingListId: Id<"waitingList">;
};

// export async function createStripeCheckoutSession({
//   eventId,
// }: {
//   eventId: Id<"events">;
// }) {
//   const { userId } = await auth();
//   if (!userId) throw new Error("Not authenticated");

//   const convex = getConvexClient();

//   // Get event details
//   const event = await convex.query(api.events.getById, { eventId });
//   if (!event) throw new Error("Event not found");

//   // Get waiting list entry
//   const queuePosition = await convex.query(api.waitingList.getQueuePosition, {
//     eventId,
//     userId,
//   });

//   if (!queuePosition || queuePosition.status !== "offered") {
//     throw new Error("No valid ticket offer found");
//   }

//   const stripeConnectId = await convex.query(
//     api.users.getUsersStripeConnectId,
//     {
//       userId: event.userId,
//     }
//   );

//   if (!stripeConnectId) {
//     throw new Error("Stripe Connect ID not found for owner of the event!");
//   }

//   if (!queuePosition.offerExpiresAt) {
//     throw new Error("Ticket offer has no expiration date");
//   }

//   const metadata: StripeCheckoutMetaData = {
//     eventId,
//     userId,
//     waitingListId: queuePosition._id,
//   };

//   // Create Stripe Checkout Session
//   const session = await stripe.checkout.sessions.create(
//     {
//       payment_method_types: ["upi"],
//       line_items: [
//         {
//           price_data: {
//             currency: "gbp",
//             product_data: {
//               name: event.name,
//               description: event.description,
//             },
//             unit_amount: Math.round(event.price * 100),
//           },
//           quantity: 1,
//         },
//       ],
//       payment_intent_data: {
//         application_fee_amount: Math.round(event.price * 100 * 0.01), //1% fee
//       },
//       expires_at: Math.floor(Date.now() / 1000) + DURATIONS.TICKET_OFFER / 1000, // 30 minutes (stripe checkout minimum expiration time)
//       mode: "payment",
//       success_url: `${baseUrl}/tickets/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${baseUrl}/event/${eventId}`,
//       metadata,
//     },
//     {
//       stripeAccount: stripeConnectId, //stripe Connect Id for ticket seller
//     }
//   );

//   return { sessionId: session.id, sessionUrl: session.url };
// }


export async function createCheckoutSession({
  eventId,
}: {
  eventId: Id<"events">;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const convex = getConvexClient();

  // Get event details
  const event = await convex.query(api.events.getById, { eventId });
  if (!event) throw new Error("Event not found");

  // Get waiting list entry
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

  const metadata = {
    eventId,
    userId,
    waitingListId: queuePosition._id,
  };

  // Create Checkout Session
  const ticketId = queuePosition._id; // Using waitingListId as ticketId
  const sessionUrl = `${baseUrl}/tickets/purchase-success`;

  // Add a ticket to the schema
  const purchasedAt = Date.now(); // Timestamp for purchase
  const ticket = {
    eventId,
    purchasedAt,
    waitingListId: queuePosition._id,
    status: "valid",
    userId,
  };

  await convex.mutation(api.events.purchaseTicket, { 
    ticket: ticket 
  });

  return { eventId, sessionUrl, ticketId };
}
