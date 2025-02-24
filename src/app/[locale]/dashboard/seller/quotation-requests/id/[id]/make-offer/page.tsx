import { notFound } from "next/navigation";

import { DeliveryMethod } from "@prisma/client";
import { getTranslations } from "next-intl/server";

import { getQuotationRequest } from "@/app/db/quotation-request";
import { authWithSeller } from "@/auth/auth";

import { MakeOfferForm } from "../../../(components)/(make-offer-form)/make-offer-form";
import { ShortQuotationRequestDetails } from "../../../(components)/short-quotation-request-details";

export default async function MakeOfferPage({
   params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
   const { id } = await params;
   const quotationRequest = await getQuotationRequest({ id });
   const t = await getTranslations();
   const auth = await authWithSeller();

   if (!auth) return null;

   if (!quotationRequest) return notFound();

   if (!auth.seller?.location?.countryCode) {
      // TODO: Handle this case correctly
      return null;
   }

   return (
      <div className="w-full space-y-3">
         <h3 className="text-2xl font-bold">{t("quotation-request.Make an Offer")}</h3>
         <div className="flex flex-col justify-end lg:flex-row-reverse lg:gap-10">
            <div className="max-w-lg border-b pb-4 lg:mt-3 lg:gap-4 lg:border-b-0 lg:border-l lg:pl-4 lg:pr-4">
               <ShortQuotationRequestDetails quotationRequest={quotationRequest} />
            </div>

            <MakeOfferForm
               countryCode={auth.seller.location.countryCode}
               isHomeDelivery={quotationRequest.deliveryMethod === DeliveryMethod.HOME_DELIVERY}
            />
         </div>
      </div>
   );
}
