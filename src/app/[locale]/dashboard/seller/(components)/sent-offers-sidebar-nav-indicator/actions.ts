"use server";

import { getSentOffersNotificationCountBySellerId } from "@/db/offer";
import { getAuthorizedSeller } from "@/lib/auth/auth";

export async function getSentOffersNotificationCount() {
   const { seller } = await getAuthorizedSeller();
   return await getSentOffersNotificationCountBySellerId(seller.id);
}
