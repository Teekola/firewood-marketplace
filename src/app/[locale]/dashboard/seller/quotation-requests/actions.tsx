"use server";

import { getQuotationRequestsBySellerId } from "@/app/db/quotation-request";
import { authWithSeller } from "@/auth/auth";

// TODO: need to implement pagination
export async function getQuotationRequestsForSeller() {
   const session = await authWithSeller();
   if (!session || !session.seller) {
      return [];
   }
   return await getQuotationRequestsBySellerId({ sellerId: session.seller.id });
}
