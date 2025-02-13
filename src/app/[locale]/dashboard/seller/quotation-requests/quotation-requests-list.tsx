"use client";

import { useState } from "react";

import { QuotationRequest } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { getQuotationRequestsForSeller } from "./actions";
import { sellerQuotationRequestsQueryKey } from "./constants";
import QuotationRequestDialog from "./quotation-request-dialog";
import { QuotationRequestListItem } from "./quotation-request-list-item";

export function QuotationRequestsList() {
   const [openQuotationRequest, setOpenQuotationRequest] = useState<QuotationRequest | null>(null);
   const { data: quotationRequests, error } = useQuery({
      queryKey: sellerQuotationRequestsQueryKey,
      queryFn: getQuotationRequestsForSeller,
      refetchInterval: 30 * 1000, // Refetch every 30 seconds,
      staleTime: 5 * 1000, // Keep data fresh for 5 seconds
   });

   if (error) {
      return <p>{error.message}</p>;
   }

   if (!quotationRequests || quotationRequests.length < 1) {
      return <p>{"There are no quotation requests yet!"}</p>;
   }

   return (
      <>
         <ul className="flex w-full flex-col gap-1">
            {quotationRequests.map((qr) => (
               <QuotationRequestListItem
                  key={qr.id}
                  quotationRequest={qr}
                  handleOpenQuotationRequest={() => setOpenQuotationRequest(qr)}
               />
            ))}
         </ul>
         <QuotationRequestDialog
            quotationRequest={openQuotationRequest}
            handleDialogClose={() => setOpenQuotationRequest(null)}
            isOpen={openQuotationRequest !== null}
         />
      </>
   );
}
