"use client";

import { ComponentPropsWithoutRef, ElementType } from "react";

import { WoodDryness } from "@prisma/client";
import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";

import { useQuotationRequestData } from "../../../../components/quotation-request/use-quotation-request-data";

type QuotationRequestTitleProps<T extends ElementType> = {
   quotationRequest: QuotationRequest;
   as?: T;
} & ComponentPropsWithoutRef<T>;

const defaultElement: ElementType = "p";

export function QuotationRequestTitle<T extends ElementType>({
   quotationRequest,
   as,
   ...props
}: Readonly<QuotationRequestTitleProps<T>>) {
   const Component: ElementType = as ?? defaultElement;
   const t = useTranslations();
   const { amount, amountUnit, maxLength, lengthUnit } = useQuotationRequestData(quotationRequest);
   return (
      <Component {...props}>
         {amount} {amountUnit}
         <sup className="text-[0.75em] leading-[1.25em]">{"3"}</sup>{" "}
         {quotationRequest.woodDryness === WoodDryness.ANY
            ? t("request-offers.dry or green")
            : t(`request-offers.${quotationRequest.woodDryness.toLowerCase()}`)}{" "}
         {t(`request-offers.${quotationRequest.woodType.toLowerCase()}`)}
         {maxLength && `, ${maxLength} ${lengthUnit}`}
      </Component>
   );
}
