"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { getPendingQuotationRequestsForSeller } from "../actions";
import { sellerQuotationRequestsQueryKey } from "../constants";
import { QuotationRequestListItem } from "./quotation-request-list-item";

export function QuotationRequestsList() {
   const t = useTranslations();
   const { data: sellerQuotationRequests, error } = useQuery({
      queryKey: sellerQuotationRequestsQueryKey,
      queryFn: getPendingQuotationRequestsForSeller,
      refetchInterval: 30 * 1000, // Refetch every 30 seconds,
      staleTime: 5 * 1000, // Keep data fresh for 5 seconds
   });

   if (error) {
      return <p>{error.message}</p>;
   }

   if (!sellerQuotationRequests || sellerQuotationRequests.length < 1) {
      return <p>{t("quotation-request.There are no pending quotation requests")}</p>;
   }

   return (
      <>
         <ul className="flex min-h-20 w-full flex-col gap-1">
            {sellerQuotationRequests.map((sqr) => (
               <QuotationRequestListItem key={sqr.id} quotationRequest={sqr.quotationRequest} />
            ))}
         </ul>
      </>
   );
}
