"use client";

import { useQuery } from "@tanstack/react-query";

import { getQuotationRequestsForSeller } from "./actions";

export const sellerQuotationRequestsQueryKey = "seller-quotation-requests";

export function QuotationRequestsList() {
   const { data: quotationRequests, error } = useQuery({
      queryKey: [sellerQuotationRequestsQueryKey],
      queryFn: getQuotationRequestsForSeller,
      refetchInterval: 30 * 1000, // Refetch every 30 seconds
   });

   if (error) {
      return <p>{error.message}</p>;
   }

   if (!quotationRequests || quotationRequests.length < 1) {
      return <p>{"There are no quotation requests yet!"}</p>;
   }

   return (
      <ul>
         {quotationRequests.map((qr) => (
            <li key={qr.id}>{qr.id}</li>
         ))}
      </ul>
   );
}
