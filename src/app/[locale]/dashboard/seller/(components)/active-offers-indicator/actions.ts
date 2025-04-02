"use server";

import { getAuthorizedSeller } from "@/auth/auth";
import { getSentOffersRejectedNotificationCountBySellerId } from "@/db/offer";

export async function getActiveOffersNotificationCount() {
   const { seller } = await getAuthorizedSeller();
   return await getSentOffersRejectedNotificationCountBySellerId(seller.id);
}
