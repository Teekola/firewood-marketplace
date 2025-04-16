"use client";

import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { TUseTrackViewing } from "@/components/infinite-list/types";
import { ShortDeliveryDetails } from "@/components/quotation-request/short-delivery-details";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { RelativeTime } from "@/components/ui/relative-time";
import { cn } from "@/lib/utils";

import { QuotationRequestTitle } from "../../../../_components/quotation-request-title";
import { restoreQuotationRequestAction } from "./actions";
import { SellerQuotationRequest, sellerRejectedQuotationRequestsQueryKey } from "./query-options";

export function RejectedQuotationRequestListItem({
   data: sellerQuotationRequest,
   useTrackViewing,
}: Readonly<{
   data: SellerQuotationRequest;
   useTrackViewing: TUseTrackViewing;
}>) {
   const t = useTranslations();
   const trackingRef = useTrackViewing(sellerQuotationRequest.id);
   const queryClient = useQueryClient();
   const [isRestoring, setIsRestoring] = useState(false);

   const { quotationRequest } = sellerQuotationRequest;

   async function restoreItem(sellerQuotationRequestId: string) {
      setIsRestoring(true);
      try {
         await restoreQuotationRequestAction(sellerQuotationRequestId);

         queryClient.invalidateQueries({
            queryKey: [...sellerRejectedQuotationRequestsQueryKey],
         });
      } catch (error) {
         console.error(error);
      }
      setIsRestoring(false);
   }

   return (
      <li ref={trackingRef} className={cn(isRestoring && "animate-pulse opacity-50")}>
         <Card className="flex flex-col justify-between gap-4 p-4 xs:flex-row">
            <div className="flex flex-col gap-2">
               <QuotationRequestTitle
                  quotationRequest={quotationRequest}
                  as={CardTitle}
                  className="text-left font-bold"
               />

               <ShortDeliveryDetails
                  deliveryMethods={quotationRequest.deliveryMethods}
                  deliveryCity={quotationRequest.city}
               />

               <p className="text-sm text-foreground-muted">
                  <RelativeTime
                     date={new Date(quotationRequest.updatedAt ?? quotationRequest.createdAt)}
                  />
               </p>
            </div>
            <Button
               variant="outline"
               className="my-auto"
               onClick={() => restoreItem(sellerQuotationRequest.id)}
            >
               {t("actions.Restore")}
            </Button>
         </Card>
      </li>
   );
}
