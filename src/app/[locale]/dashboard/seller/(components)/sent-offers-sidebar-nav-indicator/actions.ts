"use server";

import { getAuthorizedSeller } from "@/auth/auth";
import { getSentOffersNotificationCountBySellerId } from "@/db/offer";

export async function getSentOffersNotificationCount() {
   const { seller } = await getAuthorizedSeller();
   return await getSentOffersNotificationCountBySellerId(seller.id);
}
