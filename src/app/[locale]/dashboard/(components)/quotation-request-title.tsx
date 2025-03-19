"use client";

import { ComponentPropsWithoutRef, ElementType } from "react";

import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";
import { replaceLastInstance } from "@/lib/utils/strings";

import { useQuotationRequestData } from "../../../../components/quotation-request/use-quotation-request-data";

type QuotationRequestTitleBaseProps = {
   quotationRequest: QuotationRequest;
};

type QuotationRequestTitleProps<T extends ElementType> = QuotationRequestTitleBaseProps &
   ComponentPropsWithoutRef<T>;

const defaultElement: ElementType = "p";

export function QuotationRequestTitle<T extends ElementType = "p">({
   quotationRequest,
   as,
   ...props
}: QuotationRequestTitleProps<T> & { as?: T }) {
   const Component: ElementType = as ?? defaultElement;
   const t = useTranslations();
   const { amount, amountUnit, maxLength, lengthUnit } = useQuotationRequestData(quotationRequest);
   // mixed, birch or pine | birch or pine | pine
   const woodTypesString = replaceLastInstance(
      quotationRequest.woodTypes.map((woodType) => t(`wood-types.${woodType}`)).join(", "),
      ",",
      ` ${t("conjunctions.or")} `
   ).toLowerCase();
   const woodDrynessString = quotationRequest.woodDryness
      .map((dryness) => t(`wood-drynesses.${dryness}`))
      .join(` ${t("conjunctions.or")} `)
      .toLowerCase();

   return (
      <Component {...props}>
         {amount} {amountUnit}
         <sup className="text-[0.75em] leading-[1.25em]">{"3"}</sup> {woodDrynessString}{" "}
         {woodTypesString}
         {maxLength && `, ${maxLength} ${lengthUnit}`}
      </Component>
   );
}
