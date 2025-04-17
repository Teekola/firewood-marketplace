"use client";

import { useTranslations } from "next-intl";

import { InfiniteList } from "@/components/infinite-list";
import { Skeleton } from "@/components/ui/skeleton";
import { OfferDTO } from "@/db/offer";

import { AcceptedOfferListItem } from "./accepted-offer-list-item";
import { getAcceptedOffersInfiniteQueryOptions } from "./query-options";

export function AcceptedOffersList() {
   const t = useTranslations();
   return (
      <InfiniteList<OfferDTO>
         getQueryOptions={getAcceptedOffersInfiniteQueryOptions}
         ListItemComponent={AcceptedOfferListItem}
         viewItems={async (ids) => console.log(ids)}
         emptyStateComponent={
            <p className="text-sm text-foreground-muted">
               {t("offer.There are no accepted offers")}
            </p>
         }
         loadingStateComponent={
            <div className="flex flex-col gap-2">
               {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-[154px] w-full" />
               ))}
            </div>
         }
      />
   );
}
