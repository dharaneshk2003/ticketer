"use server";

import { auth } from "@clerk/nextjs/server";
import { api } from "../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { stripe } from "../src/lib/stripe";



if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function createStripeConnectCustomer() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  // Check if user already has a connect account
  const existingStripeConnectId = await convex.query(
    api.users.getUsersStripeConnectId,
    {
      userId,
    }
  );

  if (existingStripeConnectId) {
    return { account: existingStripeConnectId };
  }

  // Create new connect account
  const account = await stripe.accounts.create({
    type: "express",
    capabilities: {
      card_payments: { requested: true }, // Card payments (required for most payment flows)
      transfers: { requested: true }, // Transfers for payouts
    },
    country: "IN", // Ensure the account is created for India
  });
  
  

  // Update user with stripe connect id
  await convex.mutation(api.users.updateOrCreateUserStripeConnectId, {
    userId,
    stripeConnectId: account.id,
  });

  return { account: account.id };
}