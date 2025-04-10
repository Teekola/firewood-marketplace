"use server";

import { getSentOffersRejectedNotificationCountBySellerId } from "@/db/offer";
import { getAuthorizedSeller } from "@/lib/auth/auth";

export async function getActiveOffersNotificationCount() {
   const { seller } = await getAuthorizedSeller();
   return await getSentOffersRejectedNotificationCountBySellerId(seller.id);
}
