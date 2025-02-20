"use client";

import { DeliveryMethod } from "@prisma/client";
import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

import { QuotationRequestTitle } from "./quotation-request-title";
import { useQuotationRequestData } from "./use-quotation-request-data";

export function QuotationRequestListItem({
   quotationRequest,
}: Readonly<{
   quotationRequest: QuotationRequest;
}>) {
   const t = useTranslations();

   const { updatedAt } = useQuotationRequestData(quotationRequest);

   const linkPathname = "/dashboard/seller/quotation-requests/[id]";

   return (
      <li>
         <Card className="flex flex-col justify-between gap-4 p-4 xs:flex-row">
            <div className="flex flex-col gap-2">
               <Link href={{ pathname: linkPathname, params: { id: quotationRequest.id } }}>
                  <CardTitle className="text-left font-bold hover:underline">
                     <QuotationRequestTitle quotationRequest={quotationRequest} />
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
