"use client";

import { forwardRef } from "react";

import { useTranslations } from "next-intl";

import { ShortDeliveryDetails } from "@/components/quotation-request/short-delivery-details";
import { RelativeTime } from "@/components/relative-time";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { QuotationRequest } from "@/db/quotation-request";
import { Link, Pathname } from "@/i18n/routing";

import { QuotationRequestTitle } from "../../../(components)/quotation-request-title";

export const QuotationRequestListItem = forwardRef<
   HTMLLIElement,
   Readonly<{ quotationRequest: QuotationRequest; isNew?: boolean }>
>(({ quotationRequest, isNew }, ref) => {
   const t = useTranslations();

   const linkPathname: Pathname = "/dashboard/seller/quotation-requests/id/[id]";

   return (
      <li ref={ref}>
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

               <p className="text-sm text-muted-foreground">
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
});
QuotationRequestListItem.displayName = "QuotationRequestListItem";
