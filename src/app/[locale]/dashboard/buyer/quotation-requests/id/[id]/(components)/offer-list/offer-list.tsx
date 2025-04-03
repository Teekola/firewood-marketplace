"use client";

import { useEffect } from "react";

import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { getPendingOffersForBuyerByQuotationRequestId } from "../../actions";
import { buyerOffersQueryKey } from "../../constants";
import { OfferListItem } from "./offer-list-item";
import { SortButton } from "./sort-button";
import { useOfferListData } from "./use-offer-list-data";

export function OfferList({
   queryKey = buyerOffersQueryKey,
   queryFn = getPendingOffersForBuyerByQuotationRequestId,
   ListItem = OfferListItem,
   emptyText,
}: {
   emptyText?: string;
   queryKey?: string[];
   queryFn?: typeof getPendingOffersForBuyerByQuotationRequestId;
   ListItem?: typeof OfferListItem;
}) {
   const t = useTranslations();
   const { ref, inView } = useInView();

   const {
      offers,
      count,
      error,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isFetching,
      sortOrder,
      setSortOrder,
   } = useOfferListData({ queryFn, queryKey });

   // Fetch next page when the last item is in view
   useEffect(() => {
      if (inView && hasNextPage && !isFetchingNextPage) {
         fetchNextPage();
      }
   }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

   if (error) {
      return <p>{error.message}</p>;
   }

   return (
      <div className="flex flex-1 flex-col gap-1">
         <div className="flex items-center gap-2">
            {count !== undefined && count > 0 && (
               <p className="text-sm text-muted-foreground">
                  {t("pagination.displayed-results", { displayed: offers.length, total: count })}{" "}
               </p>
            )}
            {isFetching && (
               <p className="animate-pulse text-center text-sm text-muted-foreground">
                  {t("pagination.Loading")}
               </p>
            )}
            <SortButton sortOrder={sortOrder} setSortOrder={setSortOrder} />
         </div>

         <ScrollArea className="min-h-64">
            {count === 0 && !isFetching && (
               <div className="flex flex-col items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                     {emptyText ?? t("buyer.No offers")}
                  </p>
               </div>
            )}
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
               {offers.map((offer, index) => (
                  <ListItem
                     key={offer.id}
                     offer={offer}
                     ref={index === offers.length - 1 ? ref : null}
                  />
               ))}
            </ul>
         </ScrollArea>

         {isFetchingNextPage && (
            <p className="animate-pulse py-4 text-center text-sm">{t("pagination.Loading")}</p>
         )}
      </div>
   );
}
