"use server";

import { addAllSuitableQuotationRequestsForSeller } from "@/app/db/quotation-request";
import { getAuthorizedSeller } from "@/auth/auth";

export async function activateSeller() {
   const { seller } = await getAuthorizedSeller();
   const count = await addAllSuitableQuotationRequestsForSeller({ sellerId: seller.id });

   return count;
}
