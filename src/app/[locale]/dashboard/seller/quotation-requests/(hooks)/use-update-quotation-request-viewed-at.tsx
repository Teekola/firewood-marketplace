"use client";

import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { sellerUnseenQuotationRequestsQueryKey } from "../../(components)/quotation-request-sidebar-nav-indicator/constants";
import { updateViewedAt } from "../actions";

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
