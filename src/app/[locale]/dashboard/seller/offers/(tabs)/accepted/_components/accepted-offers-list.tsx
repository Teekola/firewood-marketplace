"use client";

import { InfiniteList } from "@/components/infinite-list";
import { OfferDTO } from "@/db/offer";

import { AcceptedOfferListItem } from "./accepted-offer-list-item";
import { getAcceptedOffersInfiniteQueryOptions } from "./query-options";

export function AcceptedOffersList() {
   return (
      <InfiniteList<OfferDTO>
         getQueryOptions={getAcceptedOffersInfiniteQueryOptions}
         ListItemComponent={AcceptedOfferListItem}
         viewItems={async (ids) => console.log(ids)}
      />
   );
}
