"use client";

import { ComponentProps, Fragment, useState } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { SortButton } from "@/app/[locale]/dashboard/buyer/quotation-requests/id/[id]/_components/offer-list/sort-button";
import { useInfiniteScroll } from "@/components/infinite-list/_hooks/use-infinite-scroll";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { OfferDTO } from "@/db/offer";
import { cn } from "@/lib/utils";
import { SortOrder } from "@/lib/utils/types";

import { useUpdateSellerLastSeen } from "../../(hooks)/use-update-seller-last-seen";
import { getOffersInfiniteQueryOptions } from "../query-options";
import { OfferListItem } from "./offer-list-item";

export function OfferListContainer() {
   const t = useTranslations();
   const [sortOrder, setSortOrder] = useState<SortOrder>("newest-first");
   const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
      useInfiniteQuery(getOffersInfiniteQueryOptions({ sortOrder }));

   const offers = data?.offers ?? [];
   const count = data?.count ?? 0;

   if (error) {
      return <p>{error.message}</p>;
   }

   return (
      <div className="flex flex-1 flex-col gap-1">
         <OfferListHeader
            count={count}
            offersLength={offers.length}
            isFetching={isFetching}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
         />
         <OfferList
            offers={offers}
            fetchNextPage={fetchNextPage}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
         />

         {isFetchingNextPage && (
            <p className="animate-pulse py-4 text-center text-sm">{t("pagination.Loading")}</p>
         )}
      </div>
   );
}

interface OfferListHeaderProps {
   count: number;
   offersLength: number;
   isFetching: boolean;
   sortOrder: SortOrder;
   setSortOrder: (sortOrder: SortOrder) => void;
}

function OfferListHeader({
   count,
   offersLength,
   isFetching,
   sortOrder,
   setSortOrder,
}: OfferListHeaderProps) {
   const t = useTranslations();

   return (
      <div className="flex items-center gap-2">
         {count === 0 && !isFetching && (
            <p className="text-sm text-foreground-muted">{t("offer.There are no active offers")}</p>
         )}
         {count > 0 && (
            <p className="text-sm text-foreground-muted">
               {t("pagination.displayed-results", { displayed: offersLength, total: count })}
            </p>
         )}
         {isFetching && (
            <p className="animate-pulse text-center text-sm text-foreground-muted">
               {t("pagination.Loading")}
            </p>
         )}

         <SortButton sortOrder={sortOrder} setSortOrder={setSortOrder} />
      </div>
   );
}

interface OfferListProps extends ComponentProps<typeof ScrollArea> {
   offers: OfferDTO[];
   isFetching?: boolean;
   fetchNextPage: () => void;
   hasNextPage?: boolean;
   isFetchingNextPage?: boolean;
}
function OfferList({
   offers,
   isFetching,
   isFetchingNextPage,
   hasNextPage,
   className,
   fetchNextPage,
   ...props
}: OfferListProps) {
   const { useTrackOfferVisibility } = useUpdateSellerLastSeen();
   const { ref } = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage });

   return (
      <ScrollArea {...props} className={cn("min-h-64", className)}>
         <ul className="flex min-h-20 w-full flex-col gap-1 pr-3">
            {isFetching && offers.length === 0 && (
               <>
                  <Skeleton className="h-[106px] w-full min-w-10" />
                  <Skeleton className="h-[106px] w-full min-w-10" />
                  <Skeleton className="h-[106px] w-full min-w-10" />
                  <Skeleton className="h-[106px] w-full min-w-10" />
                  <Skeleton className="h-[106px] w-full min-w-10" />
               </>
            )}
            {offers.map((offer, index) => {
               const isLast = index === offers.length - 1;
               return (
                  <Fragment key={offer.id}>
                     <OfferListItem
                        offer={offer}
                        useTrackOfferVisibility={useTrackOfferVisibility}
                     />
                     {isLast && <div ref={ref}></div>}
                  </Fragment>
               );
            })}
         </ul>
      </ScrollArea>
   );
}
