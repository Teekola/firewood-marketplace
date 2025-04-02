"use server";

import { updateOfferViewedAt } from "@/db/offer";

export async function updateSellerLastSeenOffers(offerIds: string[]) {
   console.log("Viewed", offerIds);
   await updateOfferViewedAt({ type: "sellerLastSeenAt", offerIds });
}
