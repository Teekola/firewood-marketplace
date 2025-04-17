"use client";

import { InfiniteList } from "@/components/infinite-list";

import { OfferListItem } from "./offer-list-item";
import { getBuyerPendingOffersInfiniteQueryOptions } from "./query-options";

export function PendingOfferList({ quotationRequestId }: Readonly<{ quotationRequestId: string }>) {
   return (
      <InfiniteList
         getQueryOptions={() => getBuyerPendingOffersInfiniteQueryOptions({ quotationRequestId })}
         ListItemComponent={OfferListItem}
      />
   );
}
