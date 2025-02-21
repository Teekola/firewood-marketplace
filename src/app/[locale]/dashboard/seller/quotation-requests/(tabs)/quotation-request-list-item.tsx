"use client";

import { DeliveryMethod, WoodDryness } from "@prisma/client";
import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Link, Pathname } from "@/i18n/routing";

import { useQuotationRequestData } from "./use-quotation-request-data";

export function QuotationRequestListItem({
   quotationRequest,
}: Readonly<{
   quotationRequest: QuotationRequest;
}>) {
   const t = useTranslations();

   const { updatedAt, amount, amountUnit, lengthUnit, maxLength } =
      useQuotationRequestData(quotationRequest);

   const linkPathname: Pathname = "/dashboard/seller/quotation-requests/id/[id]";

   return (
      <li>
         <Card className="flex flex-col justify-between gap-4 p-4 xs:flex-row">
            <div className="flex flex-col gap-2">
               <Link href={{ pathname: linkPathname, params: { id: quotationRequest.id } }}>
                  <CardTitle className="text-left font-bold hover:underline">
                     <span className="relative pr-3">
                        {amount} {amountUnit}
                        <span className="absolute -translate-y-1/4 text-xs">{"3"}</span>
                     </span>
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

               <p className="text-sm text-muted-foreground">{updatedAt}</p>
            </div>
            <Button asChild variant="outline" className="my-auto">
               <Link href={{ pathname: linkPathname, params: { id: quotationRequest.id } }}>
                  {t("View")}
               </Link>
            </Button>
         </Card>
      </li>
   );
}
