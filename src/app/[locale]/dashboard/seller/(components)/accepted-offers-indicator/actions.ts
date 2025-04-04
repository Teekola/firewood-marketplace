"use server";

import { getSentOffersAcceptedNotificationCountBySellerId } from "@/db/offer";
import { getAuthorizedSeller } from "@/lib/auth/auth";

export async function getActiveOffersNotificationCount() {
   const { seller } = await getAuthorizedSeller();
   return await getSentOffersAcceptedNotificationCountBySellerId(seller.id);
}
