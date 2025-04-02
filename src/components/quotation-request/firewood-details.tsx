"use client";

import { WoodDryness, WoodType } from "@prisma/client";
import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/db/quotation-request";
import { replaceLastInstance } from "@/lib/utils/strings";

import { useQuotationRequestData } from "./use-quotation-request-data";

export function FirewoodDetails({
   quotationRequest: qr,
}: Readonly<{
   quotationRequest: QuotationRequest;
}>) {
   const { amount, amountUnit, lengthUnit, maxLength } = useQuotationRequestData(qr);

   return (
      <FirewoodParagraph
         woodTypes={qr.woodTypes}
         woodDrynesses={qr.woodDryness}
         amount={amount}
         amountUnit={amountUnit}
         lengthUnit={lengthUnit}
         maxLength={maxLength}
      />
   );
}

export function FirewoodParagraph({
   woodTypes,
   woodDrynesses,
   amount,
   amountUnit,
   maxLength,
   lengthUnit,
}: {
   woodTypes: WoodType[];
   woodDrynesses: WoodDryness[];
   amount: number | string;
   amountUnit: string;
   lengthUnit: string;
   maxLength?: string | number | null;
}) {
   const t = useTranslations();
   const woodTypesString = replaceLastInstance(
      woodTypes.map((woodType) => t(`wood-types.${woodType}`)).join(", "),
      ", ",
      ` ${t("conjunctions.or")} `
   ).toLowerCase();
   const woodDrynessString = woodDrynesses
      .map((dryness) => t(`wood-drynesses.${dryness}`))
      .join(` ${t("conjunctions.or")} `)
      .toLowerCase();

   return (
      <p>
         <span className="relative pr-3">
            {amount} {amountUnit}
            <span className="-translate-y-1/5 absolute text-xs">{"3"}</span>
         </span>{" "}
         {woodDrynessString} {woodTypesString}
         {maxLength && `, ${t("request-offers.Max length")} ${maxLength} ${lengthUnit}`}
      </p>
   );
}
