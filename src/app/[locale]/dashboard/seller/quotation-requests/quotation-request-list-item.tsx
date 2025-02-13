"use client";

import { DeliveryMethod } from "@prisma/client";
import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

import { QuotationRequestTitle } from "./quotation-request-title";
import { useQuotationRequestData } from "./use-quotation-request-data";

export function QuotationRequestListItem({
   quotationRequest,
   handleOpenQuotationRequest,
}: Readonly<{
   quotationRequest: QuotationRequest;
   handleOpenQuotationRequest: () => void;
}>) {
   const t = useTranslations();

   const { updatedAt } = useQuotationRequestData(quotationRequest);

   return (
      <li>
         <Card className="flex flex-col justify-between gap-4 p-4 xs:flex-row">
            <div className="flex flex-col gap-2">
               <button
                  className="rounded outline-none hover:underline focus-visible:underline"
                  onClick={handleOpenQuotationRequest}
               >
                  <CardTitle className="text-left font-bold">
                     <QuotationRequestTitle quotationRequest={quotationRequest} />
                  </CardTitle>
               </button>

               <p className="text-sm capitalize">
                  {t(`request-offers.${quotationRequest.deliveryMethod.toLowerCase()}`)}

                  {quotationRequest.deliveryMethod === DeliveryMethod.HOME_DELIVERY &&
                     `, ${quotationRequest.city}`}
               </p>

               <p className="text-sm text-muted-foreground">{updatedAt}</p>
            </div>
            <Button variant="outline" className="my-auto" onClick={handleOpenQuotationRequest}>
               {t("View")}
            </Button>
         </Card>
      </li>
   );
}
