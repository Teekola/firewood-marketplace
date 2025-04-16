"use client";

import { InfiniteList } from "@/components/infinite-list";

import {
   SellerQuotationRequest,
   getRejectedQuotationRequestsInfiniteQueryOptions,
} from "./query-options";
import { RejectedQuotationRequestListItem } from "./rejected-quotation-request-list-item";

async function viewItems(ids: string[]) {
   console.log("Viewed", ids);
}

export function RejectedQuotationRequestList() {
   return (
      <InfiniteList<SellerQuotationRequest>
         queryOptions={getRejectedQuotationRequestsInfiniteQueryOptions({})}
         ListItemComponent={RejectedQuotationRequestListItem}
         viewItems={viewItems}
      />
   );
}
