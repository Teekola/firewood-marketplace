"use server";

import { getNumberOfUnseenQuotationRequests } from "@/app/db/quotation-request";
import { getAuthorizedSeller } from "@/auth/auth";

export async function getUnseenQuotationRequestsCount() {
   const { seller } = await getAuthorizedSeller();
   return await getNumberOfUnseenQuotationRequests({ sellerId: seller.id });
}
