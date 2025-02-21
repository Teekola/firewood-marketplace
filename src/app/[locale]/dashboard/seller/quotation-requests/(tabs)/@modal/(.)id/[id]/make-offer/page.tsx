import { getQuotationRequest } from "@/app/db/quotation-request";

import MakeOfferDialog from "../../../../make-offer-dialog";

export default async function QuotationRequestPage({
   params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
   const { id } = await params;
   const quotationRequest = await getQuotationRequest({ id });

   return <MakeOfferDialog isOpen={true} quotationRequest={quotationRequest} />;
}
