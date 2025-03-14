"use client";

import { WoodDryness } from "@prisma/client";
import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";

import { useQuotationRequestData } from "./use-quotation-request-data";

export function FirewoodDetails({
   quotationRequest: qr,
}: Readonly<{
   quotationRequest: QuotationRequest;
}>) {
   const t = useTranslations();
   const { amount, amountUnit, lengthUnit, maxLength } = useQuotationRequestData(qr);

   return (
      <>
         <p>
            <span className="relative pr-3">
               {amount} {amountUnit}
               <span className="-translate-y-1/5 absolute text-xs">{"3"}</span>
            </span>
            {qr.woodDryness === WoodDryness.ANY
               ? t("request-offers.dry or green")
               : t(`request-offers.${qr.woodDryness.toLowerCase()}`)}{" "}
            {t(`request-offers.${qr.woodType.toLowerCase()}`)}
            {maxLength && `, ${t("request-offers.Max length")} ${maxLength} ${lengthUnit}`}
         </p>
      </>
   );
}
