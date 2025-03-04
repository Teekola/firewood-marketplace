import { notFound } from "next/navigation";

import { getQuotationRequest } from "@/app/db/quotation-request";

import QuotationRequestDialog from "../../(tabs)/quotation-request-dialog";

export default async function QuotationRequestPage({
   params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
   const { id } = await params;
   const quotationRequest = await getQuotationRequest({ id });

   if (!quotationRequest) return notFound();

   return <QuotationRequestDialog isOpen={true} quotationRequest={quotationRequest} />;
}
