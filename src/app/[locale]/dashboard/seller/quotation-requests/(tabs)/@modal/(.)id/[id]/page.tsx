import { getQuotationRequest } from "@/db/quotation-request";

import QuotationRequestDialog from "../../../quotation-request-dialog";

export default async function QuotationRequestPage({
   params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
   const { id } = await params;
   const quotationRequest = await getQuotationRequest({ id });

   return <QuotationRequestDialog isOpen={true} quotationRequest={quotationRequest} />;
}
