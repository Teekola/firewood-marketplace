"use server";

import { deleteQuotationRequestById } from "@/app/db/quotation-request";

export async function deleteQuotationRequest(quotationRequestId: string) {
   await deleteQuotationRequestById(quotationRequestId);
}
