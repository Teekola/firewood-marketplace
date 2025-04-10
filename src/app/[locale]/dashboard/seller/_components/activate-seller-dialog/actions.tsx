"use server";

import { addAllSuitableQuotationRequestsForSeller } from "@/db/quotation-request";
import { getAuthorizedSeller } from "@/lib/auth/auth";

export async function activateSeller() {
   const { seller } = await getAuthorizedSeller();
   const count = await addAllSuitableQuotationRequestsForSeller({ sellerId: seller.id });

   return count;
}
