"use client";

import { InfiniteList } from "@/components/infinite-list";
import { OfferDTO } from "@/db/offer";

import { viewSentOffersAction } from "./actions";
import { OfferListItem } from "./offer-list-item";
import { getOffersInfiniteQueryOptions } from "./query-options";

export function OfferList() {
   return (
      <InfiniteList<OfferDTO>
         getQueryOptions={getOffersInfiniteQueryOptions}
         ListItemComponent={OfferListItem}
         viewItems={viewSentOffersAction}
      />
   );
}
