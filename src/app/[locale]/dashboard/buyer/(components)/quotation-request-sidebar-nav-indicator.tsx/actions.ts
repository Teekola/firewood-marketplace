"use server";

import { authWithBuyer } from "@/auth/auth";
import { getUnseenOffersCountByBuyerId } from "@/db/offer";

export async function getUnseenOffersCount() {
   const session = await authWithBuyer();

   if (!session || !session.buyer) {
      throw new Error("Unauthorized.");
   }

   return await getUnseenOffersCountByBuyerId(session.buyer.id);
}
