"use client";

import { InfiniteList } from "@/components/infinite-list";

import { OfferListItem } from "../pending-offer-list/offer-list-item";
import { getBuyerRejectedOffersInfiniteQueryOptions } from "./query-options";

export function RejectedOfferList({
   quotationRequestId,
}: Readonly<{ quotationRequestId: string }>) {
   return (
      <InfiniteList
         getQueryOptions={() => getBuyerRejectedOffersInfiniteQueryOptions({ quotationRequestId })}
         ListItemComponent={OfferListItem}
      />
   );
}
