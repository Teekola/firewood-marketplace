"use server";

import { getAuthorizedSeller } from "@/auth/auth";
import { addAllSuitableQuotationRequestsForSeller } from "@/db/quotation-request";

export async function activateSeller() {
   const { seller } = await getAuthorizedSeller();
   const count = await addAllSuitableQuotationRequestsForSeller({ sellerId: seller.id });

   return count;
}
