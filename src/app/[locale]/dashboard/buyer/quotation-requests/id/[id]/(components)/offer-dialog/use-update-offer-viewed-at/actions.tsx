"use server";

import { updateOfferViewedAt } from "@/app/db/offer";

export async function updateBuyerViewedAt(offerId: string) {
   await updateOfferViewedAt({ offerId, type: "buyerLastSeenAt" });
}
