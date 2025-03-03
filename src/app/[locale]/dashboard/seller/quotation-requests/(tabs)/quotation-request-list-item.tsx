"use client";

import { forwardRef } from "react";

import { DeliveryMethod, WoodDryness } from "@prisma/client";
import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";
import { RelativeTime } from "@/components/relative-time";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Link, Pathname } from "@/i18n/routing";

import { useQuotationRequestData } from "../(hooks)/use-quotation-request-data";

export const QuotationRequestListItem = forwardRef<
   HTMLLIElement,
   Readonly<{ quotationRequest: QuotationRequest }>
>(({ quotationRequest }, ref) => {
   const t = useTranslations();

   const { updatedAt, amount, amountUnit, lengthUnit, maxLength } =
      useQuotationRequestData(quotationRequest);

   const linkPathname: Pathname = "/dashboard/seller/quotation-requests/id/[id]";

   return (
      <li ref={ref}>
         <Card className="flex flex-col justify-between gap-4 p-4 xs:flex-row">
            <div className="flex flex-col gap-2">
               <Link href={{ pathname: linkPathname, params: { id: quotationRequest.id } }}>
                  <CardTitle className="text-left font-bold hover:underline">
                     <span className="relative">
                        {amount} {amountUnit}
                        <sup className="text-xs">{"3"}</sup>
                     </span>{" "}
                     {quotationRequest.woodDryness === WoodDryness.ANY
                        ? t("request-offers.dry or green")
                        : t(`request-offers.${quotationRequest.woodDryness.toLowerCase()}`)}{" "}
                     {t(`request-offers.${quotationRequest.woodType.toLowerCase()}`)}
                     {maxLength && `, ${maxLength} ${lengthUnit}`}
                  </CardTitle>
               </Link>

               <p className="text-sm capitalize">
                  {t(`request-offers.${quotationRequest.deliveryMethod.toLowerCase()}`)}

                  {quotationRequest.deliveryMethod === DeliveryMethod.HOME_DELIVERY &&
                     `, ${quotationRequest.city}`}
               </p>

               <p className="text-sm text-muted-foreground">
                  {" "}
                  {t("quotation-request.Last updated")} <RelativeTime date={new Date(updatedAt)} />
               </p>
            </div>
            <Button asChild variant="outline" className="my-auto">
               <Link href={{ pathname: linkPathname, params: { id: quotationRequest.id } }}>
                  {t("View")}
               </Link>
            </Button>
         </Card>
      </li>
   );
});
QuotationRequestListItem.displayName = "QuotationRequestListItem";
