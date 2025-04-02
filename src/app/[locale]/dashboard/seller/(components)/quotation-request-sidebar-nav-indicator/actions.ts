"use server";

import { getAuthorizedSeller } from "@/auth/auth";
import { getNumberOfUnseenQuotationRequests } from "@/db/quotation-request";

export async function getUnseenQuotationRequestsCount() {
   const { seller } = await getAuthorizedSeller();
   return await getNumberOfUnseenQuotationRequests({ sellerId: seller.id });
}
