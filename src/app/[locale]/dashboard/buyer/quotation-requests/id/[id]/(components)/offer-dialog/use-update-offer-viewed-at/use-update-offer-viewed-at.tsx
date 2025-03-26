"use client";

import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { updateBuyerViewedAt } from "./actions";

export function useUpdateOfferViewedAt({ offerId }: Readonly<{ offerId?: string }>) {
   const queryClient = useQueryClient();
   useEffect(() => {
      if (!offerId) return;
      (async () => {
         await updateBuyerViewedAt(offerId);
         // TODO: Invalidate
         // queryClient.invalidateQueries({ queryKey: buyerUnseenOffersQueryKey });
      })();
   }, [offerId, queryClient]);
}
