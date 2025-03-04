"use client";

import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { updateViewedAt } from "../actions";
import { sellerUnseenQuotationRequestsQueryKey } from "../constants";

export function useUpdateQuotationRequestViewedAt({
   quotationRequestId,
}: Readonly<{ quotationRequestId?: string }>) {
   const queryClient = useQueryClient();
   useEffect(() => {
      if (!quotationRequestId) return;
      (async () => {
         await updateViewedAt(quotationRequestId);
         queryClient.invalidateQueries({ queryKey: sellerUnseenQuotationRequestsQueryKey });
      })();
   }, [quotationRequestId, queryClient]);
}
