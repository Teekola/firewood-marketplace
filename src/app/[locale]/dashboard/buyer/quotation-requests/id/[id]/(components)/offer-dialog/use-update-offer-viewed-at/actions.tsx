"use server";

import { updateOfferViewedAt } from "@/app/db/offer";

export async function updateBuyerViewedAt(offerIds: string[]) {
   await updateOfferViewedAt({ offerIds, type: "buyerLastSeenAt" });
}
