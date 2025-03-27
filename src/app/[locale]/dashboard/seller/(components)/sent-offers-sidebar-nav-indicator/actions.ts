"use server";

import { getSentOffersNotificationCountBySellerId } from "@/app/db/offer";
import { getAuthorizedSeller } from "@/auth/auth";

export async function getSentOffersNotificationCount() {
   const { seller } = await getAuthorizedSeller();
   return await getSentOffersNotificationCountBySellerId(seller.id);
}
