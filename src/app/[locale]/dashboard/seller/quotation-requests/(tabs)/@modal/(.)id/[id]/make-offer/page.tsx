import { getSellerQuotationRequest } from "@/db/quotation-request";
import { authWithSeller } from "@/lib/auth/auth";

import MakeOfferDialog from "../../../../make-offer-dialog";

export default async function QuotationRequestPage({
   params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
   const [sellerQuotationRequest, auth] = await Promise.all([
      params.then(({ id }) => getSellerQuotationRequest({ id })),
      authWithSeller(),
   ]);

   if (!auth) return null;

   if (!auth.seller?.location) {
      // TODO: Display instructions to go fill in the country code before being able to do this
      // TODO: Might need to build a centralized approach and also take into account the paywall that will be added
      return null;
   }

   return (
      <MakeOfferDialog
         isOpen={true}
         sellerQuotationRequest={sellerQuotationRequest}
         sellerLocation={auth.seller.location}
      />
   );
}
