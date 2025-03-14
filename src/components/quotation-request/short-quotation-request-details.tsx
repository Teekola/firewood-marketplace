"use client";

import { DeliveryMethod } from "@prisma/client";
import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";

import { FirewoodDetails } from "./firewood-details";

export function ShortQuotationRequestDetails({
   quotationRequest,
}: Readonly<{ quotationRequest: QuotationRequest }>) {
   const t = useTranslations();
   const isHomeDelivery = quotationRequest.deliveryMethod === DeliveryMethod.HOME_DELIVERY;
   return (
      <section className="flex flex-col gap-2 text-left">
         <section className="text-sm">
            <h5 className="font-semibold">{t("request-offers.Firewood")}</h5>
            <FirewoodDetails quotationRequest={quotationRequest} />
         </section>
         <section className="text-sm">
            <h5 className="font-semibold">{t("request-offers.Delivery")}</h5>
            <p className="capitalize">{t(`request-offers.${quotationRequest.deliveryMethod}`)}</p>
            {isHomeDelivery && (
               <>
                  <p>
                     {quotationRequest.address}
                     {", "} {quotationRequest.postalCode}{" "}
                     <span className="capitalize">{quotationRequest.city?.toLowerCase()}</span>
                     {", "}
                     {t(`countries.${quotationRequest.countryName}`)}
                  </p>
               </>
            )}
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
