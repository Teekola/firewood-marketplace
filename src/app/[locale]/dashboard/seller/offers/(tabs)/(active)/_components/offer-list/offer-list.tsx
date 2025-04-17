"use client";

import { useTranslations } from "next-intl";

import { InfiniteList } from "@/components/infinite-list";
import { Skeleton } from "@/components/ui/skeleton";
import { OfferDTO } from "@/db/offer";

import { viewSentOffersAction } from "./actions";
import { OfferListItem } from "./offer-list-item";
import { getOffersInfiniteQueryOptions } from "./query-options";

export function OfferList() {
   const t = useTranslations();
   return (
      <InfiniteList<OfferDTO>
         getQueryOptions={getOffersInfiniteQueryOptions}
         ListItemComponent={OfferListItem}
         viewItems={viewSentOffersAction}
         emptyStateComponent={
            <p className="text-sm text-foreground-muted">{t("offer.There are no active offers")}</p>
         }
         loadingStateComponent={
            <div className="flex flex-col gap-1">
               {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-[154px] w-full" />
               ))}
            </div>
         }
      />
   );
}
