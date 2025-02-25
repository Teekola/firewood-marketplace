"use client";

import { PropsWithChildren } from "react";

import { WoodDryness } from "@prisma/client";
import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

import { useQuotationRequestData } from "../(hooks)/use-quotation-request-data";
import { RejectQuotationRequestDialog } from "./reject-quotation-request-dialog";

export default function QuotationRequestDetails({
   quotationRequest: qr,
}: Readonly<{ quotationRequest: QuotationRequest }>) {
   const t = useTranslations();

   const { updatedAt } = useQuotationRequestData(qr);

   return (
      <div className="flex flex-col gap-3">
         <PreviewSection title={t("request-offers.Firewood")}>
            <FirewoodDetails quotationRequest={qr} />
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

         <div className="mt-4 flex max-w-lg flex-col gap-2 sm:flex-row-reverse">
            <Button asChild className="w-full" size="lg">
               <Link
                  href={{
                     pathname: "/dashboard/seller/quotation-requests/id/[id]/make-offer",
                     params: { id: qr.id },
                  }}
               >
                  {t("quotation-request.Make offer")}
               </Link>
            </Button>
            <RejectQuotationRequestDialog quotationRequestId={qr.id} className="w-full" />
         </div>
      </div>
   );
}

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
            {", "}
            {maxLength && `${t("request-offers.Max length")} ${maxLength} ${lengthUnit}`}
         </p>
      </>
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
