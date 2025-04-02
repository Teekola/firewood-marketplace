"use server";

import { updateOfferViewedAt } from "@/app/db/offer";

export async function updateSellerLastSeenOffers(offerIds: string[]) {
   console.log("Viewed", offerIds);
   await updateOfferViewedAt({ type: "sellerLastSeenAt", offerIds });
}
