"use server";

import { SellerQuotationRequestStatus } from "@prisma/client";

import { updateSellerQuotationRequestStatus } from "@/db/quotation-request";

export async function restoreQuotationRequestAction(sellerQuotationRequestId: string) {
   return await updateSellerQuotationRequestStatus({
      sellerQuotationRequestId,
      status: SellerQuotationRequestStatus.PENDING,
   });
}
