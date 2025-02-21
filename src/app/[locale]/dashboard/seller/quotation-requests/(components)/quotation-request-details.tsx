"use client";

import { PropsWithChildren } from "react";

import { WoodDryness } from "@prisma/client";
import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";
import { Button } from "@/components/ui/button";

import { useQuotationRequestData } from "../(hooks)/use-quotation-request-data";

export default function QuotationRequestDetails({
   quotationRequest: qr,
}: Readonly<{ quotationRequest: QuotationRequest }>) {
   const t = useTranslations();

   const { updatedAt, amount, amountUnit, lengthUnit, maxLength } = useQuotationRequestData(qr);

   return (
      <div className="flex flex-col gap-3">
         <PreviewSection title={t("request-offers.Firewood")}>
            <p>
               <span className="relative pr-3">
                  {amount} {amountUnit}
                  <span className="-translate-y-1/5 absolute text-xs">{"3"}</span>
               </span>
               {qr.woodDryness === WoodDryness.ANY
                  ? t("request-offers.dry or green")
                  : t(`request-offers.${qr.woodDryness.toLowerCase()}`)}{" "}
               {t(`request-offers.${qr.woodType.toLowerCase()}`)}
            </p>
            <p>{maxLength && `${t("request-offers.Max length")}: ${maxLength} ${lengthUnit}`}</p>
         </PreviewSection>
         <PreviewSection title={t("request-offers.Delivery")}>
            <p className="capitalize">{t(`request-offers.${qr.deliveryMethod}`)}</p>
            {qr.address && <p>{qr.address}</p>}
            <p>
               {qr.postalCode} <span className="capitalize">{qr.city?.toLowerCase()}</span>
               {", "}
               {t(`countries.${qr.countryName}`)}
            </p>
         </PreviewSection>
         {qr.additionalInformation && (
            <PreviewSection title={t("dashboard.Additional information")}>
               {qr.additionalInformation}
            </PreviewSection>
         )}

         <p className="mt-2 text-sm text-muted-foreground">
            {t("quotation-request.Last updated")} {updatedAt}
         </p>

         <div className="mt-4 flex max-w-none flex-col gap-2 xs:max-w-md xs:flex-row">
            <Button className="w-full">{t("quotation-request.Make offer")}</Button>
            <Button className="w-full" variant="outline">
               {t("actions.Reject")}
            </Button>
         </div>
      </div>
   );
}

function PreviewSection({ title, children }: Readonly<PropsWithChildren<{ title: string }>>) {
   return (
      <section className="flex flex-col gap-1">
         <SectionTitle>{title}</SectionTitle>
         {children}
      </section>
   );
}

function SectionTitle({ children }: Readonly<PropsWithChildren>) {
   return <p className="inline-flex items-center gap-2 font-bold">{children} </p>;
}
