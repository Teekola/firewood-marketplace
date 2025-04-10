"use server";

import { getNumberOfUnseenQuotationRequests } from "@/db/quotation-request";
import { getAuthorizedSeller } from "@/lib/auth/auth";

export async function getUnseenQuotationRequestsCount() {
   const { seller } = await getAuthorizedSeller();
   return await getNumberOfUnseenQuotationRequests({ sellerId: seller.id });
}
