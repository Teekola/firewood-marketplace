"use client";

import { InfiniteList } from "@/components/infinite-list";
import { OfferDTO } from "@/db/offer";

import { LostOfferListItem } from "./lost-offer-list-item";
import { getLostOffersInfiniteQueryOptions } from "./query-options";

export function LostOffersList() {
   return (
      <InfiniteList<OfferDTO>
         getQueryOptions={getLostOffersInfiniteQueryOptions}
         ListItemComponent={LostOfferListItem}
         viewItems={async (ids) => console.log(ids)}
      />
   );
}
