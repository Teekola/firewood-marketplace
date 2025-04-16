"use server";

import { viewSellerQuotationRequests } from "@/db/quotation-request";

export async function viewSellerQuotationRequestsAction(sellerQuotationRequestIds: string[]) {
   await viewSellerQuotationRequests(sellerQuotationRequestIds);
}
