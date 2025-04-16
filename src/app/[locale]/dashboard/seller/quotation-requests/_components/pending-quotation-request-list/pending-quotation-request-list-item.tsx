"use client";

import { useTranslations } from "next-intl";

import { TUseTrackViewing } from "@/components/infinite-list/types";
import { ShortDeliveryDetails } from "@/components/quotation-request/short-delivery-details";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { RelativeTime } from "@/components/ui/relative-time";
import { Link, Pathname } from "@/i18n/routing";

import { QuotationRequestTitle } from "../../../../_components/quotation-request-title";
import { SellerQuotationRequest } from "./query-options";

export function PendingQuotationRequestListItem({
   data: sellerQuotationRequest,
   useTrackViewing,
}: Readonly<{ data: SellerQuotationRequest; useTrackViewing: TUseTrackViewing }>) {
   const t = useTranslations();
   const trackingRef = useTrackViewing(sellerQuotationRequest.id);

   const { quotationRequest } = sellerQuotationRequest;
   const linkPathname: Pathname = "/dashboard/seller/quotation-requests/id/[id]";
   const isNew =
      !sellerQuotationRequest.lastViewedAt ||
      sellerQuotationRequest.lastViewedAt <
         (sellerQuotationRequest.quotationRequest.updatedAt ??
            sellerQuotationRequest.quotationRequest.createdAt);

   return (
      <li ref={trackingRef}>
         <Card className="relative flex flex-col justify-between gap-4 p-4 xs:flex-row">
            <div className="flex flex-col gap-2">
               <Link href={{ pathname: linkPathname, params: { id: quotationRequest.id } }}>
                  <CardTitle className="text-left font-bold hover:underline">
                     <QuotationRequestTitle quotationRequest={quotationRequest} />
                  </CardTitle>
               </Link>

               <ShortDeliveryDetails
                  deliveryMethods={quotationRequest.deliveryMethods}
                  deliveryCity={quotationRequest.city}
               />

               <p className="text-sm text-foreground-muted">
                  {quotationRequest.updatedAt
                     ? t("quotation-request.Last updated")
                     : t("quotation-request.Created")}{" "}
                  <RelativeTime
                     date={new Date(quotationRequest.updatedAt ?? quotationRequest.createdAt)}
                  />
               </p>
            </div>
            <div className="flex flex-col items-end">
               {isNew && (
                  <p className="absolute right-4 top-1 w-fit rounded-full bg-destructive px-2 py-1 text-xs font-bold text-destructive-foreground">
                     {t("quotation-request.New")}
                  </p>
               )}
               <Button asChild variant="outline" className="my-auto">
                  <Link href={{ pathname: linkPathname, params: { id: quotationRequest.id } }}>
                     {t("View")}
                  </Link>
               </Button>
            </div>
         </Card>
      </li>
   );
}
