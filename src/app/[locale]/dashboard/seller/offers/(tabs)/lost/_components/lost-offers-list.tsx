"use client";

import { useTranslations } from "next-intl";

import { InfiniteList } from "@/components/infinite-list";
import { Skeleton } from "@/components/ui/skeleton";
import { OfferDTO } from "@/db/offer";

import { LostOfferListItem } from "./lost-offer-list-item";
import { getLostOffersInfiniteQueryOptions } from "./query-options";

export function LostOffersList() {
   const t = useTranslations();
   return (
      <InfiniteList<OfferDTO>
         getQueryOptions={getLostOffersInfiniteQueryOptions}
         ListItemComponent={LostOfferListItem}
         viewItems={async (ids) => console.log(ids)}
         emptyStateComponent={
            <p className="text-sm text-foreground-muted">{t("offer.There are no lost offers")}</p>
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
