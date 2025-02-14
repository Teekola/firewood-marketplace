"use server";

import { getPendingQuotationRequestsBySellerId } from "@/app/db/quotation-request";
import { authWithSeller } from "@/auth/auth";

// TODO: need to implement pagination
export async function getPendingQuotationRequestsForSeller() {
   const session = await authWithSeller();
   if (!session || !session.seller) {
      return [];
   }
   return await getPendingQuotationRequestsBySellerId({ sellerId: session.seller.id });
}
