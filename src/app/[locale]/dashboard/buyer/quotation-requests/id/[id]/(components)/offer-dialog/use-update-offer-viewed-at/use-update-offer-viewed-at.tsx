"use client";

import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { buyerUnseenOffersQueryKey } from "@/app/[locale]/dashboard/buyer/constants";

import { buyerQuotationRequestsQueryKey } from "../../../../../constants";
import { updateBuyerViewedAt } from "./actions";

export function useUpdateOfferViewedAt({ offerId }: Readonly<{ offerId?: string }>) {
   const queryClient = useQueryClient();
   useEffect(() => {
      if (!offerId) return;
      (async () => {
         await updateBuyerViewedAt(offerId);

         queryClient.invalidateQueries({ queryKey: buyerUnseenOffersQueryKey });
         queryClient.invalidateQueries({ queryKey: buyerQuotationRequestsQueryKey });
      })();
   }, [offerId, queryClient]);
}
