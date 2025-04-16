import { getSellerQuotationRequest } from "@/db/quotation-request";

import QuotationRequestDialog from "../../../../_components/pending-quotation-request-list/quotation-request-dialog";

export default async function QuotationRequestPage({
   params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
   const { id } = await params;
   const sellerQuotationRequest = await getSellerQuotationRequest({ id });

   return <QuotationRequestDialog isOpen={true} sellerQuotationRequest={sellerQuotationRequest} />;
}
