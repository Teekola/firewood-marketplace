"use server";

import { getSentOffersAcceptedNotificationCountBySellerId } from "@/app/db/offer";
import { getAuthorizedSeller } from "@/auth/auth";

export async function getActiveOffersNotificationCount() {
   const { seller } = await getAuthorizedSeller();
   return await getSentOffersAcceptedNotificationCountBySellerId(seller.id);
}
