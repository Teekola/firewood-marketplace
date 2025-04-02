"use client";

import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/db/quotation-request";

import { DeliveryDetails } from "./delivery-details";
import { FirewoodDetails } from "./firewood-details";

export function ShortQuotationRequestDetails({
   quotationRequest,
}: Readonly<{ quotationRequest: QuotationRequest }>) {
   const t = useTranslations();

   return (
      <section className="flex flex-col gap-2 text-left">
         <section className="text-sm">
            <h5 className="font-semibold">{t("request-offers.Firewood")}</h5>
            <FirewoodDetails quotationRequest={quotationRequest} />
         </section>
         <section className="text-sm">
            <h5 className="font-semibold">{t("request-offers.Delivery")}</h5>
            <DeliveryDetails
               quotationRequest={quotationRequest}
               deliveryMethods={quotationRequest.deliveryMethods}
            />
         </section>
         {quotationRequest.additionalInformation && (
            <section className="text-sm">
               <h5 className="font-semibold">{t("quotation-request.Additional information")}</h5>
               <p>{quotationRequest.additionalInformation}</p>
            </section>
         )}
      </section>
   );
}
