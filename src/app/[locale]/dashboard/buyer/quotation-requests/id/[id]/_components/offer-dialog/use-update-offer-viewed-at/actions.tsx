"use server";

import { updateOfferViewedAt } from "@/db/offer";

export async function updateBuyerViewedAt(offerIds: string[]) {
   await updateOfferViewedAt({ offerIds, type: "buyerLastSeenAt" });
}
