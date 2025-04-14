"use client";

import { useTranslations } from "next-intl";

import { PreviewSection } from "@/components/preview-section";
import { FirewoodDetails } from "@/components/quotation-request/firewood-details";
import { RelativeTime } from "@/components/ui/relative-time";
import { QuotationRequest } from "@/db/quotation-request";

import { DeliveryDetails } from "./delivery-details";

export default function QuotationRequestDetails({
   quotationRequest: qr,
}: Readonly<{ quotationRequest: QuotationRequest }>) {
   const t = useTranslations();

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

         <p className="mt-2 text-sm text-foreground-muted">
            {t("quotation-request.Last updated")}{" "}
            <RelativeTime date={new Date(qr.updatedAt ?? qr.createdAt)} />
         </p>
      </div>
   );
}
