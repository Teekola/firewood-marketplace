"use client";

import { forwardRef } from "react";

import { useTranslations } from "next-intl";

import { QuotationRequestTitle } from "@/app/[locale]/dashboard/(components)/quotation-request-title";
import { QuotationRequest } from "@/app/db/quotation-request";
import { ShortDeliveryDetails } from "@/components/quotation-request/short-delivery-details";
import { RelativeTime } from "@/components/relative-time";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

export const RejectedQuotationRequestListItem = forwardRef<
   HTMLLIElement,
   Readonly<{ quotationRequest: QuotationRequest; restoreItem: (id: string) => void }>
>(({ quotationRequest, restoreItem }, ref) => {
   const t = useTranslations();

   return (
      <li ref={ref}>
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

               <p className="text-sm text-muted-foreground">
                  <RelativeTime date={new Date(quotationRequest.updatedAt)} />
               </p>
            </div>
            <Button
               variant="outline"
               className="my-auto"
               onClick={() => restoreItem(quotationRequest.id)}
            >
               {t("actions.Restore")}
            </Button>
         </Card>
      </li>
   );
});
RejectedQuotationRequestListItem.displayName = "RejectedQuotationRequestListItem";
