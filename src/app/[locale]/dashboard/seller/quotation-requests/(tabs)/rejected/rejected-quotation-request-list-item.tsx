"use client";

import { forwardRef } from "react";

import { DeliveryMethod, WoodDryness } from "@prisma/client";
import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";
import { RelativeTime } from "@/components/relative-time";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

import { useQuotationRequestData } from "../../../../../../../components/quotation-request/use-quotation-request-data";

export const RejectedQuotationRequestListItem = forwardRef<
   HTMLLIElement,
   Readonly<{ quotationRequest: QuotationRequest; restoreItem: (id: string) => void }>
>(({ quotationRequest, restoreItem }, ref) => {
   const t = useTranslations();

   const { updatedAt, amount, amountUnit, lengthUnit, maxLength } =
      useQuotationRequestData(quotationRequest);

   return (
      <li ref={ref}>
         <Card className="flex flex-col justify-between gap-4 p-4 xs:flex-row">
            <div className="flex flex-col gap-2">
               <CardTitle className="text-left font-bold">
                  <span className="relative pr-3">
                     {amount} {amountUnit}
                     <sup className="text-xs">{"3"}</sup>
                  </span>
                  {quotationRequest.woodDryness === WoodDryness.ANY
                     ? t("request-offers.dry or green")
                     : t(`request-offers.${quotationRequest.woodDryness.toLowerCase()}`)}{" "}
                  {t(`request-offers.${quotationRequest.woodType.toLowerCase()}`)}
                  {maxLength && `, ${maxLength} ${lengthUnit}`}
               </CardTitle>

               <p className="text-sm capitalize">
                  {t(`request-offers.${quotationRequest.deliveryMethod.toLowerCase()}`)}

                  {quotationRequest.deliveryMethod === DeliveryMethod.HOME_DELIVERY &&
                     `, ${quotationRequest.city}`}
               </p>

               <p className="text-sm text-muted-foreground">
                  <RelativeTime date={updatedAt} />
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
