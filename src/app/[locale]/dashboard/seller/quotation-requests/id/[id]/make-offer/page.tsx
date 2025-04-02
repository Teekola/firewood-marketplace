import { authWithSeller } from "@/auth/auth";
import { getQuotationRequest } from "@/db/quotation-request";

import MakeOfferDialog from "../../../(tabs)/make-offer-dialog";

export default async function QuotationRequestPage({
   params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
   const { id } = await params;
   const quotationRequest = await getQuotationRequest({ id });
   const auth = await authWithSeller();

   if (!auth) return null;

   if (!auth.seller?.location) {
      // TODO: Display instructions to go fill in the country code before being able to do this
      // TODO: Might need to build a centralized approach and also take into account the paywall that will be added
      return null;
   }

   return (
      <MakeOfferDialog
         isOpen={true}
         quotationRequest={quotationRequest}
         sellerLocation={auth.seller.location}
      />
   );
}
