"use server";

import { getUnseenOffersCountByBuyerId } from "@/app/db/offer";
import { authWithBuyer } from "@/auth/auth";

export async function getUnseenOffersCount() {
   const session = await authWithBuyer();

   if (!session || !session.buyer) {
      throw new Error("Unauthorized.");
   }

   return await getUnseenOffersCountByBuyerId(session.buyer.id);
}
