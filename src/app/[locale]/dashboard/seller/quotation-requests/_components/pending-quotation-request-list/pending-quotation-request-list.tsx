"use client";

import { useQueryClient } from "@tanstack/react-query";

import { InfiniteList } from "@/components/infinite-list";

import { sellerUnseenQuotationRequestsQueryKey } from "../../../_components/quotation-request-sidebar-nav-indicator/constants";
import { viewSellerQuotationRequestsAction } from "./actions";
import { PendingQuotationRequestListItem } from "./pending-quotation-request-list-item";
import {
   SellerQuotationRequest,
   getQuotationRequestsInfiniteQueryOptions,
   sellerQuotationRequestsQueryKey,
} from "./query-options";

export function PendingQuotationRequestList() {
   const queryClient = useQueryClient();

   async function viewItems(ids: string[]) {
      await viewSellerQuotationRequestsAction(ids);
      queryClient.invalidateQueries({ queryKey: sellerQuotationRequestsQueryKey });
      queryClient.invalidateQueries({ queryKey: sellerUnseenQuotationRequestsQueryKey });
   }

   return (
      <InfiniteList<SellerQuotationRequest>
         getQueryOptions={getQuotationRequestsInfiniteQueryOptions}
         ListItemComponent={PendingQuotationRequestListItem}
         viewItems={viewItems}
      />
   );
}
