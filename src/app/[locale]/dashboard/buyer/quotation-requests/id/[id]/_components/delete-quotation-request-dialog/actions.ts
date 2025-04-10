"use server";

import { deleteQuotationRequestById } from "@/db/quotation-request";

export async function deleteQuotationRequest(quotationRequestId: string) {
   await deleteQuotationRequestById(quotationRequestId);
}
