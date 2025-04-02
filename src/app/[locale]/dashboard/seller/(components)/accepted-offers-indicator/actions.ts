"use server";

import { getAuthorizedSeller } from "@/auth/auth";
import { getSentOffersAcceptedNotificationCountBySellerId } from "@/db/offer";

export async function getActiveOffersNotificationCount() {
   const { seller } = await getAuthorizedSeller();
   return await getSentOffersAcceptedNotificationCountBySellerId(seller.id);
}
