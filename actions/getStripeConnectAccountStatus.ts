"use server";

export type AccountStatus = {
  isActive: boolean;
  requiresInformation: boolean;
  requirements: {
    currently_due: string[];
    eventually_due: string[];
    past_due: string[];
  };
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
};

export async function getStripeConnectAccountStatus(
  _stripeAccountId: string
): Promise<AccountStatus> {
  return {
    isActive: true,
    requiresInformation: false,
    requirements: { currently_due: [], eventually_due: [], past_due: [] },
    chargesEnabled: true,
    payoutsEnabled: true,
  };
}
