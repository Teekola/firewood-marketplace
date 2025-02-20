"use client";

import { WoodDryness } from "@prisma/client";
import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";

import { useQuotationRequestData } from "./use-quotation-request-data";

export function QuotationRequestTitle({
   quotationRequest,
}: Readonly<{
   quotationRequest: QuotationRequest;
}>) {
   const t = useTranslations();

   const { amount, amountUnit, lengthUnit, maxLength } = useQuotationRequestData(quotationRequest);

   return (
      <>
         <span className="relative pr-3">
            {amount} {amountUnit}
            <span className="absolute -translate-y-1/4 text-xs">{"3"}</span>
         </span>
         {quotationRequest.woodDryness === WoodDryness.ANY
            ? t("request-offers.dry or green")
            : t(`request-offers.${quotationRequest.woodDryness.toLowerCase()}`)}{" "}
         {t(`request-offers.${quotationRequest.woodType.toLowerCase()}`)}
         {maxLength && `, ${maxLength} ${lengthUnit}`}
      </>
   );
}
