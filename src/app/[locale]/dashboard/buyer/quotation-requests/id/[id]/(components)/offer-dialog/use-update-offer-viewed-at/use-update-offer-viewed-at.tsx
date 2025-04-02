"use client";

import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { buyerUnseenOffersQueryKey } from "@/app/[locale]/dashboard/buyer/constants";

import { buyerQuotationRequestsQueryKey } from "../../../../../constants";
import { updateBuyerViewedAt } from "./actions";

export function useUpdateOfferViewedAt({ offerIds }: Readonly<{ offerIds?: string[] }>) {
   const queryClient = useQueryClient();
   useEffect(() => {
      if (!offerIds || offerIds.length < 1) return;
      (async () => {
         await updateBuyerViewedAt(offerIds);

         queryClient.invalidateQueries({ queryKey: buyerUnseenOffersQueryKey });
         queryClient.invalidateQueries({ queryKey: buyerQuotationRequestsQueryKey });
      })();
   }, [offerIds, queryClient]);
}
