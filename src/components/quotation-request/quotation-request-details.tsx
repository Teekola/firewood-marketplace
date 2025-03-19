"use client";

import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";
import { PreviewSection } from "@/components/preview-section";
import { FirewoodDetails } from "@/components/quotation-request/firewood-details";
import { RelativeTime } from "@/components/relative-time";

import { DeliveryDetails } from "./delivery-details";
import { useQuotationRequestData } from "./use-quotation-request-data";

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
            <DeliveryDetails quotationRequest={qr} deliveryMethods={qr.deliveryMethods} />
         </PreviewSection>

         {qr.additionalInformation && (
            <PreviewSection title={t("dashboard.Additional information")}>
               {qr.additionalInformation}
            </PreviewSection>
         )}

         <p className="mt-2 text-sm text-muted-foreground">
            {t("quotation-request.Last updated")} <RelativeTime date={updatedAt} />
         </p>
      </div>
   );
}
